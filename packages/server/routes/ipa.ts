import { Hono } from "hono";
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
	async (c) => {
		const file = Bun.file(ipaEntiFile());
		if (!(await file.exists())) {
			return c.json({ error: { message: "The list of public administrations is not available." } }, 503);
		}
		const etag = `"ipa-${file.size}-${file.lastModified}"`;
		c.header("ETag", etag);
		c.header("Cache-Control", "public, max-age=3600");
		c.header("Vary", "Accept-Encoding");
		// A proxy that compresses the response may turn the ETag weak (W/"…"): compare without it.
		if (c.req.header("If-None-Match")?.replace(/^W\//, "") === etag) return c.body(null, 304);
		c.header("Content-Type", "application/json; charset=utf-8");
		// Gzip by hand rather than with hono/compress: that middleware needs
		// CompressionStream, which the Bun of the production image (1.3.1) lacks,
		// so every browser request (always Accept-Encoding: gzip) answered 500.
		if (/\bgzip\b/.test(c.req.header("Accept-Encoding") ?? "")) {
			c.header("Content-Encoding", "gzip");
			return c.body(Bun.gzipSync(new Uint8Array(await file.arrayBuffer())));
		}
		return c.body(file.stream());
	},
);

export default router;
