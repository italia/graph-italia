import Papa from "papaparse";
import { useState } from "react";
import type { MatrixType } from "../../types";
import SeriesSelector from "./SeriesSelector";

function UploadCSV({
  setData,
  initialData,
}: {
  setData: () => void;
  initialData?: any;
}) {
  const [uploadData, setUploadData] = useState<MatrixType>();
  const [error, setError] = useState<string | null>(null);


  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadData(null);
    setError(null);
    const file = e?.target?.files[0] || null;
    if (!file) {
      setError("The file is empty");
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
          setUploadData(data);
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
        <label htmlFor="uploadFile" className="label">
          <span className="label-text font-medium">Upload CSV file</span>
        </label>
        <input
          id="uploadFile"
          className="file-input file-input-bordered file-input-primary w-full"
          type="file"
          name="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      {error && (
        <div className="alert alert-error py-2">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {(uploadData || initialData) && (
        <div className="bg-primary">
          <SeriesSelector initialData={initialData} uploadData={uploadData} setData={setData} />
        </div>)}
    </div>
  );
}

export default UploadCSV;
