import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import itResources from "../i18n/locales/it";
import { renderWithI18n } from "./helpers/renderWithI18n";
import QuickStartPage from "../pages/QuickStartPage";

// Page chrome and session are out of scope: we only check which steps the
// guide shows for the instance flags.
vi.mock("../components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("../lib/store/user_store", () => ({
  useUserStore: () => ({ user: null }),
}));

const flags = vi.hoisted(() => ({ publishing: false, password: false }));
vi.mock("../lib/api", () => ({
  isPublishingEnabled: () => flags.publishing,
  isPasswordAuthEnabled: () => flags.password,
}));

function stepTitles(): string[] {
  return screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent ?? "");
}

describe("QuickStartPage steps", () => {
  beforeEach(() => {
    flags.publishing = false;
    flags.password = false;
  });

  for (const publishing of [false, true]) {
    it(`never covers public links, embeds or visibility (publishing ${publishing ? "on" : "off"})`, () => {
      flags.publishing = publishing;
      const { container } = renderWithI18n(<QuickStartPage />, { resources: itResources });
      const text = container.textContent ?? "";
      expect(text).not.toMatch(/iframe|embed|visibilit|link pubblico e il codice/i);
      expect(stepTitles()).toContain("5 · Salva, condividi e integra");
      expect(text).toContain("Organizzazioni");
      expect(text).toContain("graph-italia-components");
      expect(text).not.toContain("condivisa con un link pubblico");
      expect(text).toContain("DashboardGridProvider");
      // "Sorgente dati" is hidden from the "Crea nuovo" dialog.
      expect(text).not.toMatch(/sorgent[ei] dati/i);
    });
  }

  it("says publishing is off only when it is", () => {
    const off = renderWithI18n(<QuickStartPage />, { resources: itResources });
    expect(off.container.textContent).toContain("la pubblicazione è disattivata");
    off.unmount();

    flags.publishing = true;
    const on = renderWithI18n(<QuickStartPage />, { resources: itResources });
    expect(on.container.textContent).not.toContain("la pubblicazione è disattivata");
  });
});
