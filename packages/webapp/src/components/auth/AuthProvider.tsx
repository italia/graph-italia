import { useEffect, type ReactNode } from "react";
import * as api from "../../lib/api";
import { useUserStore } from "../../lib/store/user_store";
import { onAuthBroadcast } from "../../lib/authChannel";

// Hydrates auth state from the httpOnly session cookie on app load.
//
// The cookie is the source of truth, so a freshly-opened browser tab is
// recognized as logged-in without forcing a re-login (fixes "every new tab asks
// to log in again"). Also reacts to cross-tab login/logout broadcasts so all
// tabs converge on the same auth state.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const user = await api.getUser();
        if (cancelled) return;
        if (user && user.userId) setUser(user);
        else clearUser();
      } catch {
        // 401 (no/expired cookie) or network error → treat as anonymous.
        if (!cancelled) clearUser();
      }
    };

    hydrate();

    const off = onAuthBroadcast((msg) => {
      if (msg === "logout") clearUser();
      else if (msg === "login") hydrate();
    });

    return () => {
      cancelled = true;
      off();
    };
  }, [setUser, clearUser]);

  return <>{children}</>;
}
