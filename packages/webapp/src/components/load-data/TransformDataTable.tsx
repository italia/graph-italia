import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { transposeData } from "../../lib/utils.ts";
import { useSettingsStore } from "../../lib/store/settings_store.ts";
import type { MatrixType } from "../../types.ts";
import registerDarkTheme from "../layout/DataTableDarkTheme.ts";
import { paginationIcons } from "../layout/paginationIcons";
import GenericDialog from "../layout/GenericDialog.tsx";
import RenameTableHeadersForm from "./RenameTableHeadersForm.tsx";
import ToggleTableColumns from "./ToggleTableColumns.tsx";
import SortTableColumns from "./SortTableColumns.tsx";

registerDarkTheme();

type TransformDataProps = {
  currentData: MatrixType;
  handleTransformData: (transformedData: MatrixType) => void;
  onReset?: () => void;
  downloadCSV?: () => void;
  downloadJSON?: () => void;
};

type SortState = {
  columnKey: string;
  direction: "asc" | "desc";
} | null;

type RowRecord = Record<string, string | number>;

export default function TransformData({
  currentData,
  handleTransformData,
  onReset,
  downloadCSV,
  downloadJSON,
}: TransformDataProps) {

  const { t } = useTranslation("components", {
    keyPrefix: "components.loadData.transformData",
  });
  const { settings } = useSettingsStore();
  const currentTheme = settings?.preferredTheme === "dark" ? "dark" : "default";

  // State: working copy of the data matrix (supports transpose)
  const [workingData, setWorkingData] = useState<MatrixType>(() => currentData);

  // Derive headers and row data from the working matrix
  const allHeaders = useMemo(
    () => (workingData[0] ?? []).map(String),
    [workingData],
  );

  // State: which columns are visible
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(allHeaders),
  );

  // State: column ordering (initially matches the original header order)
  const [columnOrder, setColumnOrder] = useState<string[]>(() => [
    ...allHeaders,
  ]);

  const [showRenameForm, setShowRenameForm] = useState(false);
  const [showFilterColumns, setShowFilterColumns] = useState(false);
  const [showSortColumns, setShowSortColumns] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);


  // State: current sort
  const [sortState, setSortState] = useState<SortState>(null);

  // Snapshot of the last applied (or initial) state — used to compute hasChanges
  const [appliedSnapshot, setAppliedSnapshot] = useState(() => ({
    workingData: currentData,
    visibleKeys: (currentData[0] ?? []).map(String).join(","),
    columnOrder: (currentData[0] ?? []).map(String).join(","),
    sortState: null as SortState,
  }));

  function openRenameForm() {
    if (!workingData?.[0]) return;
    setShowRenameForm(true);
  }

  function applyRenames(values: string[]) {
    const newData = workingData.map((row: (string | number)[], rowIndex: number) => {
      if (rowIndex === 0) return values;
      return row;
    });

    // Update visibility set with new names
    setVisibleColumns((prev) => {
      const next = new Set<string>();
      values.forEach((newName: string, i: number) => {
        const oldName = allHeaders[i];
        if (prev.has(oldName)) {
          next.add(newName);
        }
      });
      return next;
    });

    // Update column order to reflect renamed headers
    setColumnOrder((prev) =>
      prev.map((name) => {
        const idx = allHeaders.indexOf(name);
        return idx >= 0 ? values[idx] : name;
      }),
    );

    setWorkingData(newData);
    setShowRenameForm(false);
  }

  // Transpose the data matrix
  const transpose = useCallback(() => {
    const transposed = transposeData(workingData);
    setWorkingData(transposed);
    const newHeaders = (transposed[0] ?? []).map(String);
    setVisibleColumns(new Set(newHeaders));
    setColumnOrder([...newHeaders]);
    setSortState(null);
  }, [workingData]);

  // Reset to the original data
  const resetData = useCallback(() => {
    setWorkingData(currentData);
    const originalHeaders = (currentData[0] ?? []).map(String);
    setVisibleColumns(new Set(originalHeaders));
    setColumnOrder([...originalHeaders]);
    setSortState(null);
  }, [currentData]);

  // Convert matrix rows to object array for the DataTable
  const objectData: RowRecord[] = useMemo(() => {
    const rows = workingData.slice(1);
    return rows.map((row) => {
      const obj: RowRecord = {};
      allHeaders.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  }, [workingData, allHeaders]);

  // Build DataTable columns from columnOrder + visibleColumns
  const columns: TableColumn<RowRecord>[] = useMemo(() => {
    return columnOrder
      .filter((key) => visibleColumns.has(key))
      .map((key) => ({
        id: key,
        name: key,
        selector: (row: RowRecord) => row[key] as string,
        sortable: true,
        reorder: true,
      }));
  }, [columnOrder, visibleColumns]);

  // a11y: react-data-table-component does not expose aria-sort on column
  // headers, so we sync it manually after each render. Sort icons rendered by
  // the library are also aria-hidden to avoid duplicate announcements.
  const tableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = tableRef.current;
    if (!root) return;
    const headers = root.querySelectorAll<HTMLElement>(
      '[role="columnheader"][data-column-id]',
    );
    headers.forEach((el) => {
      const id = el.getAttribute("data-column-id");
      const value =
        sortState && sortState.columnKey === id
          ? sortState.direction === "asc"
            ? "ascending"
            : "descending"
          : "none";
      el.setAttribute("aria-sort", value);
    });
  }, [sortState, columns]);

  // Handle column reorder from DataTable drag-and-drop
  const handleColumnOrderChange = useCallback(
    (newCols: TableColumn<RowRecord>[]) => {
      const newOrder = newCols
        .map((c) => (typeof c.name === "string" ? c.name : ""))
        .filter(Boolean);
      // Merge: keep hidden columns in their relative position, update visible order
      setColumnOrder((prev) => {
        const hiddenInOrder = prev.filter((k) => !visibleColumns.has(k));
        // Interleave: visible columns in new order, hidden columns appended at end
        return [...newOrder, ...hiddenInOrder];
      });
    },
    [visibleColumns],
  );

  // Handle sort change from DataTable
  const handleSort = useCallback(
    (column: TableColumn<RowRecord>, direction: "asc" | "desc") => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) {
        setSortState({ columnKey: key, direction });
      }
    },
    [],
  );

  // Toggle a column's visibility
  const toggleColumn = useCallback((colName: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colName)) {
        // Don't allow hiding ALL columns
        if (next.size <= 1) return prev;
        next.delete(colName);
      } else {
        next.add(colName);
      }
      return next;
    });
  }, []);

  // Build the output MatrixType reflecting all transformations
  const applyChanges = useCallback(() => {
    // 1. Determine final column order (only visible columns, in current order)
    const finalColumns = columnOrder.filter((key) => visibleColumns.has(key));

    // 2. Build rows from objectData
    let rows = objectData.map((row) => finalColumns.map((key) => row[key]));

    // 3. Sort if a sort is active
    if (sortState) {
      const colIndex = finalColumns.indexOf(sortState.columnKey);
      if (colIndex >= 0) {
        rows = [...rows].sort((a, b) => {
          const valA = a[colIndex];
          const valB = b[colIndex];
          // Numeric comparison if both are numbers
          if (typeof valA === "number" && typeof valB === "number") {
            return sortState.direction === "asc" ? valA - valB : valB - valA;
          }
          // String comparison
          const strA = String(valA);
          const strB = String(valB);
          const cmp = strA.localeCompare(strB);
          return sortState.direction === "asc" ? cmp : -cmp;
        });
      }
    }

    // 4. Reconstruct MatrixType: header row + data rows
    const newMatrix: MatrixType = [finalColumns, ...rows];
    handleTransformData(newMatrix);

    // Update snapshot so hasChanges resets to false
    setAppliedSnapshot({
      workingData,
      visibleKeys: [...visibleColumns].sort().join(","),
      columnOrder: [...columnOrder].join(","),
      sortState,
    });
  }, [columnOrder, visibleColumns, objectData, sortState, handleTransformData, workingData]);

  // Check if current state differs from the last applied snapshot
  const hasChanges = useMemo(() => {
    if (workingData !== appliedSnapshot.workingData) return true;
    if ([...visibleColumns].sort().join(",") !== appliedSnapshot.visibleKeys) return true;
    if (columnOrder.join(",") !== appliedSnapshot.columnOrder) return true;
    if (sortState?.columnKey !== appliedSnapshot.sortState?.columnKey) return true;
    if (sortState?.direction !== appliedSnapshot.sortState?.direction) return true;
    return false;
  }, [workingData, visibleColumns, columnOrder, sortState, appliedSnapshot]);

  return (
    <div className="mt-10">
      {/* Transpose & Reset controls */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-base-content/70">
          {t(`header.label`)}
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-outline"
            aria-expanded={showFilterColumns}
            aria-controls="data-table-filter-columns"
            onClick={() => setShowFilterColumns((v) => !v)}
          >
            {showFilterColumns
              ? t(`actions.filterColumns.hide`)
              : t(`actions.filterColumns.show`)}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            aria-expanded={showSortColumns}
            aria-controls="data-table-sort-columns"
            onClick={() => setShowSortColumns((v) => !v)}
          >
            {showSortColumns
              ? t(`actions.reorderColumns.hide`)
              : t(`actions.reorderColumns.show`)}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            aria-expanded={showRenameForm}
            aria-controls="data-table-rename-headers"
            onClick={() =>
              showRenameForm ? setShowRenameForm(false) : openRenameForm()
            }
          >
            {showRenameForm
              ? t(`actions.renameHeaders.hide`)
              : t(`actions.renameHeaders.show`)}
          </button>
          <button
            type="button" className="btn btn-outline"
            onClick={transpose}
          >
            {t(`actions.transpose.label`)}
          </button>
          <button
            type="button" className="btn btn-outline"
            onClick={() => setShowResetDialog(true)}
          >
            {t(`actions.reset.label`)}
          </button>

          {downloadCSV && (
            <button type="button" className="btn btn-outline" onClick={() => downloadCSV()}>
              {t(`actions.downloadCsv.label`)}
            </button>
          )}
          {downloadJSON && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => downloadJSON()}
            >
              {t(`actions.downloadJson.label`)}
            </button>
          )}
        </div>
      </div>

      {showRenameForm && (
        <div id="data-table-rename-headers" role="region" aria-label={t(`actions.renameHeaders.label`, { defaultValue: "Rinomina intestazioni" })}>
          <RenameTableHeadersForm
            initialValues={workingData[0].map(String)}
            onApply={applyRenames}
            onCancel={() => setShowRenameForm(false)}
          />
        </div>
      )}
      {showFilterColumns && (
        <div id="data-table-filter-columns" role="region" aria-label={t(`actions.filterColumns.label`, { defaultValue: "Filtra colonne" })}>
          <ToggleTableColumns
            columnOrder={columnOrder}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
          />
        </div>
      )}
      {showSortColumns && (
        <div id="data-table-sort-columns" role="region" aria-label={t(`actions.reorderColumns.label`, { defaultValue: "Riordina colonne" })}>
          <SortTableColumns
            columnOrder={columnOrder}
            onReorder={setColumnOrder}
          />
        </div>
      )}

      <div ref={tableRef}>
        <DataTable
          title={t(`table.title`)}
          columns={columns}
          data={objectData}
          theme={currentTheme}
          pagination
          paginationComponentOptions={{
            rowsPerPageText: t("pagination.rowsPerPage", { defaultValue: "Righe per pagina:" }),
            rangeSeparatorText: t("pagination.rangeSeparator", { defaultValue: "di" }),
            selectAllRowsItem: false,
          }}
          {...paginationIcons}
          dense
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight="360px"
          responsive
          onColumnOrderChange={handleColumnOrderChange}
          onSort={handleSort}
          sortServer={false}
          sortIcon={<span aria-hidden="true">▾</span>}
        />
      </div>

      {sortState && (
        <div className="mt-2 text-xs text-base-content/50">
          {t(`table.sorting.label`)} <strong>{sortState.columnKey}</strong> (
          {t(`table.sorting.direction.${sortState.direction}`, {
            defaultValue: sortState.direction,
          })}
          )
        </div>
      )}

      {hasChanges && (
        <div className="w-full my-4 flex gap-2 align-center justify-end">
          <button
            type="button"
            className="btn btn-default btn-outline"
            onClick={() => {
              setVisibleColumns(new Set(allHeaders));
              setColumnOrder([...allHeaders]);
              setSortState(null);
            }}
          >
            {t(`actions.cancel.label`)}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={applyChanges}
            disabled={!hasChanges}
          >
            {t(`table.actions.apply.label`)}
          </button>
        </div>
      )}

      <GenericDialog
        toggle={showResetDialog}
        title={t(`resetDialog.title`)}
        description={t(`resetDialog.description`)}
        labels={{
          cancel: t(`resetDialog.cancel`),
          confirm: t(`resetDialog.confirm`),
        }}
        confirmCb={() => {
          setShowResetDialog(false);
          if (onReset) onReset();
          else resetData();
        }}
        cancelCb={() => setShowResetDialog(false)}
      >
        <p className="text-sm text-warning font-medium">
          {t(`resetDialog.warning`)}
        </p>
      </GenericDialog>
    </div >
  );
}
