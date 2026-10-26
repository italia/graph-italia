import {
    getAuth,
    oidcAuthMiddleware,
    processOAuthCallback,
    revokeSession,
    type IDToken,
    type OidcAuth,
    type OidcClaimsHook,
    type TokenEndpointResponses
} from "@hono/oidc-auth";
import { Hono, type Context } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import * as z from "zod";
import { withAdminEmails } from "../lib/adminEmails";
import db from "../lib/db";
import type { User } from "../lib/db/prisma/client";
import { sendOidcEmailCode } from "../lib/email";
import { clearAccessTokenCookie, generateTokens, setAccessTokenCookie } from "../lib/jwt";
import { IpaUnavailableError, resolvePa } from "../lib/ipa";
import { logger } from "../lib/logger";
import {
    clearEmailVerification,
    emailCodeMatches,
    readEmailVerification,
    setPendingEmailVerification,
    setVerifiedEmail,
} from "../lib/oidcEmailVerification";
import { isPasswordAuthEnabled } from "../lib/passwordAuth";
import generatePin from "../lib/pin";
import { tryConsume } from "../lib/rateLimit";

declare module 'hono' {
    interface OidcAuthClaims {
        name?: string
        given_name?: string
        family_name?: string
        fiscal_number?: string
    }
}

const errorMessageSchema = z.object({
    error: z.string(),
});

// Il claims hook viene invocato da @hono/oidc-auth con (orig, claims, response):
// `claims` sono i claims dell'ID token, `response.access_token` è l'access token del
// token endpoint — unico momento in cui è disponibile. Lo chiudiamo su `c` così può
// leggere `oidcAuthorizationServer` (già popolato da processOAuthCallback/getAuth) e
// interrogare l'endpoint userinfo, dove IAM Proxy Italia espone gli attributi SPID/CIE.
const createOidcClaimsHook = (c: Context): OidcClaimsHook =>
    async (orig: OidcAuth | undefined, claims: IDToken | undefined, response: TokenEndpointResponses) => {
        let info: Record<string, unknown> = {};
        const userinfoEndpoint = c.get('oidcAuthorizationServer')?.userinfo_endpoint;
        console.log('OIDC userinfo endpoint:', userinfoEndpoint);
        if (userinfoEndpoint && response.access_token) {
            try {
                info = await fetch(userinfoEndpoint, {
                    headers: { Authorization: `Bearer ${response.access_token}` },
                }).then((res) => res.json());
                console.log('OIDC userinfo claims:', JSON.stringify(info, null, 2));
                logger.info('OIDC userinfo claims', info);
            } catch (err) {
                logger.error('OIDC userinfo fetch failed', err instanceof Error ? err : new Error(String(err)));
            }
        }
        // ID token prima, userinfo come fallback: copre sia il mock (claims nell'ID token)
        // sia l'IdP reale (claims via userinfo).
        const pick = (k: string) => (claims?.[k] ?? info[k] ?? orig?.[k]) as string | undefined;
        return {
            sub: pick('sub') ?? '',
            email: pick('email') ?? '',
            name: pick('name'),
            given_name: pick('given_name'),
            family_name: pick('family_name'),
            fiscal_number: pick('fiscal_number'),
        };
    };

const APP_URL = process.env.APP_URL || "/";

// Risolve la sessione OIDC leggendo il cookie `oidc-auth`. Imposta il claims hook
// così che, se getAuth rinnova il token (refresh), i claims vengano ricalcolati e la
// userinfo re-interrogata. A differenza di oidcAuthMiddleware NON avvia un redirect
// verso il provider quando la sessione manca: ritorna semplicemente `null`, così gli
// endpoint chiamati via fetch (status/signup) possono rispondere con un 401 JSON.
const resolveOidcAuth = (c: Context) => {
    c.set('oidcClaimsHook', createOidcClaimsHook(c));
    return getAuth(c);
};

const router = new Hono();

// ─── OIDC callback ────────────────────────────────────────────────────────────
// Riceve il `code` dal provider e completa lo scambio token: processOAuthCallback
// imposta la sessione `oidc-auth` e redirige al cookie `continue` (settato da
// oidcAuthMiddleware sulla route /login), dove viene emessa la sessione applicativa.
router.get(
    '/callback',
    describeRoute(({
        description: 'Endpoint that gets the code from the ID provider and exchanges it for tokens',
        responses: {
            302: { description: "Redirect to the application URL or to the signup page" },
            500: {
                description: "OIDC token exchange failed",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            }
        }
    })),
    async (c) => {
        try {
            // Il hook (chiuso su `c`) risolve gli attributi utente durante lo scambio token.
            // processOAuthCallback ritorna un redirect 302 verso il cookie `continue` (/login):
            // va ritornato, altrimenti il flusso non prosegue e la sessione non viene emessa.
            c.set('oidcClaimsHook', createOidcClaimsHook(c));
            return await processOAuthCallback(c);
        } catch (err) {
            logger.error('OIDC token exchange failed', err instanceof Error ? err : new Error(String(err)))
            return c.json({ error: 'OIDC token exchange failed' }, 500)
        }
    }
);

