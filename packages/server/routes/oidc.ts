import { getAuth, oidcAuthMiddleware, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { setCookie } from "hono/cookie";
import db from "../lib/db";
import { clearAccessTokenCookie, generateTokens, setAccessTokenCookie } from "../lib/jwt";
import logger from "../lib/logger";

const APP_URL = process.env.APP_URL || "/";

const isDev = process.env.NODE_ENV !== "production";

const router = new Hono();

// ─── OIDC callback ────────────────────────────────────────────────────────────
// Step 1 — ricevi il code dal provider e completa lo scambio token
router.get(
    '/callback',
    describeRoute(({
        description: 'Endpoint that get the code from ID provider and exchange it with the token'
    })),
    (c) => processOAuthCallback(c)
);

// Step 2 — ora il cookie oidc-auth è nel browser, getAuth() funziona
router.use('/complete', oidcAuthMiddleware())
router.get(
    '/complete',
    describeRoute(({
        description: 'Endpoint consumed by the browser, using a oicd-auth cookie'
    })),
    async (c) => {
        const oidcAuth = await getAuth(c)
        console.log('→ oidcAuth:', oidcAuth)

        if (!oidcAuth?.email) return c.json({ error: 'OIDC auth failed' }, 401)

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

// ─── OIDC login ───────────────────────────────────────────────────────────────
router.use('/login', (c, next) => {
    setCookie(c, 'continue', 'http://127.0.0.1:3003/api/oidc/complete', {
        path: '/',
        httpOnly: true,
        secure: !isDev,
    })
    return next()
})

router.use('/login', oidcAuthMiddleware())
router.get(
    '/login',
    describeRoute(({
        description: 'Endpoint that redirect the client to application URL'
    })),
    (c) => c.redirect(APP_URL)
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