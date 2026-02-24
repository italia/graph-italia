import { useCallback, useEffect, useMemo, useState } from "react";
import DataTableComponent, { type TableColumn } from "react-data-table-component";

type RowRecord = Record<string, string | number>;

type DataTableProps = {
  data: any;
  reset?: () => void;
  transpose: () => void;
  download?: () => void;
  downloadJSON?: () => void;
  buttonVariant?: "default" | "italia";
  onRenameHeaders?: (renamedData: any) => void;
  onReorderColumns?: (reorderedData: any) => void;
};

const btnClass = (variant: "default" | "italia") =>
  variant === "italia" ? "btn-italia btn-italia-secondary-outline" : "btn";

export default function DataTable({
  data,
  reset,
  transpose,
  download,
  downloadJSON,
  buttonVariant = "default",
  onRenameHeaders,
  onReorderColumns,
}: DataTableProps) {
  const b = btnClass(buttonVariant);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [renameValues, setRenameValues] = useState<string[]>([]);

  // Reset form when data changes
  useEffect(() => {
    setShowRenameForm(false);
    setRenameValues([]);
  }, [data]);

  const headers: string[] = useMemo(() => {
    if (!data?.[0]) return [];
    return data[0].map(String);
  }, [data]);

  const columns = useMemo(() => {
    return headers.map((key, i) => ({
      name: key,
      selector: (row: RowRecord) => row[key],
      sortable: true,
      reorder: true,
      wrap: true,
      style: i === 0 ? { fontWeight: "bold" } : undefined,
    }));
  }, [headers]);

  const rows: RowRecord[] = useMemo(() => {
    if (!data || data.length < 2) return [];
    return data.slice(1).map((row: (string | number)[]) => {
      const obj: RowRecord = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  }, [data, headers]);

  function openRenameForm() {
    if (!data?.[0]) return;
    setRenameValues(data[0].map(String));
    setShowRenameForm(true);
  }

  function applyRenames() {
    if (!onRenameHeaders) return;
    const newData = data.map((row: (string | number)[], rowIndex: number) => {
      if (rowIndex === 0) return renameValues;
      return row;
    });
    onRenameHeaders(newData);
    setShowRenameForm(false);
  }

  const handleColumnOrderChange = useCallback(
    (newCols: TableColumn<RowRecord>[]) => {
      if (!onReorderColumns || !data?.[0]) return;
      const newOrder = newCols
        .map((c) => (typeof c.name === "string" ? c.name : ""))
        .filter(Boolean);

      // Map new column order to original indices
      const indexMap = newOrder.map((name) => headers.indexOf(name));

      // Rebuild matrix with reordered columns
      const reordered = data.map((row: (string | number)[]) =>
        indexMap.map((i) => row[i]),
      );
      onReorderColumns(reordered);
    },
    [onReorderColumns, data, headers],
  );
  return (
    <>
      {data && data[0] && (
        <div>
          <p className="text-sm text-gray-600">
            {data.length} rows, {data[0].length} columns
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {transpose && (
              <button type="button" className={b} onClick={() => transpose()}>
                Transpose
              </button>
            )}
            {reset && (
              <button type="button" className={b} onClick={() => reset()}>
                Reset
              </button>
            )}
            {download && (
              <button type="button" className={b} onClick={() => download()}>
                Download CSV
              </button>
            )}
            {downloadJSON && (
              <button
                type="button"
                className={b}
                onClick={() => downloadJSON()}
              >
                Download JSON
              </button>
            )}
            {onRenameHeaders && (
              <button
                type="button"
                className={b}
                onClick={() =>
                  showRenameForm ? setShowRenameForm(false) : openRenameForm()
                }
              >
                {showRenameForm ? "Cancel Rename" : "Rename Headers"}
              </button>
            )}
          </div>

          {showRenameForm && (
            <div className="mt-4 p-4 rounded-lg border border-base-300 bg-base-200">
              <h4 className="text-sm font-semibold mb-3">Rename column headers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {renameValues.map((val, i) => (
                  <div key={i} className="form-control">
                    <label className="label py-0.5">
                      <span className="label-text text-xs text-base-content/50">
                        Column {i + 1}
                      </span>
                    </label>
                    <input
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
                  Apply
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowRenameForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <DataTableComponent
              columns={columns}
              data={rows}
              pagination
              dense
              highlightOnHover
              fixedHeader
              fixedHeaderScrollHeight="360px"
              responsive
              onColumnOrderChange={onReorderColumns ? handleColumnOrderChange : undefined}
            />
          </div>
        </div>
      )}
    </>
  );
}
