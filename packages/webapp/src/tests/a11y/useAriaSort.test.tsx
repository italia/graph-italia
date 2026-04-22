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
}: {
  sortState: { columnKey: string; direction: "asc" | "desc" } | null;
  columns: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useAriaSort(ref, sortState);
  return (
    <div ref={ref}>
      {columns.map((c) => (
        // Simulate the columnheader structure produced by
        // react-data-table-component.
        <div key={c} role="columnheader">
          {c}
        </div>
      ))}
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
