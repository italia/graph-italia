import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "i18next";
import { axe } from "vitest-axe";
import enResources from "../i18n/locales/en";
import itResources from "../i18n/locales/it";
import DataProcessorPage from "../pages/legal/DataProcessorPage";
import LegalNotesPage from "../pages/legal/LegalNotesPage";
import PrivacyPage from "../pages/legal/PrivacyPage";
import SignIn from "../components/auth/SignIn";
import { TERMS_VERSION } from "../lib/termsAcceptance";
import { ROUTES } from "../router";

// The page chrome (header, stores, API) is out of scope.
vi.mock("../components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

vi.mock("../lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/api")>()),
  isPasswordAuthEnabled: () => false,
  redirectToLoginOidc: () => "http://server.test/api/oidc/login",
}));

function makeI18n(lng: "it" | "en" = "it") {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: "it",
    resources: { it: itResources, en: enResources },
    interpolation: { escapeValue: false },
  });
  return instance;
}

function renderWithProviders(ui: React.ReactElement, lng: "it" | "en" = "it") {
  return render(
    <I18nextProvider i18n={makeI18n(lng)}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

const pages = [
  { name: "Informativa privacy", Page: PrivacyPage, linksTo: [ROUTES.legalNotes] },
  {
    name: "Note legali",
    Page: LegalNotesPage,
    linksTo: [ROUTES.privacy, ROUTES.dataProcessor],
  },
  { name: "Nomina responsabile", Page: DataProcessorPage, linksTo: [ROUTES.legalNotes] },
];

describe.each(pages)("$name page", ({ Page, linksTo }) => {
  it("has a single h1 and never skips a heading level (1.3.1)", () => {
    const { container } = renderWithProviders(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const levels = [...container.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
      (h) => Number(h.tagName[1]),
    );
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1]).toBeLessThanOrEqual(1);
    });
  });

  it("has no leftover placeholders from the source documents", () => {
    const { container } = renderWithProviders(<Page />);
    expect(container.textContent).not.toMatch(/\[(da definire|inserire link|\.)\]/i);
  });

  it("links to the related legal documents", () => {
    const { container } = renderWithProviders(<Page />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    linksTo.forEach((route) => expect(hrefs).toContain(route));
  });

  it("opens external links in a new window, announced to screen readers", () => {
    const { container } = renderWithProviders(<Page />);
    container.querySelectorAll('a[href^="http"]').forEach((a) => {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.textContent).toMatch(/nuova finestra/);
    });
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<Page />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe.each(pages)("$name page in English", ({ Page, linksTo }) => {
  it("shows the translation, marked as English and as non-binding", () => {
    const { container } = renderWithProviders(<Page />, "en");
    expect(container.querySelector("article")).toHaveAttribute("lang", "en");
    expect(container.textContent).toMatch(/Italian version is the only legally binding text/);
    expect(container.textContent).not.toMatch(/Ultimo aggiornamento/);
  });

  it("keeps a single h1, the related links and announced new windows", async () => {
    const { container } = renderWithProviders(<Page />, "en");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    linksTo.forEach((route) => expect(hrefs).toContain(route));
    container.querySelectorAll('a[href^="http"]').forEach((a) => {
      expect(a.textContent).toMatch(/opens in a new window/);
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SPID/CIE-only sign in — terms acceptance", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost/login" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("blocks the login until the terms are accepted", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignIn setLogin={() => {}} />);

    const checkbox = screen.getByRole("checkbox", { name: /termini e le condizioni/i });
    await user.click(screen.getByRole("button", { name: /spid/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/devi accettare/i);
    expect(checkbox).toHaveFocus();
    expect(window.location.href).toBe("http://localhost/login");

    await user.click(checkbox);
    await user.click(screen.getByRole("button", { name: /spid/i }));

    expect(window.location.href).toBe("http://server.test/api/oidc/login");
    expect(localStorage.getItem("termsAcceptedVersion")).toBe(TERMS_VERSION);
  });

  it("links both documents in a new window", () => {
    renderWithProviders(<SignIn setLogin={() => {}} />);
    const terms = screen.getByRole("link", { name: /termini e le condizioni/i });
    const privacy = screen.getByRole("link", { name: /privacy policy/i });
    expect(terms).toHaveAttribute("href", ROUTES.legalNotes);
    expect(privacy).toHaveAttribute("href", ROUTES.privacy);
    expect(terms).toHaveAttribute("target", "_blank");
    expect(privacy).toHaveAttribute("target", "_blank");
  });

  it("shows a note instead of the checkbox once this version was accepted", async () => {
    localStorage.setItem("termsAcceptedVersion", TERMS_VERSION);
    const user = userEvent.setup();
    renderWithProviders(<SignIn setLogin={() => {}} />);

    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByText(/accedendo confermi/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /spid/i }));
    expect(window.location.href).toBe("http://server.test/api/oidc/login");
  });

  it("asks again when the accepted version is outdated", () => {
    localStorage.setItem("termsAcceptedVersion", "2020-01-01");
    renderWithProviders(<SignIn setLogin={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
