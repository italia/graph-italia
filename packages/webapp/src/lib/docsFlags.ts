// Chapters describe the instance they are served by: a block wrapped in
// `<!-- publishing:on -->…<!-- /publishing -->` (or `:off`) is kept only when
// public publishing is on (off); `password:on|off` does the same for
// email/password accounts. Both flags come from the server's GET /config.
const FLAG_BLOCK = /<!-- (publishing|password):(on|off) -->\n?([\s\S]*?)<!-- \/\1 -->\n?/g;

export function applyInstanceFlags(
  markdown: string,
  flags: { publishing: boolean; password: boolean },
): string {
  return markdown.replace(FLAG_BLOCK, (_, flag: "publishing" | "password", state, body: string) =>
    flags[flag] === (state === "on") ? body : "",
  );
}
