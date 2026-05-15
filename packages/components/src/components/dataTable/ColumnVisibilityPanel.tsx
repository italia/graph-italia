import React from "react";

type ColumnVisibilityPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeAriaLabel: string;
  headers: string[];
  visibleColumns: Set<string>;
  onToggleColumn: (colName: string) => void;
};

export function ColumnVisibilityPanel({
  isOpen,
  onClose,
  title,
  closeAriaLabel,
  headers,
  visibleColumns,
  onToggleColumn,
}: ColumnVisibilityPanelProps) {
  if (!isOpen) return null;
  if (!headers.length) return null;

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
        {headers.map((colName) => {
          const id = `mid-col-filter-${colName}`;
          return (
            <label key={colName} className="mid-table-filter-item" htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                checked={visibleColumns.has(colName)}
                onChange={() => onToggleColumn(colName)}
              />
              <span className="mid-table-filter-label">{colName}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
