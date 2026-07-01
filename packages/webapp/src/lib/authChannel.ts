// Cross-tab auth signalling.
//
// The user store is persisted per-origin in web storage, so a login/logout in
// one tab must be broadcast to the others (otherwise a tab you logged out of
// elsewhere keeps showing a stale session). Uses BroadcastChannel; degrades to a
// no-op where it isn't available (very old browsers / non-browser contexts).
type AuthMessage = "login" | "logout";

const channel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("graph-italia-auth")
    : null;

export function broadcastAuth(msg: AuthMessage) {
  channel?.postMessage(msg);
}

export function onAuthBroadcast(handler: (msg: AuthMessage) => void): () => void {
  if (!channel) return () => {};
  const listener = (e: MessageEvent) => handler(e.data as AuthMessage);
  channel.addEventListener("message", listener);
  return () => channel.removeEventListener("message", listener);
}
