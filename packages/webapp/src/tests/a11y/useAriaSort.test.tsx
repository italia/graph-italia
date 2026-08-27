import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useAriaSort } from "../../hooks/useAriaSort";

/**
 * Guards issue 4.1.2 (Nome, ruolo, valore): column sort state must be
 * programmatically detectable via aria-sort on role="columnheader" elements.
 *
 * The bug we're fixing in ChartTable is that the ref was created but never
 * attached, so aria-sort was never applied. These tests pin the hook contract.
 */

function AriaSortHarness({
  sortState,
  columns,
  unsortableColumns = [],
}: {
  sortState: { columnKey: string; direction: "asc" | "desc" } | null;
  columns: string[];
  unsortableColumns?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useAriaSort(ref, sortState);
  return (
    <div ref={ref}>
      {columns.map((c, i) => {
        // Simulate the columnheader structure produced by
        // react-data-table-component: the name lives in an inner
        // div[data-column-id], a custom sort icon may sit next to it, and
        // non-sortable columns get tabIndex -1.
        const sortable = !unsortableColumns.includes(c);
        return (
          <div key={c} role="columnheader" tabIndex={sortable ? 0 : -1}>
            <div data-column-id={i + 1}>{c}</div>
            {sortable && (
              <span className="__rdt_custom_sort_icon__">
                <span aria-hidden="true">▾</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

describe("useAriaSort (4.1.2 column sort state)", () => {
  it("sets aria-sort='none' on every column when no sort is active", () => {
    const { getAllByRole } = render(
      <AriaSortHarness sortState={null} columns={["Type", "Name", "Created"]} />,
    );
    const headers = getAllByRole("columnheader");
    for (const h of headers) {
      expect(h).toHaveAttribute("aria-sort", "none");
    }
  });

  it("sets aria-sort='ascending' only on the active column", () => {
    const { getAllByRole } = render(
      <AriaSortHarness
        sortState={{ columnKey: "Name", direction: "asc" }}
        columns={["Type", "Name", "Created"]}
      />,
    );
    const [type, name, created] = getAllByRole("columnheader");
    expect(type).toHaveAttribute("aria-sort", "none");
    expect(name).toHaveAttribute("aria-sort", "ascending");
    expect(created).toHaveAttribute("aria-sort", "none");
  });

  it("sets aria-sort='descending' when direction is desc", () => {
    const { getByText } = render(
      <AriaSortHarness
        sortState={{ columnKey: "Created", direction: "desc" }}
        columns={["Type", "Name", "Created"]}
      />,
    );
    expect(getByText("Created").closest("[role=columnheader]")).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });

  it("leaves non-sortable columns without aria-sort", () => {
    const { getByText } = render(
      <AriaSortHarness
        sortState={{ columnKey: "Name", direction: "asc" }}
        columns={["Name", "Actions"]}
        unsortableColumns={["Actions"]}
      />,
    );
    expect(getByText("Name").closest("[role=columnheader]")).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    expect(
      getByText("Actions").closest("[role=columnheader]"),
    ).not.toHaveAttribute("aria-sort");
  });

  it("rerender updates aria-sort when sortState changes", () => {
    const { rerender, getByText } = render(
      <AriaSortHarness
        sortState={{ columnKey: "Name", direction: "asc" }}
        columns={["Name", "Created"]}
      />,
    );
    expect(getByText("Name").closest("[role=columnheader]")).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    rerender(
      <AriaSortHarness
        sortState={{ columnKey: "Created", direction: "desc" }}
        columns={["Name", "Created"]}
      />,
    );
    expect(getByText("Name").closest("[role=columnheader]")).toHaveAttribute(
      "aria-sort",
      "none",
    );
    expect(getByText("Created").closest("[role=columnheader]")).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });
});
