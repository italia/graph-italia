import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import "./dataTable.css";
import { DataTableExport } from "./DataTableExport";
import { DataTableToolbar } from "./DataTableToolbar";
import PoweredBy from "../PoweredBy";
import { useColorScheme } from "../../context/ColorSchemeContext";
import { registerDataTableDarkTheme } from "./theme";
import {
  convertMatrixToRows,
  defaultFormatNumber,
  extractHeaderRow,
  formatCellValue,
  useAriaSort,
  type DataTableProps,
  type RowRecord,
  type SortState,
} from "./utils";

registerDataTableDarkTheme();

export default function DataTable(props: DataTableProps) {
  const {
    data,
    id,
    formatNumber,
    formatValue,
    showFilters = false,
    enableColumnReorder = false,
    enableExportCsv = false,
    labels,
    poweredByLabel,
  } = props;

  const resolvedLabels = {
    filterColumnsButton: labels?.filterColumnsButton ?? "Filtra colonne",
    filterColumnsAriaLabel:
      labels?.filterColumnsAriaLabel ?? "Mostra o nascondi filtri colonne",
    columnVisibilityTitle:
      labels?.columnVisibilityTitle ?? "Mostra / nascondi colonne",
    columnVisibilityCloseAriaLabel:
      labels?.columnVisibilityCloseAriaLabel ?? "Chiudi filtri colonne",
    exportCsvButton: labels?.exportCsvButton ?? "Esporta CSV",
  };

  const scheme = useColorScheme();
  const currentTheme = scheme === "dark" ? "graph-italia-dark" : "default";

  const tableRef = useRef<HTMLDivElement>(null);
  const [sortState, setSortState] = useState<SortState>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useAriaSort(tableRef, sortState);

  const hasData = Array.isArray(data) && data.length > 0;
  const headerRow = useMemo(() => extractHeaderRow(data), [data]);
  const headers = useMemo(() => headerRow.map((h) => String(h)), [headerRow]);

  const format = useMemo(
    () => formatNumber ?? defaultFormatNumber,
    [formatNumber]
  );

  useEffect(() => {
    setVisibleColumns(new Set(headers));
    setColumnOrder(headers);
    setSortState(null);
  }, [headers]);

  const orderedVisibleHeaders = useMemo(
    () => columnOrder.filter((h) => visibleColumns.has(h)),
    [columnOrder, visibleColumns]
  );

  const rows = useMemo<RowRecord[]>(
    () => convertMatrixToRows(data, headerRow),
    [data, headerRow]
  );

  const columns = useMemo<TableColumn<RowRecord>[]>(() => {
    return orderedVisibleHeaders.map((key, displayIndex) => {
      const originalIndex = headers.indexOf(key);
      return {
        id: key,
        name: key,
        selector: (row) => row[key] as string | number,
        sortable: true,
        reorder: enableColumnReorder,
        wrap: true,
        cell: (row, rowIndex) =>
          formatCellValue(
            row[key],
            {
              columnId: key,
              rowIndex,
              colIndex: originalIndex,
              isFirstColumn: displayIndex === 0,
            },
            format,
            formatValue
          ),
        style: displayIndex === 0 ? { fontWeight: "bold" } : undefined,
      };
    });
  }, [orderedVisibleHeaders, headers, enableColumnReorder, format, formatValue]);

  const handleSort = useCallback(
    (column: TableColumn<RowRecord>, direction: "asc" | "desc") => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) setSortState({ columnKey: key, direction });
    },
    []
  );

  const handleColumnOrderChange = useCallback(
    (newCols: TableColumn<RowRecord>[]) => {
      const newOrder = newCols
        .map((c) => (typeof c.name === "string" ? c.name : ""))
        .filter(Boolean);
      // Merge into the full column order, preserving the positions of any
      // currently hidden columns.
      setColumnOrder((prev) => {
        const hidden = prev.filter((h) => !visibleColumns.has(h));
        return [...newOrder, ...hidden];
      });
    },
    [visibleColumns]
  );

  const toggleColumn = useCallback((colName: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colName)) {
        next.delete(colName);
      } else {
        next.add(colName);
      }
      return next;
    });
  }, []);

  if (!hasData) {
    return null;
  }

  return (
    <div className="mid-table-outer">
      <DataTableToolbar
        showFilters={showFilters}
        isFilterOpen={isFilterOpen}
        onToggleFilters={() => setIsFilterOpen((prev) => !prev)}
        onCloseFilters={() => setIsFilterOpen(false)}
        filterButtonLabel={resolvedLabels.filterColumnsButton}
        filterButtonAriaLabel={resolvedLabels.filterColumnsAriaLabel}
        panelTitle={resolvedLabels.columnVisibilityTitle}
        panelCloseAriaLabel={resolvedLabels.columnVisibilityCloseAriaLabel}
        headers={headers}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />
      <div ref={tableRef} className="mid-table-wrapper">
        <DataTableComponent
          columns={columns}
          data={rows}
          theme={currentTheme}
          dense
          highlightOnHover
          responsive
          onSort={handleSort}
          sortServer={false}
          onColumnOrderChange={enableColumnReorder ? handleColumnOrderChange : undefined}
        />
      </div>
      {enableExportCsv && (
        <DataTableExport
          id={id}
          buttonLabel={resolvedLabels.exportCsvButton}
          headers={orderedVisibleHeaders}
          rows={rows}
        />
      )}
      <PoweredBy label={poweredByLabel} />
    </div>
  );
}
