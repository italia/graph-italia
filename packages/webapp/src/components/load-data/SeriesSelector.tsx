import { useTransition, useEffect, useState, } from "react";
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

export default function SeriesSelector({ setData, initialData, uploadData }: {
  setData: () => void;
  initialData?: any;
  uploadData?: any;
}) {
  // const [_, startTransition] = useTransition();
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

  function filterData(
    data: any,
    cat: selectOptionType | null,
    ser: selectOptionType[]
  ) {
    if (!ser || !cat) return null;
    const cols = [cat, ...ser].map((col: any) => col.value);
    const filtered = data.map((row: any) => {
      return row.filter((_r: any, i: number) => {
        return cols.includes(data[0][i].trim());
      });
    });
    return filtered;
  }
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

  function reset() {
    setRawData(null);
    setCategory(null);
    setSeries([]);
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

  function updateState(data: any) {
    const c = getFirstOfMAtrix(data);
    const newCategory = { value: c, label: c };
    const cols = getCols(data[0]);
    const newSeries = cols.filter((i) => !isSameObject(i, newCategory));
    // startTransition(() => {
    setRawData(data);
    setCategory(newCategory);
    setSeries(newSeries);
    // });
  }

  // Initialize with existing data
  useEffect(() => {
    if (initialData && initialData.length > 0 && !initialized) {
      updateState(initialData);
    }
  }, [initialData, initialized]);


  useEffect(() => {
    if (uploadData) {
      updateState(uploadData);
      setInitialized(true);
    }
  }, [uploadData]);



  // Automatically update data when category or series change
  useEffect(() => {
    if (rawData && category && series.length > 0) {
      const filtered = filterData(rawData, category, series);
      if (filtered) {
        setData(cleanupData(filtered));
      }
    }
  }, [rawData, category, series]);



  return (
    <div className="space-y-4">

      {rawData && (
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Configure columns</h4>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => transpose()}
              >
                Transpose
              </button>
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => reset()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {getCols(rawData[0]).map((col) => (
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

        </div>
      )}
    </div>
  );
}

