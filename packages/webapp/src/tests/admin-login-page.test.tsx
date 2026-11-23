import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import itResources from "../i18n/locales/it";
import { renderWithI18n } from "./helpers/renderWithI18n";
import AdminLoginPage from "../pages/auth/AdminLoginPage";

vi.mock("../components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const setUser = vi.fn();
vi.mock("../lib/store/user_store", () => ({
  useUserStore: () => ({ setUser }),
}));
vi.mock("../lib/authChannel", () => ({ broadcastAuth: vi.fn() }));

const api = vi.hoisted(() => ({
  adminLogin: vi.fn(),
  getUser: vi.fn(),
}));
// Partial mock: the page imports ROUTES from the router, which loads every
// page and store, and those read other helpers of this module.
vi.mock("../lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/api")>()),
  ...api,
}));

function renderPage() {
  return renderWithI18n(
    <MemoryRouter initialEntries={["/login/admin"]}>
      <Routes>
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/admin" element={<p>pannello admin</p>} />
      </Routes>
    </MemoryRouter>,
    { resources: itResources },
  );
}

function submit(email = "admin@test.it", password = "P@ssw0rd1!") {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Accedi" }));
}

describe("AdminLoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs the admin in and opens the admin panel", async () => {
    api.adminLogin.mockResolvedValue(undefined);
    api.getUser.mockResolvedValue({ userId: "u1", role: "ADMIN" });
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Accesso amministratori");
    submit();
    expect(await screen.findByText("pannello admin")).toBeInTheDocument();
    expect(api.adminLogin).toHaveBeenCalledWith({ email: "admin@test.it", password: "P@ssw0rd1!" });
    expect(setUser).toHaveBeenCalledWith({ userId: "u1", role: "ADMIN" });
  });

  it.each([
    [401, "Credenziali non valide."],
    [404, "L'accesso con password per gli amministratori non è attivo su questa istanza."],
    [429, "Troppi tentativi. Riprova più tardi."],
  ])("shows a message on HTTP %i", async (status, text) => {
    api.adminLogin.mockRejectedValue({ response: { status } });
    renderPage();
    submit();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(text));
    expect(setUser).not.toHaveBeenCalled();
  });
});
