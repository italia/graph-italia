import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { FieldDataType } from "graph-italia-components";
import itResources from "../i18n/locales/it";
import { renderWithI18n } from "./helpers/renderWithI18n";
import ChartTable from "../components/ChartTable";
import DashboardTable from "../components/DashboardTable";
import { copyName } from "../lib/copyName";

describe("copyName", () => {
  it("appends 'copy' and the local timestamp to the title", () => {
    const now = new Date(2026, 10, 23, 16, 10, 5); // local time
    expect(copyName("Popolazione per regione", now)).toBe(
      "Popolazione per regione copy 2026-11-23 16:10:05",
    );
  });

  it("falls back to a placeholder for an empty title", () => {
    expect(copyName("  ", new Date(2026, 0, 2, 3, 4, 5))).toBe("Untitled copy 2026-01-02 03:04:05");
  });
});

const ROW = {
  id: "c1",
  name: "Popolazione",
  chart: "bar",
  publish: false,
  updatedAt: "2026-11-23T10:00:00Z",
  createdAt: "2026-11-23T10:00:00Z",
} as unknown as FieldDataType;

describe("Duplica in the private home lists", () => {
  it("chart table: one Duplica button per row, passing the row", () => {
    const onDuplicate = vi.fn();
    renderWithI18n(
      <MemoryRouter>
        <ChartTable
          list={[ROW]}
          handleLoadChart={vi.fn()}
          handleDeleteChart={vi.fn()}
          handleDuplicateChart={onDuplicate}
        />
      </MemoryRouter>,
      { resources: itResources },
    );
    const buttons = screen.getAllByRole("button", { name: "Duplica" });
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]!);
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: "c1", name: "Popolazione" }));
  });

  it("dashboard table: one Duplica button per row, passing the row", () => {
    const onDuplicate = vi.fn();
    renderWithI18n(
      <MemoryRouter>
        <DashboardTable
          list={[{ ...ROW, id: "d1", name: "Cruscotto" }] as never}
          handleDeleteDashboard={vi.fn()}
          handleDuplicateDashboard={onDuplicate}
          handleEditDashboard={vi.fn()}
          handleViewDashboard={vi.fn()}
        />
      </MemoryRouter>,
      { resources: itResources },
    );
    fireEvent.click(screen.getByRole("button", { name: "Duplica" }));
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: "d1", name: "Cruscotto" }));
  });
});
