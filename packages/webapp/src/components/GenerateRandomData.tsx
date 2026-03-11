import { useState } from "react";
import { fillArray, generateItems } from "../lib/utils";

function GenerateRandomData({ setData }: { setData: (data: any) => void }) {
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

  const inputClass =
    "input input-bordered w-full rounded-md border-gray-300 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]";
  const labelClass = "label text-gray-700 font-medium";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="gen-rows" className={labelClass}>Rows</label>
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
          <label htmlFor="gen-cols" className={labelClass}>Columns</label>
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
          <label htmlFor="gen-min" className={labelClass}>Range min</label>
          <input
            id="gen-min"
            className={inputClass}
            type="number"
            value={min}
            onChange={(e) => setMin(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="gen-max" className={labelClass}>Range max</label>
          <input
            id="gen-max"
            className={inputClass}
            type="number"
            value={max}
            onChange={(e) => setMax(Number.parseInt(e.target.value) || 100)}
          />
        </div>
        <div>
          <label htmlFor="gen-offset" className={labelClass}>Offset</label>
          <input
            id="gen-offset"
            className={inputClass}
            type="number"
            value={offset}
            onChange={(e) => setOffset(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="gen-multiplier" className={labelClass}>Multiplier</label>
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
        <button
          type="button"
          className="btn-italia btn-italia-primary"
          onClick={generate}
        >
          Generate data
        </button>
      </div>
    </div>
  );
}

export default GenerateRandomData;
