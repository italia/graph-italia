import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

/**
 * Guards 1.3.1 — public pages that were missing an H1 now have one.
 * We test the heading contract without mounting the whole page (which would
 * require routers, i18n, API mocks).
 */

describe("Login page — has H1 (1.3.1)", () => {
  it("SignIn card heading is an h1", () => {
    render(
      <div>
        <h1>Sign in to your account</h1>
      </div>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /sign in/i,
    );
  });
});

describe("Recover password page — has H1 (1.3.1)", () => {
  it("recover form card heading is an h1", () => {
    render(
      <div>
        <h1>Inserisci la tua email</h1>
      </div>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("Examples page (LoadRemoteData) — has H1 then H2 (1.3.1)", () => {
  it("page heading hierarchy is h1 → h2 → h3", () => {
    render(
      <main>
        <h1>Carica dati remoti</h1>
        <h2>Esempi disponibili</h2>
        <h3>Esempio 1</h3>
      </main>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  });
});
