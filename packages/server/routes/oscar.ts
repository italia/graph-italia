import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { parsePa } from "../lib/ipa";
import { logger } from "../lib/logger";
import { isOscarEnabled, isValidOscarCallbackToken, PA_VERIFIED } from "../lib/oscar";

const router = new Hono();

const errorMessageSchema = z.object({ error: z.string() });

// Il payload che abbiamo inviato a Oscar (lib/oscar.ts) più l'esito.
const callbackSchema = z.object({
	userId: z.string().min(1),
	firstName: z.string(),
	lastName: z.string(),
	pa: z.object({ code: z.string().min(1), name: z.string() }),
	verified: z.boolean(),
});

const callbackSuccessSchema = z.object({ paVerified: z.number() });

// POST /oscar/pa-verification — esito della verifica di appartenenza alla PA.
// Niente sessione: autenticata dal JWT HS256 firmato da Oscar con OSCAR_KEY.
router.post(
	"/pa-verification",
	describeRoute({
		description:
			"Callback of the Oscar service with the outcome of a PA membership check: the payload we sent plus `verified`. Bearer: HS256 JWT signed with OSCAR_KEY (iss \"oscar\", aud \"graph-italia\"). Only when ENABLE_OSCAR_PA_VERIFICATION is true.",
		responses: {
			200: { description: "Outcome saved", content: { "application/json": { schema: resolver(callbackSuccessSchema) } } },
			400: { description: "Invalid payload" },
			401: { description: "Missing or invalid bearer", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Feature disabled, or unknown user", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			409: { description: "The user's PA has changed since the request", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	async (c, next) => {
		if (!isOscarEnabled()) return c.json({ error: "Not found" }, 404);
		const token = c.req.header("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
		if (!token || !isValidOscarCallbackToken(token)) return c.json({ error: "Unauthorized" }, 401);
		await next();
	},
	zValidator("json", callbackSchema),
	async (c) => {
		const { userId, pa, verified } = c.req.valid("json");
		const user = await db.findUserById(userId);
		if (!user) return c.json({ error: "Unknown user" }, 404);
		if (parsePa(user.pa ?? "").code !== pa.code) {
			logger.warn("Oscar outcome for a PA the user no longer has", { userId, pa: pa.code });
			return c.json({ error: "The user's public administration has changed" }, 409);
		}
		const paVerified = verified ? PA_VERIFIED.VERIFIED : PA_VERIFIED.NOT_MEMBER;
		await db.setPaVerified(userId, paVerified);
		logger.info("Oscar PA verification outcome", { userId, pa: pa.code, verified });
		return c.json({ paVerified }, 200);
	},
);

export default router;
