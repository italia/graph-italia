import { useCallback, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { transposeData } from "../../lib/utils";
import type { MatrixType } from "../../types";
import { useSettingsStore } from "../../store/settings_store.ts";

createTheme(
  "dark",
  {
    text: {
      primary: "rgba(255,255,255, 0.54)",
      secondary: "rgba(255,255,255, 0.54)",
      disabled: "rgba(255,255,255, 0.38)",
    },
    background: {
      default: "transparent",
    },
    divider: {
      default: "rgba(255,255,255,.075)",
    },
    highlightOnHover: {
      default: "rgba(255,255,255,.03)",
      text: "#fff",
    },
  },
);

type TransformDataProps = {
  currentData: MatrixType;
  handleTransformData: (d: MatrixType) => void;
};

type SortState = {
  columnKey: string;
  direction: "asc" | "desc";
} | null;

type RowRecord = Record<string, string | number>;

export default function TransformData({
  currentData,
  handleTransformData,
}: TransformDataProps) {
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
  const [columnOrder, setColumnOrder] = useState<string[]>(() => [...allHeaders]);

  // State: current sort
  const [sortState, setSortState] = useState<SortState>(null);

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
        name: key,
        selector: (row: RowRecord) => row[key] as string,
        sortable: true,
        reorder: true,
      }));
  }, [columnOrder, visibleColumns]);

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
  }, [columnOrder, visibleColumns, objectData, sortState, handleTransformData]);

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    const originalHeaders = (currentData[0] ?? []).map(String);
    const dataChanged = workingData !== currentData;
    const visibleChanged = visibleColumns.size !== allHeaders.length;
    const orderChanged = columnOrder.some((key, i) => key !== originalHeaders[i]);
    return dataChanged || visibleChanged || orderChanged || sortState !== null;
  }, [visibleColumns, columnOrder, allHeaders, sortState, workingData, currentData]);

  return (
    <div className="mt-10">
      {/* Transpose & Reset controls */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-base-content/70">
          Transform Data
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-default btn-outline"
            onClick={transpose}
          >
            Transpose
          </button>
          <button
            type="button"
            className="btn btn-default btn-outline"
            onClick={resetData}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Column toggle controls */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-base-content/70">
          Toggle columns
        </h4>
        <div className="flex flex-wrap gap-2">
          {columnOrder.map((colName) => (
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

      <DataTable
        title="Transform Data"
        columns={columns}
        data={objectData}
        pagination={true}
        highlightOnHover={true}
        dense={true}
        fixedHeader={true}
        fixedHeaderScrollHeight={"400px"}
        responsive={true}
        onColumnOrderChange={handleColumnOrderChange}
        onSort={handleSort}
        sortServer={false}
        theme={currentTheme}
      />

      {sortState && (
        <div className="mt-2 text-xs text-base-content/50">
          Sorted by <strong>{sortState.columnKey}</strong> ({sortState.direction})
        </div>
      )}

      <div className="my-4 flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={applyChanges}
          disabled={!hasChanges}
        >
          Apply Changes
        </button>
        {hasChanges && (
          <button
            type="button"
            className="btn btn-default btn-outline"
            onClick={() => {
              setVisibleColumns(new Set(allHeaders));
              setColumnOrder([...allHeaders]);
              setSortState(null);
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
