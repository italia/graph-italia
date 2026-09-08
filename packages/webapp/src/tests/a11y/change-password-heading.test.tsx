import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";

/**
 * Guards issue 126 follow-up: the change-password form renders its title as
 * h1 on the recover-password page, where it is the only heading, and as h2
 * under the "Modifica password" page title in the account settings, so the
 * page never exposes two h1 (WCAG 1.3.1, heading outline).
 */

function makeI18n() {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: "it",
    fallbackLng: "it",
    interpolation: { escapeValue: false },
    resources: {
      it: {
        components: {
          components: {
            auth: {
              changePasswordForm: { header: { label: "Scegli una nuova password" } },
              passwordToggle: { show: "Mostra password", hide: "Nascondi password" },
              passwordRequirements: { items: {}, status: { met: "", unmet: "" } },
            },
          },
        },
      },
    },
  });
  return instance;
}

describe("ChangePasswordForm heading level", () => {
  it("is an h1 by default (recover-password page)", () => {
    render(
      <I18nextProvider i18n={makeI18n()}>
        <ChangePasswordForm onDone={() => {}} />
      </I18nextProvider>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /scegli una nuova password/i }),
    ).toBeInTheDocument();
  });

  it("is an h2 when the page already has its own h1 (account settings)", () => {
    render(
      <I18nextProvider i18n={makeI18n()}>
        <ChangePasswordForm headingLevel="h2" onDone={() => {}} />
      </I18nextProvider>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: /scegli una nuova password/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });
});
