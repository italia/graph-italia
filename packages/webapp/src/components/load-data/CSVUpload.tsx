import Papa from "papaparse";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MatrixType } from "../../types";

function UploadCSV({
  setData,
}: {
  setData: (d: MatrixType) => void;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.loadData.csvUpload",
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);


  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(undefined);
    setError(null);
    setStatus(null);
    const file = e?.target?.files?.[0] || null;
    if (!file) {
      setError(t("errors.emptyFile"));
      return;
    }
    uploadFile(e);
  }

  function uploadFile(event: any) {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const { data } = results;
        if (data) {
          setData(data);
          setStatus(
            `File "${file.name}" caricato: ${data.length} righe, ${data[0]?.length ?? 0} colonne.`,
          );
        }
      },
      error: (err) => {
        setError(err.message);
      }
    });
  }


  return (
    <div className="space-y-4">
      <div className="form-control">
        {/* Visible description lives in ChooseLoader; keep the association for AT */}
        <label htmlFor="uploadFile" className="sr-only">
          {t("label")}
        </label>
        <input
          id="uploadFile"
          className="file-input file-input-bordered file-input-primary w-full text-base file:font-normal"
          type="file"
          name="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      <div role="alert" aria-atomic="true">
        {error && (
          <div className="alert alert-error py-2">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Status message announced to assistive tech without requiring focus */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>


    </div>
  );
}

export default UploadCSV;
