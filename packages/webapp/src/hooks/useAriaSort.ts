import { useEffect, type RefObject } from "react";

/**
 * Injects aria-sort on [role="columnheader"] elements inside a container
 * rendered by react-data-table-component, which lacks native aria-sort support.
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
      // Sortable headers get tabIndex 0 from the library; aria-sort on a
      // non-sortable column would wrongly advertise it as sortable.
      if (header.getAttribute("tabindex") !== "0") {
        header.removeAttribute("aria-sort");
        return;
      }
      // Read the name from the inner title element so a custom sort icon
      // rendered next to it never pollutes the comparison.
      const nameEl = header.querySelector<HTMLElement>("div[data-column-id]");
      const colName = (nameEl ?? header).textContent?.trim() ?? "";
      if (sortState && colName === sortState.columnKey) {
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
