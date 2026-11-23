import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import itResources from "../i18n/locales/it";
import { renderWithI18n } from "./helpers/renderWithI18n";

vi.mock("../components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const CHART = {
  id: "c1",
  name: "Popolazione",
  chart: "bar",
  publish: false,
  updatedAt: "2026-11-23T10:00:00Z",
  createdAt: "2026-11-23T10:00:00Z",
};

const api = vi.hoisted(() => ({
  getCharts: vi.fn(),
  getDashboards: vi.fn(),
  getDatasources: vi.fn(),
  getProjects: vi.fn(),
  duplicateChart: vi.fn(),
  duplicateDashboard: vi.fn(),
}));
vi.mock("../lib/api.ts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/api")>()),
  ...api,
}));

const { default: Home } = await import("../pages/private");

function renderHome() {
  return renderWithI18n(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
    { resources: itResources },
  );
}

async function openDuplicateDialog() {
  renderHome();
  fireEvent.click(await screen.findByRole("button", { name: "Duplica" }));
  const dialog = screen.getByRole("heading", { level: 2, name: "Duplica grafico" }).closest("dialog")!;
  return within(dialog as HTMLElement);
}

describe("Duplica: confirmation dialog with the copy's title", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getCharts.mockResolvedValue([CHART]);
    api.getDashboards.mockResolvedValue([]);
    api.getDatasources.mockResolvedValue([]);
    api.getProjects.mockResolvedValue([]);
  });

  it("does not copy on click: it proposes '<title> copy <timestamp>'", async () => {
    const dialog = await openDuplicateDialog();
    expect(api.duplicateChart).not.toHaveBeenCalled();
    const input = dialog.getByLabelText("Titolo della copia") as HTMLInputElement;
    expect(input.value).toMatch(/^Popolazione copy \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it("duplicates with the title the user typed", async () => {
    api.duplicateChart.mockResolvedValue({ id: "c2", name: "Popolazione 2025" });
    const dialog = await openDuplicateDialog();
    fireEvent.change(dialog.getByLabelText("Titolo della copia"), { target: { value: "  Popolazione 2025 " } });
    fireEvent.click(dialog.getByRole("button", { name: "Duplica" }));
    await waitFor(() => expect(api.duplicateChart).toHaveBeenCalledWith("c1", "Popolazione 2025"));
    await waitFor(() => expect(api.getCharts).toHaveBeenCalledTimes(2)); // list reloaded
  });

  it("an empty title disables the confirmation", async () => {
    const dialog = await openDuplicateDialog();
    fireEvent.change(dialog.getByLabelText("Titolo della copia"), { target: { value: "   " } });
    expect(dialog.getByRole("button", { name: "Duplica" })).toBeDisabled();
  });

  it("Annulla closes without copying", async () => {
    const dialog = await openDuplicateDialog();
    fireEvent.click(dialog.getByRole("button", { name: "Annulla" }));
    expect(api.duplicateChart).not.toHaveBeenCalled();
  });
});
