type DataTableProps = {
  data: any;
  reset?: () => void;
  transpose: () => void;
  download?: () => void;
  downloadJSON?: () => void;
  buttonVariant?: "default" | "italia";
};

const btnClass = (variant: "default" | "italia") =>
  variant === "italia" ? "btn-italia btn-italia-secondary-outline" : "btn";

export default function DataTable({
  data,
  reset,
  transpose,
  download,
  downloadJSON,
  buttonVariant = "default",
}: DataTableProps) {
  const max = 100;
  const b = btnClass(buttonVariant);

  function isBig(rows: number, cols: number) {
    return rows > 10 || cols > 10;
  }
  return (
    <>
      {data && data[0] && (
        <div>
          <p className="text-sm text-gray-600">
            {data.length} rows, {data[0].length} columns
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {transpose && (
              <button type="button" className={b} onClick={() => transpose()}>
                Transpose
              </button>
            )}
            {reset && (
              <button type="button" className={b} onClick={() => reset()}>
                Reset
              </button>
            )}
            {download && (
              <button type="button" className={b} onClick={() => download()}>
                Download CSV
              </button>
            )}
            {downloadJSON && (
              <button
                type="button"
                className={b}
                onClick={() => downloadJSON()}
              >
                Download JSON
              </button>
            )}
          </div>
          <div
            className="mt-4 overflow-auto rounded-lg border border-gray-200"
            style={{ maxWidth: "100%", maxHeight: "360px" }}
          >
            <table
              className={`table w-full border-collapse ${
                isBig(data.length, data[0].length) ? "table-xs text-sm" : ""
              }`}
            >
              <thead>
                <tr key={`row-head`}>
                  {data[0].map((cell: string | number, ii: number) => (
                    <th className={`px-2 `} key={`head-cell-${ii}`}>
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.slice(1, max).map((row: number, index: number) => {
                  return (
                    <tr key={`row-${index}`}>
                      {(row as any)?.map(
                        (cell: string | number, ii: number) => (
                          <td
                            key={`cell-${ii}`}
                            className={`px-2 ${ii === 0 ? "font-bold" : ""}`}
                          >
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
