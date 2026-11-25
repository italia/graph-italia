import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const flags = vi.hoisted(() => ({ password: false, recovery: false }));
vi.mock("../lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/api")>()),
  isPasswordAuthEnabled: () => flags.password,
  isPasswordRecoveryEnabled: () => flags.recovery,
}));

const { default: PasswordAuthGate } = await import("../components/auth/PasswordAuthGate");

function renderAt(path: string, recovery?: "page" | "resetLink") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>login</p>} />
        <Route
          path="*"
          element={
            <PasswordAuthGate recovery={recovery}>
              <p>pagina protetta</p>
            </PasswordAuthGate>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PasswordAuthGate", () => {
  beforeEach(() => {
    flags.password = false;
    flags.recovery = false;
  });

  it("lets everything through with email/password auth", () => {
    flags.password = true;
    renderAt("/verify/u1");
    expect(screen.getByText("pagina protetta")).toBeInTheDocument();
  });

  it("SPID/CIE-only with recovery: recovery and change-password pages open", () => {
    flags.recovery = true;
    renderAt("/recover-password", "page");
    expect(screen.getByText("pagina protetta")).toBeInTheDocument();
  });

  it("SPID/CIE-only with recovery: reset links open, activation links do not", () => {
    flags.recovery = true;
    renderAt("/verify/u1?action=reset&code=123456", "resetLink");
    expect(screen.getByText("pagina protetta")).toBeInTheDocument();
  });

  it("SPID/CIE-only with recovery: an activation link still goes to /login", () => {
    flags.recovery = true;
    renderAt("/verify/u1?code=123456", "resetLink");
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("SPID/CIE-only without recovery: recovery pages go to /login", () => {
    renderAt("/recover-password", "page");
    expect(screen.getByText("login")).toBeInTheDocument();
  });
});
