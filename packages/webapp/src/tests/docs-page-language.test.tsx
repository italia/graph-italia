import { describe, it, expect, vi } from "vitest";
import { render, screen, within, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "i18next";
import enResources from "../i18n/locales/en";
import itResources from "../i18n/locales/it";
import DocsPage from "../pages/DocsPage";

// The page chrome (header, stores, API) is out of scope: we only check that
// the documentation follows the UI language.
vi.mock("../components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function makeI18n(lng: "it" | "en") {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: "it",
    resources: { en: enResources, it: itResources },
    interpolation: { escapeValue: false },
  });
  return instance;
}

function renderDocs(lng: "it" | "en", path = "/docs/mappe") {
  const instance = makeI18n(lng);
  render(
    <I18nextProvider i18n={instance}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/docs/:section?" element={<DocsPage />} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
  );
  return instance;
}

describe("DocsPage datasets chapter", () => {
  // Hidden like the "Sorgente dati" entry of the "Crea nuovo" dialog.
  it("is not listed and its URL falls back to the docs", () => {
    renderDocs("it", "/docs/sorgenti-dati");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Introduzione");
    const nav = within(screen.getByRole("navigation", { name: "Documentazione" }));
    expect(nav.queryByRole("link", { name: "Dataset" })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/docs/sorgenti-dati"]')).toBeNull();
  });
});

describe("DocsPage sharing chapter", () => {
  // loadInstanceConfig() is never called here, so publishing reads as off.
  it("covers team sharing and says publishing is off on this instance", () => {
    renderDocs("it", "/docs/condivisione");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Condividere e integrare");
    const nav = within(screen.getByRole("navigation", { name: "Documentazione" }));
    expect(nav.getByRole("link", { name: "Condividere e integrare", current: "page" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Condividere con il tuo team" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "La pubblicazione su questa istanza" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ENABLE_PUBLIC_PUBLISHING")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Visibilità/ })).not.toBeInTheDocument();
  });
});

describe("DocsPage follows the UI language", () => {
  it("renders the Italian chapter and sidebar by default", () => {
    renderDocs("it");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Mappe");
    const nav = within(screen.getByRole("navigation", { name: "Documentazione" }));
    expect(nav.getByRole("link", { name: "Caricare i dati" })).toHaveAttribute(
      "href",
      "/docs/caricare-dati",
    );
    expect(nav.getByText("Primi passi")).toBeInTheDocument();
  });

  it("renders the English chapter and sidebar when the language is English", () => {
    renderDocs("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Maps");
    const nav = within(screen.getByRole("navigation", { name: "Documentation" }));
    expect(nav.getByRole("link", { name: "Loading data" })).toHaveAttribute(
      "href",
      "/docs/caricare-dati",
    );
    expect(nav.getByText("Getting started", { selector: "span" })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: "Maps", current: "page" })).toBeInTheDocument();
  });

  it("switches content when the language changes at runtime", async () => {
    const instance = renderDocs("en", "/docs/api");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("REST API");
    await act(async () => {
      await instance.changeLanguage("it");
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("API REST");
    expect(
      within(screen.getByRole("navigation", { name: "Documentazione" })).getByText(
        "Per chi sviluppa",
      ),
    ).toBeInTheDocument();
  });
});
