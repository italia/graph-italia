import { getAuth, oidcAuthMiddleware, processOAuthCallback, revokeSession, type IDToken, type OidcAuth, type OidcClaimsHook, type TokenEndpointResponses } from "@hono/oidc-auth";
import { Hono, type Context } from "hono";
import { describeRoute } from "hono-openapi";
import db from "../lib/db";
import { clearAccessTokenCookie, generateTokens, setAccessTokenCookie } from "../lib/jwt";
import logger from "../lib/logger";

declare module 'hono' {
    interface OidcAuthClaims {
        name?: string
        given_name?: string
        family_name?: string
        fiscal_number?: string
    }
}

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

const router = new Hono();

// ─── OIDC callback ────────────────────────────────────────────────────────────
// Riceve il `code` dal provider e completa lo scambio token: processOAuthCallback
// imposta la sessione `oidc-auth` e redirige al cookie `continue` (settato da
// oidcAuthMiddleware sulla route /login), dove viene emessa la sessione applicativa.
router.get(
    '/callback',
    describeRoute(({
        description: 'Endpoint that gets the code from the ID provider and exchanges it for tokens'
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
        description: 'Starts the OIDC flow and, once authenticated, issues the application session'
    })),
    async (c) => {
        // Set del hook anche qui: se getAuth rinnova il token (refresh), i claims
        // vengono ricalcolati e la userinfo re-interrogata.
        c.set('oidcClaimsHook', createOidcClaimsHook(c))
        const oidcAuth = await getAuth(c)
        logger.info('OIDC auth claims', oidcAuth ?? {})
        if (!oidcAuth?.email) {
            //TODO: redirect to a page that explains the error and how to fix it (e.g. "Please use an email address that is allowed by our OIDC provider")
            return c.json({ error: 'OIDC auth failed' }, 401)
        }

        let user = await db.findUserByEmail(oidcAuth.email)
        if (!user) {
            user = await db.createUserByEmailAndPassword({
                email: oidcAuth.email,
                password: crypto.randomUUID(),
            })
            await db.setVerified(user.id)
        }

        const { accessToken } = generateTokens(user)
        setAccessTokenCookie(c, accessToken)

        logger.info('User logged in via OIDC', { userId: user.id, email: oidcAuth.email })
        return c.redirect(APP_URL)
    }
);

// ─── OIDC logout ─────────────────────────────────────────────────────────────
router.get(
    '/logout',
    describeRoute(({
        description: 'Endpoint that logs the users out'
    })),
    async (c) => {
        await revokeSession(c)         // revoca sessione OIDC
        clearAccessTokenCookie(c)      // revoca sessione tua
        logger.info('User logged out via OIDC')
        return c.redirect(APP_URL)
    }
);

export default router;