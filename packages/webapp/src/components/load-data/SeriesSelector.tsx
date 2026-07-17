import { startTransition, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataMngTable from "../DataMngTable";
import { moveDataColumn, transposeData } from "../../lib/utils";
import type { DataTransformRecipe, MatrixType } from "../../types";

type selectOptionType = {
  value: string;
  label: string;
};

type AggregationFn = "count" | "sum" | "mean";

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
  setData: (data: MatrixType, transform?: DataTransformRecipe) => void;
  initialData?: MatrixType;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.loadData.seriesSelector",
  });
  const [rawData, setRawData] = useState<MatrixType | null>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [aggregationFn, setAggregationFn] = useState<AggregationFn>("count");
  const [preAggregation, setPreAggregation] = useState<{
    data: MatrixType;
    category: selectOptionType | null;
    series: selectOptionType[];
    fn: AggregationFn;
  } | null>(null);

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
    setPreAggregation(null);
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
      // Same filters as the selects below: category = first non-numeric
      // column, series = numeric columns only
      let catIndex = initialData[0].findIndex(
        (_, i) => !isNumericColumn(initialData, i)
      );
      if (catIndex === -1) catIndex = 0;
      const matrix =
        catIndex === 0
          ? initialData
          : moveDataColumn(initialData, initialData[0][catIndex]);
      const c = getFirstOfMatrix(matrix);
      const newCategory = { value: c, label: c };
      const newSeries = getCols(matrix[0]).filter(
        (_, i) => i !== 0 && isNumericColumn(matrix, i)
      );
      startTransition(() => {
        setRawData(matrix);
        setCategory(newCategory);
        setSeries(newSeries);
        setInitialized(true);
      });
    }
  }, [initialData, initialized]);


  function aggregateData(fn: AggregationFn) {
    if (!rawData || !category) return;
    const catIdx = rawData[0].findIndex(
      (c) => String(c).trim() === category.value
    );
    if (catIdx === -1) return;

    const valueIdxs =
      fn === "count"
        ? []
        : rawData[0]
          .map((_, i) => i)
          .filter((i) => i !== catIdx && isNumericColumn(rawData, i));
    if (fn !== "count" && valueIdxs.length === 0) return;

    // Insertion-ordered group-by on the category column
    const groups = new Map<string, { count: number; sums: number[] }>();
    for (let r = 1; r < rawData.length; r++) {
      const key = String(rawData[r][catIdx] ?? "").trim();
      let group = groups.get(key);
      if (!group) {
        group = { count: 0, sums: valueIdxs.map(() => 0) };
        groups.set(key, group);
      }
      group.count++;
      valueIdxs.forEach((colIdx, i) => {
        group.sums[i] += cleanupValue(rawData[r][colIdx]);
      });
    }

    const header =
      fn === "count"
        ? [category.value, t("aggregate.countColumn")]
        : [category.value, ...valueIdxs.map((i) => rawData[0][i])];
    const aggregated: MatrixType = [header];
    for (const [key, group] of groups) {
      if (fn === "count") {
        aggregated.push([key, group.count]);
      } else {
        aggregated.push([
          key,
          ...group.sums.map((sum) =>
            // Round to 2 decimals (also cuts float addition noise on sums)
            Math.round((fn === "mean" ? sum / group.count : sum) * 100) / 100
          ),
        ]);
      }
    }

    setPreAggregation({ data: rawData, category, series, fn });
    setRawData(aggregated);
    // Keep the user's series selection where possible, otherwise select all
    const newCols = getCols(aggregated[0]).filter((_, i) => i !== 0);
    const kept = newCols.filter((col) =>
      series.some((s) => s.value === col.value)
    );
    setSeries(kept.length > 0 ? kept : newCols);
  }

  function undoAggregation() {
    if (!preAggregation) return;
    setRawData(preAggregation.data);
    setCategory(preAggregation.category);
    setSeries(preAggregation.series);
    setPreAggregation(null);
  }

  const MAX_READABLE_CATEGORIES = 100;

  function getCategoryWarning() {
    if (!rawData || !category) return null;
    const idx = rawData[0].findIndex(
      (c) => String(c).trim() === category.value
    );
    if (idx === -1) return null;
    const unique = new Set<string>();
    for (let i = 1; i < rawData.length; i++) {
      unique.add(String(rawData[i][idx]).trim());
    }
    const rows = rawData.length - 1;
    if (unique.size < rows) {
      return { type: "duplicates" as const, rows, unique: unique.size };
    }
    if (rows > MAX_READABLE_CATEGORIES) {
      return { type: "tooMany" as const, rows, unique: unique.size };
    }
    return null;
  }

  function handleComplete() {
    if (rawData && category && series.length > 0) {
      const filtered = filterData(rawData, category, series);
      if (filtered) {
        const newData = (cleanupData(filtered));
        // Recipe describing how the raw source was shaped: saved in chart
        // config so the server can replay it when refreshing remote data.
        const transform: DataTransformRecipe = {
          version: 1,
          category: category.value,
          series: series.map((s) => s.value),
          ...(preAggregation
            ? {
                aggregation: {
                  fn: preAggregation.fn,
                  ...(preAggregation.fn === "count"
                    ? { countLabel: String(rawData[0][1]).trim() }
                    : {}),
                },
              }
            : {}),
        };
        setData(newData, transform);
      }
    }
  }

  const categoryWarning = getCategoryWarning();
  const numericCols = rawData
    ? getCols(rawData[0]).filter((_, i) => isNumericColumn(rawData, i))
    : [];
  // Sum/mean need at least one numeric column; fall back to row count
  const effectiveAggregationFn: AggregationFn =
    numericCols.length === 0 ? "count" : aggregationFn;

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
            <h4 className="text-base font-medium">{t("header.label")}</h4>
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
                {t("actions.reset.label")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label htmlFor="category" className="label">
                <span className="label-text text-base">{t("category.label")}</span>
              </label>
              <select
                className="select select-bordered w-full text-base"
                name="category"
                id="category"
                aria-describedby="category-hint"
                value={category?.value}
                onChange={(e) => handleChangeCategory(e.target.value)}
              >
                {getCols(rawData[0])
                  .filter((_, i) => !isNumericColumn(rawData, i))
                  .map((col) => (
                    <option key={col.value} value={col.value}>
                      {col.value}
                    </option>
                  ))}
              </select>
              <p id="category-hint" className="text-sm text-base-content/70 mt-1">
                {t("category.hint")}
              </p>
              {categoryWarning && (
                <div role="status" className="alert alert-warning mt-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <div className="flex flex-col gap-2 w-full">
                    <span>
                      {t(
                        categoryWarning.type === "duplicates"
                          ? "warnings.duplicateCategories"
                          : "warnings.tooManyCategories",
                        {
                          column: category?.value,
                          rows: categoryWarning.rows,
                          unique: categoryWarning.unique,
                        }
                      )}
                    </span>
                    {categoryWarning.type === "duplicates" && (
                      <>
                        <span className="font-medium">
                          {t("aggregate.suggestion", {
                            column: category?.value,
                          })}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <label htmlFor="aggregation-fn" className="sr-only">
                            {t("aggregate.fnLabel")}
                          </label>
                          <select
                            id="aggregation-fn"
                            className="select select-bordered select-sm w-auto"
                            value={effectiveAggregationFn}
                            onChange={(e) =>
                              setAggregationFn(e.target.value as AggregationFn)
                            }
                          >
                            <option value="count">
                              {t("aggregate.fn.count")}
                            </option>
                            {numericCols.length > 0 && (
                              <>
                                <option value="sum">
                                  {t("aggregate.fn.sum")}
                                </option>
                                <option value="mean">
                                  {t("aggregate.fn.mean")}
                                </option>
                              </>
                            )}
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => aggregateData(effectiveAggregationFn)}
                          >
                            {t("aggregate.apply", { column: category?.value })}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {preAggregation && (
                <div role="status" className="alert alert-success mt-2 text-sm">
                  <span>
                    {t("aggregate.applied", {
                      column: category?.value,
                      fn: t(`aggregate.fn.${preAggregation.fn}`),
                      from: preAggregation.data.length - 1,
                      to: (rawData?.length ?? 1) - 1,
                    })}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => undoAggregation()}
                  >
                    {t("aggregate.undo")}
                  </button>
                </div>
              )}
            </div>

            {category && numericCols.length === 0 && (
              <div role="status" className="alert alert-warning text-sm">
                <span>{t("series.empty")}</span>
              </div>
            )}

            {category && numericCols.length > 0 && (
              <div className="form-control">
                <label htmlFor="series" className="label">
                  <span className="label-text text-base">{t("series.label")}</span>
                  <span className="text-sm text-base-content/70">
                    {t("series.multiSelect")}
                  </span>
                </label>
                <select

                  className="select select-bordered w-full min-h-[100px] text-base"
                  name="series"
                  id="series"
                  aria-describedby="series-hint"
                  multiple={true}
                  value={series.map((s) => s.value)}
                  onChange={(e) =>
                    handleChangeSerie(
                      [...e.target.selectedOptions].map((o) => o.value)
                    )
                  }
                >
                  {numericCols.map((col) => (
                    <option key={col.value} value={col.value}>
                      {col.value}
                    </option>
                  ))}
                </select>
                <p id="series-hint" className="text-sm text-base-content/70 mt-1">
                  {t("series.hint")}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleComplete()}
            disabled={!category || series.length === 0}
          >
            {t("actions.submit.label")}
          </button>
        </div>
      )}


    </div>
  );
}

