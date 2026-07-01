import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export interface User {
  exp: number;
  iat: number;
  name: string;
  userId: string;
  role: "USER" | "ADMIN";
}

// 'unknown' until the app has hydrated auth from the session cookie on load.
export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

interface UserState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User) => void;
  clearUser: () => void;
  checkSession: () => void; // clears the user locally once the token has expired
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        status: 'unknown',
        setUser: (user) => set({ user, status: 'authenticated' }),
        clearUser: () => {
          set({ user: null, status: 'anonymous' });
        },
        /**
         * Local expiry check: if the current token is past its `exp`, drop the
         * user. The httpOnly cookie remains the real source of truth (re-checked
         * by AuthProvider and the global 401 interceptor).
         */
        checkSession: () => {
          const { user } = get();
          if (user && Date.now() > user.exp * 1000) {
            set({ user: null, status: 'anonymous' });
          }
        },
      }),
      {
        name: 'user-storage',
        // localStorage (not sessionStorage) so the cached identity is shared
        // across browser tabs — a new tab is no longer treated as logged-out.
        // The httpOnly access_token cookie stays the real credential; the token
        // itself is never stored in JS.
        storage: createJSONStorage(() => localStorage),
        // Persist only the identity, not the transient auth status.
        partialize: (state) => ({ user: state.user }),
        onRehydrateStorage: () => (state) => {
          // A restored cached user counts as authenticated immediately (avoids a
          // loading flash); AuthProvider still re-validates against the cookie.
          if (state?.user) state.status = 'authenticated';
        },
      }
    )
  )
);

/**
 * Route-guard decision derived from the store, resilient to the async cookie
 * hydration on first load:
 *   - 'authed'  → a user is present (persisted or hydrated) → render.
 *   - 'loading' → no user yet and hydration hasn't resolved → show a spinner
 *                 (do NOT redirect, or a valid tab bounces to /login).
 *   - 'anon'    → hydration resolved with no session → redirect to /login.
 */
export function useAuthGate(): 'loading' | 'authed' | 'anon' {
  const user = useUserStore((s) => s.user);
  const status = useUserStore((s) => s.status);
  if (user) return 'authed';
  if (status === 'unknown') return 'loading';
  return 'anon';
}
