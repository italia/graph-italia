import { useState } from "react";
import { validateStructure } from "../../lib/validate";
import type { MatrixType } from "../../types";


function UploadJSON({
  setData,
}: {
  setData: (d: MatrixType) => void;
}) {

  const [error, setError] = useState<string | null>(null);

  let fileReader: FileReader | undefined;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(null);
    setError(null);
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
      const text = e.target?.result;
      if (!text) {
        setError("The file is empty");
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
        setData(data);
      }
    };
  }
  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="uploadFile" className="label">
          <span className="label-text font-medium">Upload JSON file</span>
        </label>
        <input
          id="uploadFile"
          className="file-input file-input-bordered file-input-primary w-full"
          type="file"
          name="file"
          accept=".json"
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

    </div>
  );
}

export default UploadJSON;
