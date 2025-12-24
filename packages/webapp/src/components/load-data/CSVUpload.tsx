import Papa from "papaparse";
import { useEffect, useState, useTransition } from "react";
import { log, moveDataColumn, transposeData } from "../../lib/utils";
import { MatrixType } from "../../types";

type selectOptionType = {
  value: string;
  label: string;
};

function cleanupValue(v: string | number) {
  if (!v) return 0;
  try {
    const value = parseFloat("" + v);
    return value;
  } catch (error) {
    return 0;
  }
}

function cleanupData(matrix: MatrixType) {
  return matrix.map((row, index) => {
    if (index === 0) return row;
    return row.map((cell, j) => {
      if (j == 0) return cell;
      return cleanupValue(cell);
    });
  });
}

function UploadCSV({
  setData,
  initialData,
}: {
  setData: Function;
  initialData?: any;
}) {
  const [_, startTransition] = useTransition();
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[] | []>([]);
  const [initialized, setInitialized] = useState(false);

  function isSameObject(a: object, b: object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function getFirstOfMAtrix(matrix: any) {
    const val = matrix[0][0];
    return typeof val === "string" ? val.trim() : String(val);
  }
  function getCols(cols: (string | number)[]) {
    return cols.map((c: string | number) => {
      const col = typeof c === "string" ? c.trim() : String(c);
      return { value: col, label: col };
    });
  }

  // Initialize with existing data
  useEffect(() => {
    if (initialData && initialData.length > 0 && !initialized) {
      const c = getFirstOfMAtrix(initialData);
      const newCategory = { value: c, label: c };
      const cols = getCols(initialData[0]);
      const newSeries = cols.filter((i) => !isSameObject(i, newCategory));

      setRawData(initialData);
      setCategory(newCategory);
      setSeries(newSeries);
      setInitialized(true);
    }
  }, [initialData, initialized]);

  function filterData(
    data: any,
    cat: selectOptionType | null,
    ser: selectOptionType[]
  ) {
    if (!ser || !cat) return null;
    const cols = [cat, ...ser].map((col: any) => col.value);
    const filtered = data.map((row: any) => {
      return row.filter((_r: any, i: number) => {
        const headerVal = data[0][i];
        const headerStr =
          typeof headerVal === "string" ? headerVal.trim() : String(headerVal);
        return cols.includes(headerStr);
      });
    });
    return filtered;
  }

  function uploadFile(event: any) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const { data } = results;
        log("RESULTS DATA", data);
        const c = getFirstOfMAtrix(data);
        const newCategory = { value: c, label: c };
        log("CATEGORY", newCategory);
        const cols = getCols(data[0]);
        log("COLS", cols);
        const newSeries = cols.filter((i) => !isSameObject(i, newCategory));
        log("SERIES", newSeries);

        startTransition(() => {
          setRawData(data);
          setCategory(newCategory);
          setSeries(newSeries);
        });
      },
    });
  }

  // Automatically update data when category or series change
  useEffect(() => {
    if (rawData && category && series.length > 0) {
      const filtered = filterData(rawData, category, series);
      if (filtered) {
        setData(cleanupData(filtered));
      }
    }
  }, [rawData, category, series]);

  function transpose() {
    const transposed = transposeData(rawData);
    setRawData(transposed);
    const c = getFirstOfMAtrix(transposed);
    const newCategory = { value: c, label: c };
    setCategory(newCategory);
    setSeries(
      getCols(transposed[0]).filter((i) => !isSameObject(i, newCategory))
    );
  }

  function handleChangeCategory(newValue: string) {
    setSeries([]);
    const newCategory: any = getCols(rawData[0]).find(
      (i) => i.value === newValue
    );
    setCategory(newCategory);
    setRawData(moveDataColumn(rawData, newValue));
  }

  function handleChangeSerie(options: string[]) {
    const newSeries = getCols(rawData[0]).filter((i: any) =>
      options.map((o) => o).includes(i.value)
    );
    setSeries(newSeries);
  }

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Upload CSV file</span>
        </label>
        <input
          className="file-input file-input-bordered file-input-primary w-full"
          type="file"
          name="file"
          accept=".csv"
          onChange={(e) => uploadFile(e)}
        />
      </div>

      {rawData && (
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Configure columns</h4>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => transpose()}
              >
                Transpose
              </button>
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={() => {
                  setRawData(null);
                  setCategory(null);
                  setSeries([]);
                }}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category column (X axis)</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="category"
                id="category"
                value={category?.value}
                onChange={(e) => handleChangeCategory(e.target.value)}
              >
                {getCols(rawData[0]).map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.value}
                  </option>
                ))}
              </select>
            </div>

            {category && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data series (values)</span>
                  <span className="label-text-alt text-base-content/50">
                    Ctrl+click for multiple selection
                  </span>
                </label>
                <select
                  className="select select-bordered w-full min-h-[100px]"
                  name="series"
                  id="series"
                  multiple={true}
                  value={series.map((s) => s.value)}
                  onChange={(e) =>
                    handleChangeSerie(
                      [...e.target.selectedOptions].map((o) => o.value)
                    )
                  }
                >
                  {getCols(rawData[0])
                    .filter((i) => !isSameObject(i, category))
                    .map((col) => (
                      <option key={col.value} value={col.value}>
                        {col.value}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {series.length > 0 && (
            <div className="alert alert-success py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">
                Data loaded: {series.length} series selected
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
