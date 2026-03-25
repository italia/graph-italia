import { startTransition, useCallback, useEffect, useState } from "react";
import DataMngTable from "../DataMngTable";
import { moveDataColumn, transposeData } from "../../lib/utils";
import type { MatrixType } from "../../types";

type selectOptionType = {
  value: string;
  label: string;
};

function cleanupValue(v: string | number) {
  if (!v) return 0;
  try {
    const value = parseFloat("" + v);
    return value;
  } catch {
    return 0;
  }
}

function canBeNumber(v: string | number): boolean {
  if (typeof v === "number") return !Number.isNaN(v);
  const trimmed = v.trim();
  if (trimmed === "") return false;
  return !Number.isNaN(Number(trimmed));
}

function isNumericColumn(matrix: MatrixType, colIndex: number): boolean {
  for (let i = 1; i < matrix.length; i++) {
    const cell = matrix[i][colIndex];
    if (cell !== null && cell !== undefined && cell !== "" && !canBeNumber(cell)) {
      return false;
    }
  }
  return true;
}

function isStringColumn(matrix: MatrixType, colIndex: number): boolean {
  for (let i = 1; i < matrix.length; i++) {
    const cell = matrix[i][colIndex];
    if (cell !== null && cell !== undefined && cell !== "" && canBeNumber(cell)) {
      return false;
    }
  }
  return true;
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

export default function SeriesSelector({ setData, initialData }: {
  setData: (data: MatrixType) => void;
  initialData?: MatrixType;
}) {
  const [rawData, setRawData] = useState<MatrixType | null>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[]>([]);
  const [initialized, setInitialized] = useState(false);

  function isSameObject(a: object, b: object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  function getFirstOfMatrix(matrix: MatrixType) {
    const val = matrix[0][0];
    return typeof val === "string" ? val.trim() : String(val);
  }

  function getCols(cols: (string | number)[]) {
    return cols.map((c: string | number) => {
      const col = typeof c === "string" ? c.trim() : String(c);
      return { value: col, label: col };
    });
  }

  function filterData(
    data: MatrixType,
    cat: selectOptionType | null,
    ser: selectOptionType[]
  ): MatrixType | null {
    if (!ser || !cat) return null;
    const cols = [cat, ...ser].map((col) => col.value);
    const filtered = data.map((row) => {
      return row.filter((_r, i: number) => {
        return cols.includes(String(data[0][i]).trim());
      });
    });
    return filtered;
  }

  function transpose() {
    const transposed = transposeData(rawData);
    setRawData(transposed);
    const c = getFirstOfMatrix(transposed);
    const newCategory = { value: c, label: c };
    setCategory(newCategory);
    setSeries(
      getCols(transposed[0]).filter((i) => !isSameObject(i, newCategory))
    );
  }

  function reset() {
    setRawData(null);
    setCategory(null);
    setSeries([]);
  }


  function handleChangeCategory(newValue: string) {
    if (!rawData) return;
    setSeries([]);
    const newCategory = getCols(rawData[0]).find(
      (i) => i.value === newValue
    );
    if (newCategory) {
      setCategory(newCategory);
      setRawData(moveDataColumn(rawData, newValue));
    }
  }

  function handleChangeSerie(options: string[]) {
    if (!rawData) return;
    const newSeries = getCols(rawData[0]).filter((i) =>
      options.map((o) => o).includes(i.value)
    );
    setSeries(newSeries);
  }

  // Initialize with existing data (once only to prevent update loop)
  useEffect(() => {
    if (initialData && initialData.length > 0 && !initialized) {
      const c = getFirstOfMatrix(initialData);
      const newCategory = { value: c, label: c };
      const cols = getCols(initialData[0]);
      const newSeries = cols.filter((i) => !isSameObject(i, newCategory));
      startTransition(() => {
        setRawData(initialData);
        setCategory(newCategory);
        setSeries(newSeries);
        setInitialized(true);
      });
    }
  }, [initialData, initialized]);


  function handleComplete() {
    console.log("rawData:", rawData);
    if (rawData && category && series.length > 0) {
      const filtered = filterData(rawData, category, series);
      if (filtered) {
        const newData = (cleanupData(filtered));
        console.log("Cleaned data:", newData);
        setData(newData);
      }
    }
  }

  return (
    <div className="space-y-4">
      {rawData && (
        <div className="overflow-x-auto">
          <DataMngTable data={rawData} onApplyData={setRawData} />
        </div>
      )}
      {rawData && (
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Configure columns</h4>
            <div className="flex gap-2">
              {/* <button
                type="button"
                className="btn btn-outline"
                onClick={() => transpose()}
              >
                Transpose
              </button> */}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => reset()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label htmlFor="category" className="label">
                <span className="label-text">Category column (X axis)</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="category"
                id="category"
                value={category?.value}
                onChange={(e) => handleChangeCategory(e.target.value)}
              >
                {getCols(rawData[0])
                  .filter((col, i) => !isNumericColumn(rawData, i))
                  .map((col) => (
                    <option key={col.value} value={col.value}>
                      {col.value}
                    </option>
                  ))}
              </select>
            </div>

            {category && (
              <div className="form-control">
                <label htmlFor="series" className="label">
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
                    .filter((col, i) => isNumericColumn(rawData, i))
                    .map((col) => (
                      <option key={col.value} value={col.value}>
                        {col.value}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleComplete()}
            disabled={!category || series.length === 0}
          >
            Load data
          </button>
        </div>
      )}


    </div>
  );
}

