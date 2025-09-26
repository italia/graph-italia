import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// Define the session duration in milliseconds (e.g., 1 hour)
// const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export interface User {
  exp: number;
  iat: number;
  name: string;
  token: string;
  userId: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  checkSession: () => void; // Renamed for clarity, as it actively checks and clears
}

export const useUserStore = create<UserState>()(
  // The persist middleware wraps your store's definition
  devtools(
    persist(
      (set, get) => ({
        user: null,
        setUser: (user) => {
          // const exp = new Date().getTime() + SESSION_DURATION;
          set({ user: { ...user } });
        },
        /**
         * Clears the current user from the state.
         */
        clearUser: () => set({ user: null }),

        /**
         * Checks if the current user's session has expired.
         * If the session is expired, it clears the user from the state.
         */
        checkSession: () => {
          const { user } = get();
          if (user) {
            // console.log('Now', Date.now());
            // console.log('exp', user!.exp * 1000);
            if (Date.now() > user.exp * 1000) {
              // Session has expired, clear the user
              set({ user: null });
              console.log('User session expired. User has been logged out.');
            }
          }
        },
      }),
      {
        // Configuration for the persist middleware
        name: 'user-storage', // Unique name for the localStorage key
        storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      }
    )
  )
);
