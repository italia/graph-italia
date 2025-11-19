import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

export type MatrixType = (string | number)[][];

export type FormatValueContext = {
  columnId: string;
  rowIndex: number;
  colIndex: number;
  isFirstColumn: boolean;
};

export type DataTableProps = {
  data: MatrixType;
  id?: string;
  formatNumber?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  excludeColumnsFromPrefixSuffix?: string[];
  formatValue?: (value: unknown, ctx: FormatValueContext) => React.ReactNode;
};

export const defaultFormatNumber = (n: number) =>
  new Intl.NumberFormat("it-IT").format(n);

export function extractHeaderRow(data: MatrixType): (string | number)[] {
  return Array.isArray(data) && data.length > 0 ? data[0] : [];
}

export function getFirstColumnId(headerRow: (string | number)[]): string | undefined {
  return headerRow && headerRow.length > 0 ? String(headerRow[0]) : undefined;
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
  prefix?: string;
  suffix?: string;
  excludeColumnsFromPrefixSuffix?: string[];
  formatValue?: (value: unknown, ctx: FormatValueContext) => React.ReactNode;
};

export function createTableColumns(
  options: CreateColumnsOptions
): ColumnDef<Record<string, unknown>>[] {
  const {
    headerRow,
    firstColumnId,
    format,
    prefix,
    suffix,
    excludeColumnsFromPrefixSuffix,
    formatValue,
  } = options;

  return headerRow.map((headerCell) => {
    const key = String(headerCell);
    return {
      id: key,
      accessorKey: key,
      header: key,
      cell: (info) => {
        const value = info.getValue() as unknown;
        const colIndex = headerRow.findIndex(
          (h) => String(h) === info.column.id
        );
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
          const isExcluded =
            excludeColumnsFromPrefixSuffix &&
            excludeColumnsFromPrefixSuffix.includes(info.column.id);
          if (isExcluded) {
            return formatted;
          }
          const prefixStr = prefix ?? "";
          const suffixStr = suffix ?? "";
          return `${prefixStr}${formatted}${suffixStr}`;
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
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const showLeftArrow = !isScrolling && canScrollLeft;
  const showRightArrow = !isScrolling && canScrollRight;
  return { wrapperRef, canScrollLeft, canScrollRight, showLeftArrow, showRightArrow, isScrolling, scrollBy };
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


