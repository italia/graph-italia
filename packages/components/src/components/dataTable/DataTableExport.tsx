import React from "react";
import type { RowRecord } from "./utils";

type DataTableExportProps = {
  id?: string;
  buttonLabel: string;
  headers: string[];
  rows: RowRecord[];
};

export function DataTableExport({
  id,
  buttonLabel,
  headers,
  rows,
}: DataTableExportProps) {
  const handleExportCsv = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    if (!headers.length) return;

    const dataRowsCsv = rows.map((row) =>
      headers.map((key) => {
        const rawValue = row[key] as unknown;
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

    const csvLines = [headers, ...dataRowsCsv].map((row) =>
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
