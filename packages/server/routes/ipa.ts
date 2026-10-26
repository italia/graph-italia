import { Hono } from "hono";
import { compress } from "hono/compress";
import { describeRoute } from "hono-openapi";
import { ipaEntiFile } from "../lib/ipa";

const router = new Hono();

// Pubblico: serve al form di registrazione, prima di qualsiasi login.
router.get(
	"/enti",
	describeRoute({
		description:
			"Enti di IndicePA per il campo «PA di appartenenza», dal file data/ipa-enti.json: { updatedAt, types, enti: [codiceIPA, denominazione, indice in types][] }.",
		responses: {
			200: { description: "Elenco degli enti" },
			304: { description: "Elenco invariato (If-None-Match)" },
			503: { description: "File degli enti non disponibile" },
		},
	}),
	compress(),
	async (c) => {
		const file = Bun.file(ipaEntiFile());
		if (!(await file.exists())) {
			return c.json({ error: { message: "The list of public administrations is not available." } }, 503);
		}
		const etag = `"ipa-${file.size}-${file.lastModified}"`;
		c.header("ETag", etag);
		c.header("Cache-Control", "public, max-age=3600");
		// compress() turns the ETag weak (W/"…") on gzipped responses: compare without it.
		if (c.req.header("If-None-Match")?.replace(/^W\//, "") === etag) return c.body(null, 304);
		c.header("Content-Type", "application/json; charset=utf-8");
		return c.body(file.stream());
	},
);

export default router;
