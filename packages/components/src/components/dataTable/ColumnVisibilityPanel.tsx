import type { Table } from "@tanstack/react-table";
import React from "react";

type TableRecord = Record<string, unknown>;

type ColumnVisibilityPanelProps = {
  table: Table<TableRecord>;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeAriaLabel: string;
};

export function ColumnVisibilityPanel({
  table,
  isOpen,
  onClose,
  title,
  closeAriaLabel,
}: ColumnVisibilityPanelProps) {
  if (!isOpen) return null;

  const columns = table
    .getAllLeafColumns()
    // Solo colonne che possono essere nascoste
    .filter(
      (column) => (column.getCanHide?.() ?? true) && column.id !== "_dummy"
    );

  if (!columns.length) return null;

  return (
    <div className="mid-table-filter-panel">
      <div className="mid-table-filter-header">
        <span className="mid-table-filter-title">{title}</span>
        <button
          type="button"
          className="mid-table-filter-close"
          onClick={onClose}
          aria-label={closeAriaLabel}
        >
          ×
        </button>
      </div>
      <div className="mid-table-filter-body">
        {columns.map((column) => {
          const headerLabel =
            typeof column.columnDef.header === "string" ||
            typeof column.columnDef.header === "number"
              ? String(column.columnDef.header)
              : column.id;

          return (
            <label
              key={column.id}
              className="mid-table-filter-item"
              htmlFor={`mid-col-filter-${column.id}`}
            >
              <input
                id={`mid-col-filter-${column.id}`}
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={(e) => column.toggleVisibility(e.target.checked)}
              />
              <span className="mid-table-filter-label">{headerLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
