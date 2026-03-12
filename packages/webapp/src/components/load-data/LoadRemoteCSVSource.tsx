import Papa from "papaparse";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { log } from "../../lib/utils";

// const PLACEHOLDER_URL =
//   "https://www.datocms-assets.com/38008/1722249098-generated-data-3x51722249031636.csv";

function LoadSource({
  setData,
  currentValue,
}: {
  setData: Function;
  currentValue: string | null;
}) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "components.loadData.loadRemoteCsvData",
  });
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(currentValue || "");
  const [error, setError] = useState<string | null>(null);

  async function getData() {
    if (!url.trim()) {
      setError(t("errors.invalidUrl"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const testUrl = new URL(url);
      if (testUrl) {
        const response = await fetch(url);
        console.log("fetch response", response);
        const data = await response.text();
        console.log("response data", data);
        Papa.parse(data, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const { data } = results;
            console.log("setData ", data);
            setData({ remoteUrl: url, data: data });
          },
        });
      }
    } catch (error) {
      log(error);
      setError(t("errors.loadingError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="csv-source-url" className="label">
          <span className="label-text font-medium">{t("header.label")}</span>
        </label>
        <input
          id="csv-source-url"
          placeholder="https://example.com/data.csv"
          className="input w-full"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getData();
            }
          }}
        />
        <div role="alert" aria-atomic="true">
          {error && (
            <label className="label">
              <span className="label-text-alt text-error">{error}</span>
            </label>
          )}
        </div>
      </div>

      <button
        className="btn btn-primary w-full gap-2"
        onClick={() => getData()}
        disabled={loading || !url.trim()}
      >
        {loading ? (
          <span role="status">
            <span className="loading loading-spinner loading-sm"></span>
            {t("actions.load.loading")}
          </span>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {t("actions.load.default")}
          </>
        )}
      </button>
    </div>
  );
}

export default LoadSource;
