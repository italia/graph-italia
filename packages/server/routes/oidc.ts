import { getAuth, oidcAuthMiddleware, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import db from "../lib/db";
import { generateTokens } from "../lib/jwt";
import { clearAccessTokenCookie, setAccessTokenCookie } from "../lib/jwt-hono";
import logger from "../lib/logger";

const APP_URL = process.env.APP_URL || "/";

const isDev = process.env.NODE_ENV !== "production";

const router = new Hono();

// ─── OIDC callback ────────────────────────────────────────────────────────────
router.get('/callback', async (c) => {
    console.log('→ callback hit')
    console.log('→ query params:', c.req.query())
    console.log('→ cookies:', c.req.header('cookie'))
    try {
        await processOAuthCallback(c)
        console.log('→ processOAuthCallback completato')
    } catch (e) {
        console.error('→ errore in processOAuthCallback:', e)
        throw e
    }
    // Dopo il callback, getAuth() ha i dati dell'utente OIDC
    const oidcAuth = await getAuth(c)
    console.log('→ oidcAuth:', oidcAuth)
    if (!oidcAuth?.email) return c.json({ error: 'OIDC auth failed' }, 401)

    // Trova o crea l'utente nel tuo DB
    let user = await db.findUserByEmail(oidcAuth.email)
    if (!user) {
        user = await db.createUserByEmailAndPassword({
            email: oidcAuth.email,
            password: crypto.randomUUID(), // password casuale, non usata
        })
        await db.setVerifyed(user.id) // già verificato via OIDC
    }

    // Crea la sessione con il tuo sistema JWT esistente
    const { accessToken } = generateTokens(user)
    setAccessTokenCookie(c, accessToken)

    logger.info('User logged in via OIDC', { userId: user.id, email: oidcAuth.email })

    return c.redirect(APP_URL)
})

// ─── OIDC login ───────────────────────────────────────────────────────────────
router.use('/login', (c, next) => {
    setCookie(c, 'continue', APP_URL, {
        path: '/',
        httpOnly: true,
        secure: !isDev,
    })
    return next()
})

router.use('/login', oidcAuthMiddleware())
router.get('/login', (c) => c.redirect(APP_URL))

// ─── OIDC logout ─────────────────────────────────────────────────────────────
router.get('/logout', async (c) => {
    await revokeSession(c)         // revoca sessione OIDC
    clearAccessTokenCookie(c)      // revoca sessione tua
    logger.info('User logged out via OIDC')
    return c.redirect(APP_URL)
})

export default router;