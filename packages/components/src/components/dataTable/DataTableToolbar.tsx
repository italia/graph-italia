import React from "react";
import { ColumnVisibilityPanel } from "./ColumnVisibilityPanel";

type DataTableToolbarProps = {
  showFilters: boolean;
  isFilterOpen: boolean;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
  filterButtonLabel: string;
  filterButtonAriaLabel: string;
  panelTitle: string;
  panelCloseAriaLabel: string;
  headers: string[];
  visibleColumns: Set<string>;
  onToggleColumn: (colName: string) => void;
};

export function DataTableToolbar({
  showFilters,
  isFilterOpen,
  onToggleFilters,
  onCloseFilters,
  filterButtonLabel,
  filterButtonAriaLabel,
  panelTitle,
  panelCloseAriaLabel,
  headers,
  visibleColumns,
  onToggleColumn,
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
        isOpen={isFilterOpen}
        onClose={onCloseFilters}
        title={panelTitle}
        closeAriaLabel={panelCloseAriaLabel}
        headers={headers}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />
    </>
  );
}
