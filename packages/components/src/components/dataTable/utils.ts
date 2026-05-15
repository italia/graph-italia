import React, { useEffect, type RefObject } from "react";

export type MatrixType = (string | number)[][];

export type FormatValueContext = {
  columnId: string;
  rowIndex: number;
  colIndex: number;
  isFirstColumn: boolean;
};

export type DataTableLabels = {
  filterColumnsButton?: string;
  filterColumnsAriaLabel?: string;
  columnVisibilityTitle?: string;
  columnVisibilityCloseAriaLabel?: string;
  exportCsvButton?: string;
  scrollLeftAriaLabel?: string;
  scrollRightAriaLabel?: string;
  reorderColumnAriaLabel?: string;
};

export type DataTableProps = {
  data: MatrixType;
  id?: string;
  formatNumber?: (n: number) => string;
  formatValue?: (value: unknown, ctx: FormatValueContext) => React.ReactNode;
  showFilters?: boolean;
  enableColumnReorder?: boolean;
  enableExportCsv?: boolean;
  labels?: DataTableLabels;
  poweredByLabel?: string;
};

export type SortState = {
  columnKey: string;
  direction: "asc" | "desc";
} | null;

export type RowRecord = Record<string, unknown>;

export const defaultFormatNumber = (n: number) =>
  new Intl.NumberFormat("it-IT").format(n);

export function extractHeaderRow(data: MatrixType): (string | number)[] {
  return Array.isArray(data) && data.length > 0 ? data[0] : [];
}

export function convertMatrixToRows(
  data: MatrixType,
  headerRow: (string | number)[]
): RowRecord[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  const rows = data.slice(1);
  return rows.map((row) => {
    const obj: RowRecord = {};
    headerRow.forEach((colHeader, idx) => {
      obj[String(colHeader)] = row[idx];
    });
    return obj;
  });
}

export function formatCellValue(
  value: unknown,
  ctx: FormatValueContext,
  format: (n: number) => string,
  formatValue?: (value: unknown, ctx: FormatValueContext) => React.ReactNode
): React.ReactNode {
  if (typeof formatValue === "function") {
    return formatValue(value, ctx);
  }
  if (typeof value === "number") {
    return format(value);
  }
  return value as React.ReactNode;
}

export function computeScrollState(el: HTMLDivElement): {
  canScrollLeft: boolean;
  canScrollRight: boolean;
} {
  const hasOverflow = el.scrollWidth > el.clientWidth;
  const canScrollLeft = hasOverflow && el.scrollLeft > 0;
  const canScrollRight =
    hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  return { canScrollLeft, canScrollRight };
}

export function getScrollAmount(containerWidth: number): number {
  const min = 200;
  const proportion = Math.floor(containerWidth * 0.8);
  return Math.max(min, proportion);
}

export function useHorizontalScrollArrows() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollEndTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () => {
      const state = computeScrollState(el);
      setCanScrollLeft(state.canScrollLeft);
      setCanScrollRight(state.canScrollRight);
    };

    update();
    const onScroll = () => {
      setIsScrolling(true);
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        update();
      }, 200);
      update();
    };
    const onResize = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onResize as any);
      ro.disconnect();
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    const el = wrapperRef.current;
    if (!el) return;
    const amount = getScrollAmount(el.clientWidth);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const showLeftArrow = !isScrolling && canScrollLeft;
  const showRightArrow = !isScrolling && canScrollRight;
  return {
    wrapperRef,
    canScrollLeft,
    canScrollRight,
    showLeftArrow,
    showRightArrow,
    isScrolling,
    scrollBy,
  };
}

export function useFadePresence(targetVisible: boolean, durationMs = 180) {
  const [present, setPresent] = React.useState<boolean>(targetVisible);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    let timeoutId: number | null = null;
    let rafId: number | null = null;
    if (targetVisible) {
      setPresent(true);
      rafId = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
      timeoutId = window.setTimeout(() => {
        setPresent(false);
      }, durationMs);
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [targetVisible, durationMs]);

  return { present, visible };
}

// react-data-table-component renders div-based markup without native aria-sort.
// This hook injects aria-sort on its [role="columnheader"] elements after each
// sort change so screen readers announce the sorted column.
export function useAriaSort(
  containerRef: RefObject<HTMLElement | null>,
  sortState: SortState
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const headers = container.querySelectorAll<HTMLElement>(
      '[role="columnheader"]'
    );
    headers.forEach((header) => {
      const colName = header.textContent?.trim() ?? "";
      if (sortState && colName === sortState.columnKey) {
        header.setAttribute(
          "aria-sort",
          sortState.direction === "asc" ? "ascending" : "descending"
        );
      } else {
        header.setAttribute("aria-sort", "none");
      }
    });
  }, [containerRef, sortState]);
}
