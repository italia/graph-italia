import type { Table } from "@tanstack/react-table";
import React from "react";

type TableRecord = Record<string, unknown>;

type DataTableExportProps = {
  table: Table<TableRecord>;
  id?: string;
  buttonLabel: string;
};

export function DataTableExport({
  table,
  id,
  buttonLabel,
}: DataTableExportProps) {
  const handleExportCsv = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const allVisibleColumns = table
      .getVisibleLeafColumns()
      .filter((column) => column.id !== "_dummy");

    if (!allVisibleColumns.length) {
      return;
    }

    const headerRowCsv = allVisibleColumns.map((column) => {
      const headerDef = column.columnDef.header;
      if (typeof headerDef === "string" || typeof headerDef === "number") {
        return String(headerDef);
      }
      return String(column.id);
    });

    const rows = table.getRowModel().rows;

    const dataRowsCsv = rows.map((row) =>
      allVisibleColumns.map((column) => {
        const rawValue = row.getValue(column.id as string) as unknown;
        if (rawValue === null || rawValue === undefined) return "";
        if (typeof rawValue === "number") return String(rawValue);
        if (typeof rawValue === "string") return rawValue;
        if (rawValue instanceof Date) return rawValue.toISOString();
        return String(rawValue);
      })
    );

    const escapeCell = (cell: string) => {
      const needsQuote = /[",\n\r;]/.test(cell);
      const escaped = cell.replace(/"/g, '""');
      return needsQuote ? `"${escaped}"` : escaped;
    };

    const csvLines = [headerRowCsv, ...dataRowsCsv].map((row) =>
      row.map((cell) => escapeCell(String(cell))).join(",")
    );

    const csvContent = csvLines.join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeId = id ?? "table";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.href = url;
    link.setAttribute("download", `${safeId}-${timestamp}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mid-table-footer">
      <button
        type="button"
        className="mid-table-export-btn"
        onClick={handleExportCsv}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
