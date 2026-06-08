import { startTransition, useEffect, useState } from "react";
import DataMngTable from "../DataMngTable";
import { transposeData } from "../../lib/utils";
import type { MatrixType, AISuggestion } from "../../types";
import * as api from "../../lib/api";

type DataHelperProps = {
  rawData: MatrixType;
  setData: (data: MatrixType) => void;
};

export default function DataHelper({ rawData, setData }: DataHelperProps) {
  const [currentData, setCurrentData] = useState<MatrixType>(rawData);
  const [isLoadingHints, setIsLoadingHints] = useState(false);
  const [hints, setHints] = useState<AISuggestion[] | null>(null);
  const [hintsError, setHintsError] = useState<string | null>(null);

  // Re-sync when a new file is uploaded
  useEffect(() => {
    setCurrentData(rawData);
    setHints(null);
    setHintsError(null);
  }, [rawData]);

  function transpose() {
    startTransition(() => {
      setCurrentData((prev) => transposeData(prev));
    });
  }

  function reset() {
    startTransition(() => {
      setCurrentData(rawData);
      setHints(null);
      setHintsError(null);
    });
  }

  async function getHints() {
    setIsLoadingHints(true);
    setHints(null);
    setHintsError(null);
    try {
      const result = await api.getSuggestions(currentData);
      if (Array.isArray(result)) {
        setHints(result as AISuggestion[]);
      } else {
        setHintsError("No suggestions returned.");
      }
    } catch (err: unknown) {
      setHintsError(
        err instanceof Error ? err.message : "Failed to get suggestions.",
      );
    } finally {
      setIsLoadingHints(false);
    }
  }

  return (
    <div className="space-y-4">
      {currentData &&
        <div className="overflow-x-auto">
          <DataMngTable
            data={currentData}
            onApplyData={(d) => {
              startTransition(() => setCurrentData(d));
            }}
          />
        </div>
      }

      {/* Transpose / Reset */}
      <div className="p-4 bg-base-200 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Quick transforms</h4>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={transpose}
            >
              Transpose
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* AI inspection */}
      <div className="p-4 bg-base-200 rounded-lg space-y-3">
        <button
          type="button"
          className="btn btn-outline btn-sm gap-2"
          onClick={getHints}
          disabled={isLoadingHints}
        >
          {isLoadingHints ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            "Inspect Data with AI"
          )}
        </button>

        {hintsError && (
          <div role="alert" className="alert alert-error text-sm py-2">
            {hintsError}
          </div>
        )}

        {hints && hints.length === 0 && (
          <p className="text-sm text-base-content/60">No suggestions for this data.</p>
        )}

        {hints && hints.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">AI Suggestions</h4>
            {hints.map((hint, i) => (
              <div
                key={hint.id ?? i}
                className="card bg-base-100 border border-base-300 shadow-sm"
              >
                <div className="card-body p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="badge badge-primary badge-sm shrink-0 mt-0.5">
                      {hint.chartType}
                    </span>
                    <p className="text-sm">{hint.description}</p>
                  </div>

                  {hint.xAxis && (
                    <p className="text-xs text-base-content/60">
                      <span className="font-medium">X axis:</span>{" "}
                      {hint.xAxis.displayName ?? hint.xAxis.sourceColumn}
                    </p>
                  )}

                  {hint.yAxes?.length > 0 && (
                    <p className="text-xs text-base-content/60">
                      <span className="font-medium">Y axes:</span>{" "}
                      {hint.yAxes.map((y) => y.displayName).join(", ")}
                    </p>
                  )}

                  {hint.transformations?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-base-content/60 mb-1">
                        Transformations
                      </p>
                      <ul className="space-y-0.5">
                        {hint.transformations.map((tr, j) => (
                          <li
                            key={j}
                            className="text-xs text-base-content/70 flex items-center gap-1.5 flex-wrap"
                          >
                            <span className="badge badge-ghost badge-xs">{tr.type}</span>
                            {tr.inputColumns && (
                              <span>{tr.inputColumns.join(", ")}</span>
                            )}
                            {tr.outputColumnName && (
                              <span className="opacity-60">→ {tr.outputColumnName}</span>
                            )}
                            {tr.aggregationFunction && (
                              <span className="badge badge-outline badge-xs">
                                {tr.aggregationFunction}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm selection */}
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => setData(currentData)}
      >
        Use this Data
      </button>
    </div>
  );
}
