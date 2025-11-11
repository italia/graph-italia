import { useState, useTransition } from "react";
import DataTable from "../DataTable";

import { log, transposeData, moveDataColumn } from "../../lib/utils";
import { MatrixType } from "../../types";
import { validateStructure } from "../../lib/validate";

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

function UploadJSON({ setData }: { setData: Function }) {
  const [_, startTransition] = useTransition();
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[] | []>([]);
  const [error, setError] = useState<string | null>(null);

  let fileReader: FileReader | undefined;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      setSeries([]);
      setCategory(null);
      setRawData(null);
      setError(null);
    });
    if (fileReader) {
      fileReader.abort();
    }
    uploadFile(e);
  }

  function uploadFile(event: any) {
    let file = event.target?.files[0];
    fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = (e) => {
      // log("RESULTS DATA", text);
      const text = e.target?.result;
      if (!text) {
        setError("File is empty");
        return;
      }
      let data: undefined | MatrixType;
      try {
        data = validateStructure(JSON.parse(text as string));
      } catch (error) {
        setError((error as Error).message);
        return;
      }
      if (data) {
        // const data = JSON.parse(text as string);
        log("RESULTS DATA", data);
        const c = getFirstOfMAtrix(data);
        const category = { value: c, label: c };
        log("CATEGORY", category);
        const cols = getCols(data[0] as [string]);
        log("COLS", cols);
        const series = cols.filter((i) => !isSameObject(i, category));
        log("SERIES", series);

        startTransition(() => {
          setRawData(data);
          setCategory(category);
          setSeries(series);
        });
      }
    };
  }

  function isSameObject(a: object, b: object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function getFirstOfMAtrix(matrix: any) {
    return matrix[0][0]?.trim();
  }
  function getCols(cols: [string]) {
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
        <label className='label'>Load JSON:</label>
        <input
          className='file-input file-input-bordered file-input-primary  w-full max-w-2xl'
          type='file'
          name='file'
          accept='.json'
          onChange={(e) => handleFileChange(e)}
        />
      </div>
      {error && <div className='error'>{error}</div>}
      {rawData && (
        <div className=''>
          <div className=''>
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
        </div>
      )}
    </div>
  );
}

export default UploadJSON;
