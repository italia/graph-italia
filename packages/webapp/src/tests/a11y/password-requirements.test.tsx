import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import PasswordRequirements from "../../components/auth/PasswordRequirements";

/**
 * Guards issue 69 (Assenza di criteri password): the password criteria
 * checklist must be exposed as a status region (WCAG 4.1.3, Status Messages)
 * and must not convey pass/fail state through color alone (WCAG 1.4.1, Use
 * of Color) — each item carries a visually-hidden status string in addition
 * to its icon/color change.
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
              passwordRequirements: {
                items: {
                  minLength: "Almeno 8 caratteri",
                  uppercase: "Una lettera maiuscola",
                  lowercase: "Una lettera minuscola",
                  number: "Un numero",
                  specialChar: "Un carattere speciale",
                },
                status: { met: "soddisfatto", unmet: "non soddisfatto" },
              },
            },
          },
        },
      },
    },
  });
  return instance;
}

function withI18n(node: React.ReactElement) {
  return <I18nextProvider i18n={makeI18n()}>{node}</I18nextProvider>;
}

describe("PasswordRequirements visibility", () => {
  it("renders nothing when not visible", () => {
    render(withI18n(<PasswordRequirements password="" visible={false} />));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders a polite live region with all 5 criteria when visible", () => {
    render(withI18n(<PasswordRequirements password="" visible={true} />));
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    for (const label of [
      "Almeno 8 caratteri",
      "Una lettera maiuscola",
      "Una lettera minuscola",
      "Un numero",
      "Un carattere speciale",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});

describe("PasswordRequirements status (4.1.3, 1.4.1)", () => {
  it("marks every criterion unmet for an empty password", () => {
    render(withI18n(<PasswordRequirements password="" visible={true} />));
    expect(screen.getAllByText("non soddisfatto")).toHaveLength(5);
    expect(screen.queryByText("soddisfatto")).toBeNull();
  });

  it("marks every criterion met once all 5 rules are satisfied", () => {
    render(
      withI18n(<PasswordRequirements password="Abcdefg1!" visible={true} />),
    );
    expect(screen.getAllByText("soddisfatto")).toHaveLength(5);
    expect(screen.queryByText("non soddisfatto")).toBeNull();
  });

  it("flips only the satisfied criteria as the password is partially valid", () => {
    // 8+ chars and a digit, but no uppercase/special char
    render(
      withI18n(<PasswordRequirements password="abcdefg1" visible={true} />),
    );
    expect(screen.getAllByText("soddisfatto")).toHaveLength(3);
    expect(screen.getAllByText("non soddisfatto")).toHaveLength(2);
  });
});

describe("PasswordRequirements accessibility", () => {
  it("axe reports no violations when hidden", async () => {
    const { container } = render(
      <main>{withI18n(<PasswordRequirements password="" visible={false} />)}</main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("axe reports no violations when fully visible and valid", async () => {
    const { container } = render(
      <main>
        {withI18n(
          <PasswordRequirements password="Abcdefg1!" visible={true} />,
        )}
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
