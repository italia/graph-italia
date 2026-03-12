import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

const initialValues = { preferredTheme: "italia" };

interface Settings {
  preferredTheme: string;
}

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  setTheme: (theme: string) => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        settings: initialValues,
        setSettings: (values) => {
          set({ settings: { ...values } });
        },
        setTheme: (preferredTheme) => {
          if (!preferredTheme) {
            preferredTheme = initialValues.preferredTheme;
          }
          const { settings } = get();
          if (settings) set({ settings: { ...settings, preferredTheme } });
        },
        clearSettings: () => set({ settings: null }),
      }),
      {
        name: "service3-settings",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
