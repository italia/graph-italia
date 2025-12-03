import type { Table } from "@tanstack/react-table";
import React from "react";
import { ColumnVisibilityPanel } from "./ColumnVisibilityPanel";

type TableRecord = Record<string, unknown>;

type DataTableToolbarProps = {
  table: Table<TableRecord>;
  showFilters: boolean;
  isFilterOpen: boolean;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
  filterButtonLabel: string;
  filterButtonAriaLabel: string;
  panelTitle: string;
  panelCloseAriaLabel: string;
};

export function DataTableToolbar({
  table,
  showFilters,
  isFilterOpen,
  onToggleFilters,
  onCloseFilters,
  filterButtonLabel,
  filterButtonAriaLabel,
  panelTitle,
  panelCloseAriaLabel,
}: DataTableToolbarProps) {
  if (!showFilters) return null;

  return (
    <>
      <div className="mid-table-toolbar">
        <button
          type="button"
          className="mid-table-filter-btn"
          onClick={onToggleFilters}
          aria-expanded={isFilterOpen}
          aria-label={filterButtonAriaLabel}
        >
          {filterButtonLabel}
        </button>
      </div>
      <ColumnVisibilityPanel
        table={table}
        isOpen={isFilterOpen}
        onClose={onCloseFilters}
        title={panelTitle}
        closeAriaLabel={panelCloseAriaLabel}
      />
    </>
  );
}
