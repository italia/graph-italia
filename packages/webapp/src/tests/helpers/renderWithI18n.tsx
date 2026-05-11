import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Minimal i18n instance for tests. Each test suite can extend resources
// by passing its own translations via the options argument.
export function makeTestI18n(resources: Record<string, any> = {}) {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: "it",
    fallbackLng: "it",
    interpolation: { escapeValue: false },
    resources: {
      it: resources,
    },
  });
  return instance;
}

export function renderWithI18n(
  ui: ReactElement,
  {
    resources = {},
    ...options
  }: { resources?: Record<string, any> } & Omit<RenderOptions, "wrapper"> = {},
) {
  const instance = makeTestI18n(resources);
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <I18nextProvider i18n={instance}>{children}</I18nextProvider>
      ),
      ...options,
    }),
    i18n: instance,
  };
}
