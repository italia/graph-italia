import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import i18next from "i18next";

export type AppLanguage = "en" | "it";

interface Settings {
  preferredTheme: "dark" | "light";
  preferredLanguage: AppLanguage;
}

const initialValues: Settings = { preferredTheme: "light", preferredLanguage: "it" };

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  setTheme: (theme: "dark" | "light") => void;
  setLanguage: (language: AppLanguage) => void;
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
          const { settings } = get();
          if (settings) set({ settings: { ...settings, preferredTheme } });
        },
        setLanguage: (preferredLanguage) => {
          const { settings } = get();
          if (settings) {
            set({ settings: { ...settings, preferredLanguage } });
            i18next.changeLanguage(preferredLanguage);
          }
        },
        clearSettings: () => set({ settings: null }),
      }),
      {
        name: "dataviz-settings",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state?.settings?.preferredLanguage) {
            i18next.changeLanguage(state.settings.preferredLanguage);
          }
        },
      }
    )
  )
);
