import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { logger } from "./logger";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number) {
	if (now - lastSweep < SWEEP_INTERVAL_MS) return;
	lastSweep = now;
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}

function clientIp(c: Context): string {
	const fwd = c.req.header("x-forwarded-for");
	if (fwd) return fwd.split(",")[0].trim();
	const real = c.req.header("x-real-ip");
	if (real) return real.trim();
	return "unknown";
}

export type RateLimitOptions = {
	windowMs: number;
	max: number;
	name: string;
	keyFn?: (c: Context) => string;
};

export function rateLimit(opts: RateLimitOptions) {
	return createMiddleware(async (c, next) => {
		const now = Date.now();
		sweep(now);
		const baseKey = opts.keyFn ? opts.keyFn(c) : clientIp(c);
		const key = `${opts.name}:${baseKey}`;

		const existing = buckets.get(key);
		if (!existing || existing.resetAt <= now) {
			buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
			await next();
			return;
		}

		if (existing.count >= opts.max) {
			const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
			logger.warn("Rate limit exceeded", {
				name: opts.name,
				key: baseKey,
				path: c.req.path,
				retryAfterSec,
			});
			c.header("Retry-After", `${retryAfterSec}`);
			throw new HTTPException(429, { message: "Too many requests. Try again later." });
		}

		existing.count += 1;
		await next();
	});
}

export type ConsumeResult =
	| { ok: true }
	| { ok: false; retryAfterSec: number };

export function tryConsume(
	name: string,
	key: string,
	opts: { windowMs: number; max: number },
): ConsumeResult {
	const now = Date.now();
	sweep(now);
	const fullKey = `${name}:${key}`;
	const existing = buckets.get(fullKey);

	if (!existing || existing.resetAt <= now) {
		buckets.set(fullKey, { count: 1, resetAt: now + opts.windowMs });
		return { ok: true };
	}
	if (existing.count >= opts.max) {
		const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
		return { ok: false, retryAfterSec };
	}
	existing.count += 1;
	return { ok: true };
}

export function _resetRateLimitBuckets() {
	buckets.clear();
}