// ─── Collegamento account ─────────────────────────────────────────────────────
// L'email è la chiave che lega un accesso SPID/CIE a un account:
// - se IAM Proxy la fornisce (fidata) si cerca l'account per email, anche se
//   registrato con password, e gli si collega il `sub`;
// - se manca (CIE, a volte SPID) l'utente la inserisce e la conferma con un
//   codice in fase di registrazione; da lì il `sub` resta collegato all'account
//   (OidcIdentity) e agli accessi successivi basta quello.
// Un account può avere più `sub` (SPID e CIE ne emettono di diversi).

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() || undefined

// Sola lettura: account per email fornita dall'IdP, altrimenti per `sub` già collegato.
const findOidcUser = async (sub: string, idpEmail?: string) => {
    if (idpEmail) {
        const byEmail = await db.findUserByEmail(idpEmail)
        if (byEmail) return byEmail
    }
    return db.findUserByOidcSub(sub)
}

// Collega il `sub` all'account e apre la sessione applicativa. L'email è stata
// verificata (dall'IdP o con il codice), quindi l'account risulta attivo anche se
// era una registrazione con password mai confermata.
const linkAndLogin = async (c: Context, user: User, sub: string) => {
    await db.linkOidcIdentity(user.id, sub)
    const active = await withAdminEmails(user.verified ? user : await db.setVerified(user.id))
    const { accessToken } = generateTokens(active)
    setAccessTokenCookie(c, accessToken)
    return active
}

// ─── OIDC login ───────────────────────────────────────────────────────────────
// Route protetta: se non autenticato, oidcAuthMiddleware avvia il flusso verso il
// provider e imposta il cookie `continue` su questa stessa URL. Al ritorno dal
// /callback la sessione oidc-auth è disponibile, quindi getAuth() restituisce i
// claim: qui risolviamo l'account (vedi sopra) e generiamo il JWT applicativo.
router.use('/login', oidcAuthMiddleware())
router.get(
    '/login',
    describeRoute(({
        description: 'Starts the OIDC flow and, once authenticated, issues the application session',
        "responses": {
            302: { description: "Redirect to the application URL or to the signup page" },
            401: {
                description: "Unauthorized: OIDC session required, missing sub",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            }
        }
    })),
    async (c) => {
        const oidcAuth = await resolveOidcAuth(c)
        logger.info('OIDC auth claims', oidcAuth ?? {})
        if (!oidcAuth?.sub) {
            //TODO: redirect to a page that explains the error and how to fix it
            return c.json({ error: 'OIDC auth failed' }, 401)
        }
        const sub = oidcAuth.sub

        const user = await findOidcUser(sub, normalizeEmail(oidcAuth.email))
        if (!user) {
            // Nessun account per questa email/sub: la pagina di registrazione rilegge
            // claims e stato dalla sessione OIDC (il param `t` è solo indicativo lato UI).
            logger.info('OIDC first access, redirecting to signup', { sub })
            return c.redirect(`${APP_URL}/oidc/signup?t=${encodeURIComponent(sub)}`)
        }

        await linkAndLogin(c, user, sub)
        logger.info('User logged in via OIDC', { userId: user.id, sub })
        return c.redirect(APP_URL)
    }
);

