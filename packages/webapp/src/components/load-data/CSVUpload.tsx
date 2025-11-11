import { useState, useTransition } from "react";
import Papa from "papaparse";
import DataTable from "../DataTable";
import { getSuggestions } from "../../lib/api";
import { log, transposeData, moveDataColumn } from "../../lib/utils";
import { AISuggestion, MatrixType } from "../../types";
import ChartsSuggestions from "../ChartSuggestions";

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

function UploadCSV({ setData }: { setData: Function }) {
  const [_, startTransition] = useTransition();
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[] | []>([]);

  function uploadFile(event: any) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const { data } = results;
        log("RESULTS DATA", data);
        const c = getFirstOfMAtrix(data);
        const category = { value: c, label: c };
        log("CATEGORY", category);
        const cols = getCols(data[0]);
        log("COLS", cols);
        const series = cols.filter((i) => !isSameObject(i, category));
        log("SERIES", series);

        startTransition(() => {
          setRawData(data);
          setCategory(category);
          setSeries(series);
        });
      },
    });
  }

  function isSameObject(a: object, b: object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function getFirstOfMAtrix(matrix: any) {
    return matrix[0][0]?.trim();
  }
  function getCols(cols: string[]) {
    return cols.map((c: string) => {
      const col = c.trim();
      return { value: col, label: col };
    });
  }

  function transpose() {
    const transposed = transposeData(rawData);
    setRawData(transposed);
    const c = getFirstOfMAtrix(transposed);
    const category = { value: c, label: c };
    setCategory(category);
    setSeries(getCols(transposed[0]).filter((i) => !isSameObject(i, category)));
  }

  function filterData() {
    if (!series) return;
    const cols = [category, ...series].map((col: any) => col.value);
    const filtered = rawData.map((row: any) => {
      return row.filter((r: any, i: number) => {
        return cols.includes(rawData[0][i].trim());
      });
    });
    return filtered;
  }

  function handleChangeCategory(newValue: string) {
    setSeries([]);
    const category: any = getCols(rawData[0]).find((i) => i.value === newValue);
    setCategory(category);
    setRawData(moveDataColumn(rawData, newValue));
  }

  function handleChangeSerie(options: string[]) {
    const series = getCols(rawData[0]).filter((i: any) =>
      options.map((o) => o).includes(i.value)
    );
    setSeries(series);
  }

  return (
    <div className='bg-base-200 p-4 my-5'>
      <div className='form-control'>
        <label className='label'>Load CSV:</label>
        <input
          className='file-input file-input-bordered file-input-primary  w-full max-w-2xl'
          type='file'
          name='file'
          accept='.csv'
          onChange={(e) => uploadFile(e)}
        />
      </div>
      {rawData && (
        <>
          <div className=''>
            <ChartsSuggestions data={rawData} />
          </div>
          <div className=''>
            <h3 className='h3'>Data:</h3>
            <DataTable
              data={rawData}
              transpose={() => transpose()}
              reset={() => setRawData(null)}
              download={() => {}}
            />
          </div>
          <div className='bg-base-200 p-5'>
            <div>
              <label className='label'>Seleziona la colonna categoria:</label>
              <select
                className='select select-primary max-w-lg'
                name='category'
                id='category'
                // label="category"
                // hint="Selezione la colonna categoria"
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
              <div>
                <label className='label'>Seleziona una o più serie:</label>
                <select
                  className='select select-primary max-w-lg'
                  name='series'
                  id='series'
                  // label="series"
                  // hint="Seleziona una o più serie"
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
            <div className='my-4'>
              {series && category?.value && series.length > 0 && (
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setData(cleanupData(filterData()));
                  }}
                >
                  Salva Dati
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadCSV;
