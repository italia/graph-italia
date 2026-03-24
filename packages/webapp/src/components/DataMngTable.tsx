import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTableComponent, { type TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import type { MatrixType } from "dataviz-components";

import { useSettingsStore } from "../lib/store/settings_store.ts";
import { transposeData } from "../lib/utils";
import { useAriaSort } from "../hooks/useAriaSort";
import registerDarkTheme from "./layout/DataTableDarkTheme";

registerDarkTheme();

type RowRecord = Record<string, string | number>;

type DataTableProps = {
  data: MatrixType;
  onApplyData?: (transformedData: MatrixType) => void;
  download?: () => void;
  downloadJSON?: () => void;
  buttonVariant?: "default" | "italia";
};

export default function DataTable({
  data,
  onApplyData,
  download,
  downloadJSON,
}: DataTableProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.dataMngTable",
  });
  const { settings } = useSettingsStore();
  const currentTheme = settings?.preferredTheme === "dark" ? "dark" : "default";
  const [workingData, setWorkingData] = useState<MatrixType>(data);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [renameValues, setRenameValues] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [sortState, setSortState] = useState<{
    columnKey: string;
    direction: "asc" | "desc";
  } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  useAriaSort(tableRef, sortState);

  // Sync workingData and visibleColumns when data prop changes
  useEffect(() => {
    setWorkingData(data);
    setSortState(null);
    if (data?.[0]) {
      setVisibleColumns(new Set(data[0].map(String)));
    }
  }, [data]);

  // Reset rename form when workingData changes
  useEffect(() => {
    setShowRenameForm(false);
    setRenameValues([]);
  }, [workingData]);

  const headers: string[] = useMemo(() => {
    if (!workingData?.[0]) return [];
    return workingData[0].map(String);
  }, [workingData]);

  const columns = useMemo(() => {
    return headers
      .filter((key) => visibleColumns.has(key))
      .map((key, i) => ({
        name: key,
        selector: (row: RowRecord) => row[key],
        sortable: true,
        reorder: true,
        wrap: true,
        style: i === 0 ? { fontWeight: "bold" } : undefined,
      }));
  }, [headers, visibleColumns]);

  const rows: RowRecord[] = useMemo(() => {
    if (!workingData || workingData.length < 2) return [];
    return workingData.slice(1).map((row: (string | number)[]) => {
      const obj: RowRecord = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  }, [workingData, headers]);

  const hasChanges = useMemo(() => {
    const originalHeaders = (data[0] ?? []).map(String);
    const dataChanged = JSON.stringify(data) !== JSON.stringify(workingData);
    const visibilityChanged = visibleColumns.size !== originalHeaders.length;
    return dataChanged || visibilityChanged || sortState !== null;
  }, [data, workingData, visibleColumns, sortState]);

  function internalTranspose() {
    const transposed = transposeData(workingData);
    setWorkingData(transposed);
    if (transposed?.[0]) {
      setVisibleColumns(new Set(transposed[0].map(String)));
    }
    onApplyData?.(transposed);
  }

  function internalReset() {
    setWorkingData(data);
    setSortState(null);
    if (data?.[0]) {
      setVisibleColumns(new Set(data[0].map(String)));
    }
  }

  function toggleColumn(colName: string) {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colName)) {
        next.delete(colName);
      } else {
        next.add(colName);
      }
      return next;
    });
  }

  function internalApply() {
    // Reconstruct matrix with only visible columns
    const finalHeaders = headers.filter((h) => visibleColumns.has(h));
    const headerRow = workingData[0];
    const indexMap = finalHeaders.map((h) => headers.indexOf(h));

    let finalRows = workingData
      .slice(1)
      .map((row: any[]) => indexMap.map((i) => row[i]));

    // Apply Sort if active
    if (sortState) {
      const colIndex = finalHeaders.indexOf(sortState.columnKey);
      if (colIndex >= 0) {
        finalRows = [...finalRows].sort((a, b) => {
          const valA = a[colIndex];
          const valB = b[colIndex];
          if (typeof valA === "number" && typeof valB === "number") {
            return sortState.direction === "asc" ? valA - valB : valB - valA;
          }
          const cmp = String(valA).localeCompare(String(valB));
          return sortState.direction === "asc" ? cmp : -cmp;
        });
      }
    }
    if (onApplyData) {
      onApplyData([finalHeaders, ...finalRows]);
    }
  }

  function openRenameForm() {
    if (!workingData?.[0]) return;
    setRenameValues(workingData[0].map(String));
    setShowRenameForm(true);
  }

  function applyRenames() {
    const newData = workingData.map(
      (row: (string | number)[], rowIndex: number) => {
        if (rowIndex === 0) return renameValues;
        return row;
      },
    );

    // Update visibility set with new names
    setVisibleColumns((prev) => {
      const next = new Set<string>();
      renameValues.forEach((newName, i) => {
        const oldName = headers[i];
        if (prev.has(oldName)) {
          next.add(newName);
        }
      });
      return next;
    });

    setWorkingData(newData);
    setShowRenameForm(false);
  }

  const handleSort = useCallback(
    (column: TableColumn<RowRecord>, direction: "asc" | "desc") => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) {
        setSortState({ columnKey: key, direction });
      }
    },
    [],
  );

  const handleColumnOrderChange = useCallback(
    (newCols: TableColumn<RowRecord>[]) => {
      if (!workingData?.[0]) return;
      const newOrder = newCols
        .map((c) => (typeof c.name === "string" ? c.name : ""))
        .filter(Boolean);

      // Map new column order to indices in current workingData
      const indexMap = newOrder.map((name) => headers.indexOf(name));

      // Rebuild matrix with reordered columns
      const reordered = workingData.map((row: (string | number)[]) =>
        indexMap.map((i) => row[i]),
      );
      setWorkingData(reordered);
    },
    [workingData, headers],
  );
  return (
    <>
      {data && data[0] && (
        <div>
          <p className="text-sm text-content/60">
            {workingData.length} {t("header.rows")}, {workingData[0].length}{" "}
            {t("header.columns")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={"btn btn-outline"}
              onClick={internalTranspose}
            >
              {t("actions.transpose.label")}
            </button>

            <button
              type="button"
              className={`btn btn-primary ${!hasChanges ? "btn-disabled" : ""}`}
              onClick={internalApply}
              disabled={!hasChanges}
            >
              {t("actions.applyChanges.label")}
            </button>
            <button
              type="button"
              className={`btn btn-outline ${!hasChanges ? "btn-disabled" : ""}`}
              onClick={internalReset}
              disabled={!hasChanges}
            >
              {t("actions.reset.label")}
            </button>
            {download && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => download()}
              >
                {t("actions.downloadCsv.label")}
              </button>
            )}
            {downloadJSON && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => downloadJSON()}
              >
                {t("actions.downloadJson.label")}
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                showRenameForm ? setShowRenameForm(false) : openRenameForm()
              }
            >
              {showRenameForm
                ? t("actions.rename.fallback")
                : t("actions.rename.label")}
            </button>
          </div>

          <div className="mt-6 mb-4">
            <h4 className="text-sm font-semibold mb-2 text-base-content/70">
              {t("toggle.title")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {headers.map((colName) => (
                <label
                  key={colName}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-xs border transition-colors ${visibleColumns.has(colName)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-base-200 border-base-300 text-base-content/40 line-through"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(colName)}
                    onChange={() => toggleColumn(colName)}
                    className="checkbox checkbox-xs checkbox-primary"
                  />
                  {colName}
                </label>
              ))}
            </div>
          </div>

          {sortState && (
            <div className="mt-2 text-xs text-base-content/50 italic">
              {t("sorting.sortedBy")} <strong>{sortState.columnKey}</strong> (
              {sortState.direction})
            </div>
          )}

          {showRenameForm && (
            <div className="mt-4 p-4 rounded-lg border border-base-300 bg-base-200">
              <h4 className="text-sm font-semibold mb-3">
                {t("renameForm.title")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {renameValues.map((val, i) => (
                  <div key={i} className="form-control">
                    <label htmlFor={`col-rename-${i}`} className="label py-0.5">
                      <span className="label-text text-xs text-base-content/50">
                        {t("renameForm.column")} {i + 1}
                      </span>
                    </label>
                    <input
                      id={`col-rename-${i}`}
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const updated = [...renameValues];
                        updated[i] = e.target.value;
                        setRenameValues(updated);
                      }}
                      className="input input-sm input-bordered w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={applyRenames}
                >
                  {t("renameForm.actions.apply.label")}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowRenameForm(false)}
                >
                  {t("renameForm.actions.cancel.label")}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4" ref={tableRef}>
            <DataTableComponent
              columns={columns}
              data={rows}
              theme={currentTheme}
              pagination
              dense
              highlightOnHover
              fixedHeader
              fixedHeaderScrollHeight="360px"
              responsive
              onColumnOrderChange={handleColumnOrderChange}
              onSort={handleSort}
              sortServer={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