// ─── OIDC signup: stato registrazione ──────────────────────────────────────────
// Interrogato dalla pagina /oidc/signup PRIMA di mostrare il form: dice se l'utente
// è già registrato, se l'email arriva dall'IdP o è già stata confermata con il
// codice (altrimenti il form deve prima chiederla e verificarla) e restituisce i
// claim per precompilarlo. L'identità arriva dalla sessione OIDC, mai dal query param.
router.get(
    '/signup/status',
    describeRoute(({
        description: 'Reports whether the OIDC user is already registered and whether their email is known and verified',
        responses: {
            200: {
                description: "Signup state for the OIDC user",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                registered: { type: "boolean" },
                                email: { type: "string" },
                                emailFromIdp: { type: "boolean" },
                                emailVerified: { type: "boolean" },
                                given_name: { type: "string" },
                                family_name: { type: "string" },
                            }
                        }
                    }
                }
            },
            401: {
                description: "Unauthorized: OIDC session required, missing sub", content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
        }
    })),
    async (c) => {
        const oidcAuth = await resolveOidcAuth(c)
        if (!oidcAuth?.sub) {
            return c.json({ error: 'OIDC session required' }, 401)
        }
        const idpEmail = normalizeEmail(oidcAuth.email)
        const existing = await findOidcUser(oidcAuth.sub, idpEmail)
        const pending = idpEmail ? null : readEmailVerification(c, oidcAuth.sub)
        return c.json({
            registered: !!existing,
            email: idpEmail ?? pending?.email ?? '',
            emailFromIdp: !!idpEmail,
            emailVerified: !!idpEmail || pending?.verified === true,
            given_name: oidcAuth.given_name ?? '',
            family_name: oidcAuth.family_name ?? '',
        })
    }
);

// ─── OIDC signup: invio codice di verifica email ───────────────────────────────
// Solo quando l'IdP non fornisce l'email: la invia all'indirizzo indicato
// dall'utente e lega il codice (HMAC) al `sub` in un cookie firmato.
const emailBodySchema = z.object({ email: z.email() })

router.post(
    '/signup/email/send',
    describeRoute(({
        description: 'Mails a verification code to the email typed by an OIDC user whose identity provider sent none',
        responses: {
            200: { description: "Code sent" },
            400: { description: "Invalid email, or email already provided by the identity provider", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
            401: { description: "Unauthorized: OIDC session required", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
            429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
        }
    })),
    async (c) => {
        const oidcAuth = await resolveOidcAuth(c)
        if (!oidcAuth?.sub) {
            return c.json({ error: 'OIDC session required' }, 401)
        }
        if (normalizeEmail(oidcAuth.email)) {
            return c.json({ error: 'Email already provided by the identity provider' }, 400)
        }
        const parsed = emailBodySchema.safeParse(await c.req.json().catch(() => ({})))
        if (!parsed.success) {
            return c.json({ error: 'Invalid email address' }, 400)
        }
        const email = normalizeEmail(parsed.data.email)!

        const perSub = tryConsume('oidc:email:send', oidcAuth.sub, { windowMs: 60 * 60 * 1000, max: 5 })
        if (!perSub.ok) {
            c.header('Retry-After', `${perSub.retryAfterSec}`)
            return c.json({ error: 'Too many attempts. Try again later.' }, 429)
        }

        const code = generatePin()
        setPendingEmailVerification(c, oidcAuth.sub, email, code)
        await sendOidcEmailCode(email, code)
        return c.json({ sent: true })
    }
);

// ─── OIDC signup: conferma codice email ────────────────────────────────────────
// Se il codice è corretto l'email è verificata: se esiste già un account con
// quell'email gli si collega il `sub` e si apre la sessione ({ auth: true });
// altrimenti l'email resta confermata nel cookie per il completamento della
// registrazione ({ auth: false }).
const codeBodySchema = z.object({ code: z.string().trim().min(1) })

router.post(
    '/signup/email/verify',
    describeRoute(({
        description: 'Checks the email verification code; logs in when the email already belongs to an account',
        responses: {
            200: {
                description: "Email verified",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                auth: { type: "boolean" },
                                email: { type: "string" },
                            }
                        }
                    }
                }
            },
            400: { description: "Code invalid or expired", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
            401: { description: "Unauthorized: OIDC session required", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
            429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
        }
    })),
    async (c) => {
        const oidcAuth = await resolveOidcAuth(c)
        if (!oidcAuth?.sub) {
            return c.json({ error: 'OIDC session required' }, 401)
        }
        const sub = oidcAuth.sub
        const parsed = codeBodySchema.safeParse(await c.req.json().catch(() => ({})))
        if (!parsed.success) {
            return c.json({ error: 'Code invalid or expired.' }, 400)
        }

        // Il PIN è di 6 cifre: limita i tentativi per `sub` anche cambiando IP.
        const perSub = tryConsume('oidc:email:verify', sub, { windowMs: 15 * 60 * 1000, max: 10 })
        if (!perSub.ok) {
            c.header('Retry-After', `${perSub.retryAfterSec}`)
            return c.json({ error: 'Too many attempts. Try again later.' }, 429)
        }

        const pending = readEmailVerification(c, sub)
        if (!pending || !emailCodeMatches(pending, parsed.data.code)) {
            return c.json({ error: 'Code invalid or expired.' }, 400)
        }

        const existing = await db.findUserByEmail(pending.email)
        if (existing) {
            clearEmailVerification(c)
            await linkAndLogin(c, existing, sub)
            logger.info('OIDC identity linked to existing account by verified email', { userId: existing.id, sub })
            return c.json({ auth: true, email: pending.email })
        }

        setVerifiedEmail(c, sub, pending.email)
        return c.json({ auth: false, email: pending.email })
    }
);

