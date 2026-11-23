/**
 * Default title of a duplicated chart or dashboard: "<title> copy <timestamp>".
 * The webapp sends its own name with the viewer's local time; this is the
 * fallback for API clients that send none (UTC, "YYYY-MM-DD HH:mm:ss").
 */
export function copyName(title: string | null | undefined, now = new Date()): string {
	const stamp = now.toISOString().slice(0, 19).replace("T", " ");
	return `${title?.trim() || "Untitled"} copy ${stamp}`;
}
