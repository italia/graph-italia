/**
 * Public publishing toggle — single source of truth for the whole platform.
 *
 * When disabled, this instance has no public surface: the anonymous
 * `/charts/show/:id` and `/dashboards/show/:id` endpoints stop answering, and
 * nothing can be flipped to `publish: true` (the publish toggle 403s, and
 * create/update calls are sanitised to `false`). Charts and dashboards remain
 * readable through the authenticated endpoints — session or `dv_` API key —
 * which is how `packages/components` consumes them.
 *
 * Defaults to enabled so self-hosted deployments that never set the variable
 * keep the open source behaviour; set ENABLE_PUBLIC_PUBLISHING="false" to turn
 * the public surface off. The webapp reads this value from GET /config instead
 * of carrying its own flag.
 */
export function isPublicPublishingEnabled(): boolean {
	return process.env.ENABLE_PUBLIC_PUBLISHING !== "false";
}

/**
 * Forces `publish` to false on a create/update payload when public publishing
 * is off. Sanitising rather than rejecting keeps older clients working: they
 * simply cannot make anything public.
 *
 * Takes any object and is a no-op on payloads that carry no `publish` at all,
 * so call sites can pass their DTO straight through without narrowing it.
 */
export function sanitizePublish<T extends object>(payload: T): T {
	if (isPublicPublishingEnabled()) return payload;
	const publish = (payload as { publish?: boolean }).publish;
	return publish ? { ...payload, publish: false } : payload;
}
