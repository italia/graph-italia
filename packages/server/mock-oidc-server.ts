// mock-oidc-server.ts
// Avvia con: bun run mock-oidc-server.ts
import { Hono } from 'hono'
import { SignJWT, exportJWK, generateKeyPair } from 'jose'

const PORT = 9090
const ISSUER = `http://127.0.0.1:${PORT}`

// Identità simulata, configurabile per provare i diversi casi di collegamento:
//   MOCK_OIDC_SUB=cie-123            sub diverso (es. stessa persona via CIE)
//   MOCK_OIDC_EMAIL=me@example.com   email fornita dall'IdP
//   MOCK_OIDC_NO_EMAIL=true          nessuna email (come CIE): l'app la chiede e la verifica
const MOCK_SUB = process.env.MOCK_OIDC_SUB ?? 'user-1'
const MOCK_EMAIL = process.env.MOCK_OIDC_NO_EMAIL === 'true'
    ? undefined
    : (process.env.MOCK_OIDC_EMAIL ?? 'lp@lp.lp')

const app = new Hono()

// Genera una coppia di chiavi RSA all'avvio
const { privateKey, publicKey } = await generateKeyPair('RS256')
const publicJwk = await exportJWK(publicKey)
publicJwk.kid = 'mock-key-1'
publicJwk.use = 'sig'
publicJwk.alg = 'RS256'

// Codici di autorizzazione emessi (in memoria)
const validCodes = new Map<string, string>()

// ─── Discovery ───────────────────────────────────────────────────────────────
app.get('/.well-known/openid-configuration', (c) => {
    return c.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        userinfo_endpoint: `${ISSUER}/userinfo`,
        jwks_uri: `${ISSUER}/jwks`,
        revocation_endpoint: `${ISSUER}/revoke`,
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
        subject_types_supported: ['public'],
        id_token_signing_alg_values_supported: ['RS256'],
        code_challenge_methods_supported: ['S256'],
        scopes_supported: ['openid', 'profile', 'email'],
    })
})

// ─── JWKS ─────────────────────────────────────────────────────────────────────
app.get('/jwks', (c) => {
    return c.json({ keys: [publicJwk] })
})

// ─── Authorization — auto-login senza UI ─────────────────────────────────────
app.get('/authorize', (c) => {
    const redirectUri = c.req.query('redirect_uri')!
    const state = c.req.query('state')!
    const nonce = c.req.query('nonce')!  // <-- aggiungi questo
    const code = crypto.randomUUID()
    validCodes.set(code, nonce)          // <-- salva il nonce
    return c.redirect(`${redirectUri}?code=${code}&state=${state}`)
})

// ─── Token ────────────────────────────────────────────────────────────────────
app.post('/token', async (c) => {
    const body = await c.req.parseBody()
    const code = body['code'] as string

    if (code && !validCodes.has(code)) {
        return c.json({ error: 'invalid_grant' }, 400)
    }
    const nonce = validCodes.get(code)
    validCodes.delete(code)

    const now = Math.floor(Date.now() / 1000)
    const clientId = process.env.OIDC_CLIENT_ID ?? 'my-client-id'

    const idToken = await new SignJWT({
        sub: MOCK_SUB,
        ...(MOCK_EMAIL ? { email: MOCK_EMAIL } : {}),
        name: 'Mario Rossi',
        nonce,
        iss: ISSUER,
        aud: clientId,
        iat: now,
        exp: now + 3600,
    })
        .setProtectedHeader({ alg: 'RS256', kid: 'mock-key-1' })
        .sign(privateKey)

    return c.json({
        access_token: crypto.randomUUID(),
        token_type: 'Bearer',
        expires_in: 3600,
        id_token: idToken,
        refresh_token: crypto.randomUUID(),
    })
})

// ─── UserInfo ─────────────────────────────────────────────────────────────────
// Attributi SPID/CIE-like restituiti SOLO via userinfo (non nell'ID token), per
// esercitare il fallback userinfo del claims hook come fa IAM Proxy Italia.
app.get('/userinfo', (c) => {
    return c.json({
        sub: MOCK_SUB,
        given_name: 'Mario',
        family_name: 'Rossi',
        fiscal_number: 'RSSMRA80A01H501U',
    })
})

// ─── Revocation ───────────────────────────────────────────────────────────────
app.post('/revoke', (c) => c.json({}))

Bun.serve({ fetch: app.fetch, port: PORT })
console.log(`✅ Mock OIDC server → ${ISSUER}`)
console.log(`   Discovery: ${ISSUER}/.well-known/openid-configuration`)
console.log(`   Identità: sub=${MOCK_SUB} email=${MOCK_EMAIL ?? '(nessuna)'}`)
