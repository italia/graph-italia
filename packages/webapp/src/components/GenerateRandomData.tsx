import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fillArray, generateItems } from "../lib/utils";

function GenerateRandomData({ setData }: { setData: (data: any) => void }) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.generateRandomData",
  });
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  function generate() {
    const rowLabels = generateItems("SERIE", rows);
    const colLabels = ["_", ...generateItems("T", cols)];

    const matrix: (string | number)[][] = [];
    matrix[0] = colLabels;
    for (let i = 1; i <= rows; i++) {
      matrix[i] = [
        rowLabels[i - 1],
        ...fillArray(cols, min, max).map((v) => (v + offset) * multiplier),
      ];
    }
    setData(matrix);
  }

  const inputClass = "input input-bordered w-full rounded-md";
  const labelClass = "label text-content/70 font-medium";

  return (
    <div className="rounded-2xl p-6 shadow-sm vorder border-base-200 bg-base-300">
      <h2 className="text-lg font-semibold text-contet/90 mb-4">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="gen-rows" className={labelClass}>
            {t("columns.rows.label")}
          </label>
          <input
            id="gen-rows"
            className={inputClass}
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number.parseInt(e.target.value) || 1)}
          />
        </div>
        <div>
          <label htmlFor="gen-cols" className={labelClass}>
            {t("columns.columns.label")}
          </label>
          <input
            id="gen-cols"
            className={inputClass}
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number.parseInt(e.target.value) || 1)}
          />
        </div>
        <div>
          <label htmlFor="gen-min" className={labelClass}>
            {t("columns.rangeMin.label")}
          </label>
          <input
            id="gen-min"
            className={inputClass}
            type="number"
            value={min}
            onChange={(e) => setMin(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="gen-max" className={labelClass}>
            {t("columns.rangeMax.label")}
          </label>
          <input
            id="gen-max"
            className={inputClass}
            type="number"
            value={max}
            onChange={(e) => setMax(Number.parseInt(e.target.value) || 100)}
          />
        </div>
        <div>
          <label htmlFor="gen-offset" className={labelClass}>
            {t("columns.offset.label")}
          </label>
          <input
            id="gen-offset"
            className={inputClass}
            type="number"
            value={offset}
            onChange={(e) => setOffset(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="gen-multiplier" className={labelClass}>
            {t("columns.multiplier.label")}
          </label>
          <input
            id="gen-multiplier"
            className={inputClass}
            type="number"
            step={0.5}
            value={multiplier}
            onChange={(e) =>
              setMultiplier(Number.parseFloat(e.target.value) || 1)
            }
          />
        </div>
      </div>
      <div className="mt-6">
        <button type="button" className="btn btn-primary" onClick={generate}>
          {t("actions.generate.label")}
        </button>
      </div>
    </div>
  );
}

export default GenerateRandomData;
