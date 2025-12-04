import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

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
};

export const defaultFormatNumber = (n: number) =>
  new Intl.NumberFormat("it-IT").format(n);

function getColumnId(index: number): string {
  return `col_${index}`;
}

export function extractHeaderRow(data: MatrixType): (string | number)[] {
  return Array.isArray(data) && data.length > 0 ? data[0] : [];
}

export function getFirstColumnId(
  headerRow: (string | number)[]
): string | undefined {
  return headerRow && headerRow.length > 0 ? getColumnId(0) : undefined;
}

export function convertMatrixToTableData(
  data: MatrixType,
  headerRow: (string | number)[]
): Record<string, unknown>[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  const rows = data.slice(1);
  return rows.map((row) => {
    const obj: Record<string, unknown> = {};
    headerRow.forEach((colHeader, idx) => {
      obj[String(colHeader)] = row[idx];
    });
    return obj;
  });
}

type CreateColumnsOptions = {
  headerRow: (string | number)[];
  firstColumnId: string | undefined;
  format: (n: number) => string;
  formatValue?: (value: unknown, ctx: FormatValueContext) => React.ReactNode;
};

export function createTableColumns(
  options: CreateColumnsOptions
): ColumnDef<Record<string, unknown>>[] {
  const { headerRow, firstColumnId, format, formatValue } = options;

  return headerRow.map((headerCell, index) => {
    const headerLabel = String(headerCell);
    const columnId = getColumnId(index);

    return {
      id: columnId,
      accessorFn: (row) => row[headerLabel],
      header: headerLabel,
      cell: (info) => {
        const value = info.getValue() as unknown;
        const colIndex = index;
        const isFirstCol = firstColumnId
          ? info.column.id === firstColumnId
          : colIndex === 0;

        if (typeof formatValue === "function") {
          return formatValue(value, {
            columnId: info.column.id,
            rowIndex: info.row.index,
            colIndex,
            isFirstColumn: isFirstCol,
          });
        }

        if (typeof value === "number") {
          const formatted = format(value as number);
          return formatted;
        }

        return value as React.ReactNode;
      },
    } as ColumnDef<Record<string, unknown>>;
  });
}

export function getSortIndicator(sorted: "asc" | "desc" | false): string {
  if (sorted === "asc") return "▲";
  if (sorted === "desc") return "▼";
  return "";
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
