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
import db from "../lib/db";
import { clearAccessTokenCookie, generateTokens, setAccessTokenCookie } from "../lib/jwt";
import { logger } from "../lib/logger";

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

// ─── OIDC login ───────────────────────────────────────────────────────────────
// Route protetta: se non autenticato, oidcAuthMiddleware avvia il flusso verso il
// provider e imposta il cookie `continue` su questa stessa URL. Al ritorno dal
// /callback la sessione oidc-auth è disponibile, quindi getAuth() restituisce i
// claim: qui creiamo/carichiamo l'utente e generiamo il JWT applicativo.
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
        // L'identità è il `sub` OIDC (stabile per SPID/CIE), non l'email.
        if (!oidcAuth?.sub) {
            //TODO: redirect to a page that explains the error and how to fix it
            return c.json({ error: 'OIDC auth failed' }, 401)
        }

        const user = await db.findUserBySub(oidcAuth.sub)
        if (!user) {
            // Primo accesso: nessun account collegato a questo `sub`. Non creiamo nulla
            // qui — reindirizziamo alla pagina di registrazione frontend, che rileggerà
            // `sub`/claims dalla sessione OIDC (il param `t` è solo indicativo lato UI).
            logger.info('OIDC first access, redirecting to signup', { sub: oidcAuth.sub })
            return c.redirect(`${APP_URL}/oidc/signup?t=${encodeURIComponent(oidcAuth.sub)}`)
        }

        const { accessToken } = generateTokens(user)
        setAccessTokenCookie(c, accessToken)

        logger.info('User logged in via OIDC', { userId: user.id, sub: oidcAuth.sub })
        return c.redirect(APP_URL)
    }
);

// ─── OIDC signup: stato registrazione ──────────────────────────────────────────
// Interrogato dalla pagina /oidc/signup PRIMA di mostrare il form: dice se l'utente
// legato a questo `sub` ha già completato la registrazione, e restituisce i claim
// (email/nome) per precompilare il form. L'identità arriva dalla sessione OIDC, mai
// dal query param.
router.get(
    '/signup/status',
    describeRoute(({
        description: 'Reports whether the OIDC user (by sub) has already completed signup',
        responses: {
            200: { description: "Get the claims for the OIDC user", content: { "application/json": { schema: { type: "object", properties: { auth: { type: "boolean" } } } } } },
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
        const existing = await db.findUserBySub(oidcAuth.sub)
        return c.json({
            registered: !!existing,
            email: oidcAuth.email ?? '',
            given_name: oidcAuth.given_name ?? '',
            family_name: oidcAuth.family_name ?? '',
        })
    }
);

// ─── OIDC signup: completamento ────────────────────────────────────────────────
// Crea l'account collegato al `sub` (letto dalla sessione OIDC) e apre la sessione
// applicativa. L'email arriva dal form: se è già usata da un altro account viene
// bloccata (nessun collegamento automatico).
router.post(
    '/signup',
    describeRoute(({
        description: 'Completes OIDC signup: creates the account linked to sub and logs in',
        "responses": {
            200: { description: "User registered via OIDC", content: { "application/json": { schema: { type: "object", properties: { auth: { type: "boolean" } } } } } },
            401: {
                description: "Unauthorized: OIDC session required, missing sub",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
            400: {
                description: "Invalid request body",
                content: {
                    "application/json": {
                        schema: resolver(errorMessageSchema),
                    }
                }
            },
            409: {
                description: "Email already in use",
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
        if (!oidcAuth?.sub) {
            return c.json({ error: 'OIDC session required' }, 401)
        }
        const sub = oidcAuth.sub

        // Già registrato (es. doppio submit / navigazione ripetuta): apri la sessione.
        const existingBySub = await db.findUserBySub(sub)
        if (existingBySub) {
            const { accessToken } = generateTokens(existingBySub)
            setAccessTokenCookie(c, accessToken)
            return c.json({ auth: true })
        }

        const body = await c.req.json().catch(() => ({} as Record<string, unknown>))
        const email = typeof body?.email === 'string' ? body.email.trim() : ''
        const password = typeof body?.password === 'string' ? body.password : ''
        if (!email || !password) {
            return c.json({ error: { message: 'email and password are required' } }, 400)
        }

        // Email già in uso da un altro account (senza sub): blocca.
        const existingByEmail = await db.findUserByEmail(email)
        if (existingByEmail) {
            return c.json({ error: { message: 'email already in use' } }, 409)
        }

        const user = await db.createUserByEmailAndPassword({ email, password, sub })
        await db.setVerified(user.id)

        const { accessToken } = generateTokens(user)
        setAccessTokenCookie(c, accessToken)
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