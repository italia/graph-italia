import dayjs from "dayjs";

/**
 * Title of a duplicated chart or dashboard: "<title> copy <timestamp>", with
 * the viewer's local time ("YYYY-MM-DD HH:mm:ss"). The server applies the same
 * format (in UTC) when an API client sends no name.
 */
export function copyName(title: string | null | undefined, now: Date = new Date()): string {
  return `${title?.trim() || "Untitled"} copy ${dayjs(now).format("YYYY-MM-DD HH:mm:ss")}`;
}
