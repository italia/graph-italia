import { useState } from "react";
import { generateItems, fillArray, transposeData } from "../lib/utils";

function GenerateRandomData({ setData }: { setData: (data: any) => void }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(9);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  function generate() {
    const rowLabels = generateItems("SERIE", rows);
    const colLabels = ["_", ...generateItems("T", cols)];

    let matrix = [];
    matrix[0] = colLabels;
    for (let i = 1; i <= rows; i++) {
      matrix[i] = [
        rowLabels[i - 1],
        ...fillArray(cols, min, max).map((v) => (v + offset) * multiplier),
      ];
    }
    setData(matrix);
  }

  return (
    <div className='mt-5'>
      <div className='rounded-md grid grid-cols-2 lg:grid-cols-3 gap-1 bg-base-200 p-4'>
        <div>
          <label className='label'>ROWS:</label>
          <input
            className='input'
            type='number'
            placeholder='rows'
            value={rows}
            onChange={(e) => setRows(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className='label'>COLS</label>
          <input
            className='input'
            type='number'
            placeholder='Cols'
            value={cols}
            onChange={(e) => setCols(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className='label'> Range Min:</label>
          <input
            className='input'
            type='number'
            placeholder='min'
            value={min}
            onChange={(e) => setMin(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className='label'>Range Max:</label>
          <input
            className='input'
            type='number'
            placeholder='Max'
            value={max}
            onChange={(e) => setMax(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className='label'>Offset</label>
          <input
            className='input'
            type='number'
            placeholder='offset'
            value={offset}
            onChange={(e) => setOffset(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className='label'>Multiplier</label>
          <input
            className='input'
            type='number'
            step={0.5}
            placeholder='multiplier'
            value={multiplier}
            onChange={(e) => setMultiplier(Number.parseFloat(e.target.value))}
          />
        </div>
      </div>

      <button className='my-5 btn btn-primary' onClick={() => generate()}>
        GENERATE
      </button>
    </div>
  );
}

export default GenerateRandomData;