// ─── OIDC signup: completamento ────────────────────────────────────────────────
// Crea l'account collegato al `sub` e apre la sessione applicativa. L'email non
// arriva dal form: è quella fornita dall'IdP oppure quella confermata con il
// codice. Se nel frattempo esiste già un account con quell'email, lo si collega.
router.post(
    '/signup',
    describeRoute(({
        description: 'Completes OIDC signup: creates the account for the verified email, links sub and logs in',
        "responses": {
            200: {
                description: "User registered via OIDC",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                auth: { type: "boolean" }
                            }
                        }
                    }
                }
            },
            401: {
                description: "Unauthorized: OIDC session required, missing sub",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
            400: {
                description: "No verified email, invalid request body, or PA not found in IndicePA",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
            503: {
                description: "List of IndicePA public administrations not available: the PA cannot be verified",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
        }
    })),
    async (c) => {
        const oidcAuth = await resolveOidcAuth(c)
        if (!oidcAuth?.sub) {
            return c.json({ error: 'OIDC session required' }, 401)
        }
        const sub = oidcAuth.sub
        const idpEmail = normalizeEmail(oidcAuth.email)

        // Già registrato (es. doppio submit / navigazione ripetuta): apri la sessione.
        const existing = await findOidcUser(sub, idpEmail)
        if (existing) {
            await linkAndLogin(c, existing, sub)
            return c.json({ auth: true })
        }

        const pending = idpEmail ? null : readEmailVerification(c, sub)
        const email = idpEmail ?? (pending?.verified ? pending.email : undefined)
        if (!email) {
            return c.json({ error: { message: 'a verified email is required' } }, 400)
        }

        const body = await c.req.json().catch(() => ({} as Record<string, unknown>))
        // Con l'accesso via password attivo la registrazione SPID/CIE imposta anche una
        // password (utilizzabile in alternativa); in modalità solo SPID/CIE l'account
        // nasce senza password e la si ignora anche se inviata.
        let password: string | undefined
        if (isPasswordAuthEnabled()) {
            password = typeof body?.password === 'string' ? body.password : ''
            if (!password) {
                return c.json({ error: { message: 'password is required' } }, 400)
            }
        }

        // Email confermata con il codice ma account creato nel frattempo: collegalo.
        const byEmail = await db.findUserByEmail(email)
        if (byEmail) {
            clearEmailVerification(c)
            await linkAndLogin(c, byEmail, sub)
            return c.json({ auth: true })
        }

        // Pubblica Amministrazione di appartenenza: chiesta dal form, opzionale sul modello.
        // Se inviata dev'essere un ente di IndicePA («<codice IPA>#<denominazione>», lib/ipa.ts).
        let pa: string | undefined
        if (typeof body?.pa === 'string' && body.pa.trim()) {
            try {
                pa = (await resolvePa(body.pa)) ?? undefined
            } catch (err) {
                if (err instanceof IpaUnavailableError) {
                    return c.json({ error: { message: 'The list of public administrations is not available, please try again later.' } }, 503)
                }
                throw err
            }
            if (!pa) {
                return c.json({ error: { message: 'Public administration not found in IndicePA.' } }, 400)
            }
        }

        const user = await db.createUserByEmailAndPassword({ email, password, sub, pa })
        clearEmailVerification(c)
        await linkAndLogin(c, user, sub)
        logger.info('User registered via OIDC', { userId: user.id, sub })
        return c.json({ auth: true })
    }
);

// ─── OIDC logout ─────────────────────────────────────────────────────────────
router.get(
    '/logout',
    describeRoute(({
        description: 'Endpoint that logs the users out',
        responses: {
            302: { description: "Redirect to the application URL" },
        }
    })),
    async (c) => {
        await revokeSession(c)         // revoca sessione OIDC
        clearAccessTokenCookie(c)      // revoca sessione tua
        logger.info('User logged out via OIDC')
        return c.redirect(APP_URL)
    }
);

export default router;