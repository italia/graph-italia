import { useEffect, type RefObject } from "react";

/**
 * Injects aria-sort on [role="columnheader"] elements inside a container
 * rendered by react-data-table-component, which lacks native aria-sort support.
 *
 * Follows the APG sortable-table pattern: the accessible activation element is
 * a real <button> rendered as the column name (see SortHeaderButton), so the
 * columnheader itself is demoted to tabindex -1 and only carries aria-sort.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
 */
export function useAriaSort(
  containerRef: RefObject<HTMLElement | null>,
  sortState: { columnKey: string; direction: "asc" | "desc" } | null,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const headers = container.querySelectorAll<HTMLElement>('[role="columnheader"]');
    headers.forEach((header) => {
      const sortButton = header.querySelector<HTMLElement>("button[data-sort-header]");
      // The library makes the whole header focusable (tabIndex 0): with a real
      // button inside, the header must leave the tab order or every column
      // becomes a double tab stop.
      if (sortButton) header.setAttribute("tabindex", "-1");

      // Sortable headers: ours carry the button, the library's get tabIndex 0.
      // aria-sort on a non-sortable column would wrongly advertise it.
      const sortable = !!sortButton || header.getAttribute("tabindex") === "0";
      if (!sortable) {
        header.removeAttribute("aria-sort");
        return;
      }
      // Match by the explicit column id when the table sets it to the label,
      // otherwise by the name element text, so a custom sort icon rendered
      // next to it never pollutes the comparison.
      const columnId = header.getAttribute("data-column-id") ?? "";
      const nameEl = header.querySelector<HTMLElement>(
        "div[data-column-id], button[data-sort-header]",
      );
      const colName = (nameEl ?? header).textContent?.trim() ?? "";
      const isActive =
        sortState != null &&
        (columnId === sortState.columnKey || colName === sortState.columnKey);
      if (isActive) {
        header.setAttribute(
          "aria-sort",
          sortState.direction === "asc" ? "ascending" : "descending",
        );
      } else {
        header.setAttribute("aria-sort", "none");
      }
    });
  }, [containerRef, sortState]);
}
