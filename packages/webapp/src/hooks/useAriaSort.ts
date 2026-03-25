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
      const colName = header.textContent?.trim() ?? "";
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
