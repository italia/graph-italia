import { useState } from "react";
import { useTranslation } from "react-i18next";
import CSVUpload from "./CSVUpload";
import JsonUpload from "./JsonUpload";
import LoadRemoteCSVSource from "./LoadRemoteCSVSource";
import LoadRemoteJsonSource from "./LoadRemoteJsonSource";

type ChooseLoaderProps = {
  handleUpload: (d: any) => void;
  handleSetRemoteData: (d: any) => void;
  remoteUrl: string | null;
};

// Tab definitions with icons and descriptions
const TABS = [
  {
    id: 0,
    label: "tabs.csv.label",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    description: "tabs.csv.description",
  },
  {
    id: 1,
    label: "tabs.json.label",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    description: "tabs.json.description",
  },
  {
    id: 2,
    label: "tabs.remoteUrl.label",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    description: "tabs.remoteUrl.description",
  },
];

export default function ChooseLoader({
  handleUpload,
  handleSetRemoteData,
  remoteUrl,
}: ChooseLoaderProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.loadData.chooseLoader",
  });
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [remoteType, setRemoteType] = useState<string>("csv"); // "json" or "csv"

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            role="tab"
            className={`tab gap-2 transition-all text-base-content opacity-100 ${currentTab === tab.id
              ? "tab-active bg-base-100 shadow-sm font-semibold"
              : "font-medium hover:bg-base-100/50"
              }`}
            onClick={() => setCurrentTab(tab.id)}
            aria-selected={currentTab === tab.id}
          >
            {tab.icon}
            <span className="hidden sm:inline">{t(tab.label)}</span>
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <p className="text-sm text-base-content/60 px-1">
        {t(TABS[currentTab].description)}
      </p>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-lg">
        {currentTab === 0 && (
          <CSVUpload
            setData={(d) => handleUpload(d)}
          />
        )}
        {currentTab === 1 && (
          <JsonUpload
            setData={(d) => handleUpload(d)}
          />
        )}
        {currentTab === 2 && (
          <div className="p-4 space-y-4">
            <div>
              <label className="cursor-pointer label mr-4" htmlFor="csv_value">
                <input
                  id="csv_value"
                  type="radio"
                  name="remoteType"
                  className="radio"
                  value="csv"
                  checked={remoteType === "csv"}
                  onChange={() => setRemoteType("csv")}
                />
                <span className="label-text ml-2">CSV</span>
              </label>
              <label className="cursor-pointer label " htmlFor="json_value">
                <input
                  id="json_value"
                  type="radio"
                  name="remoteType"
                  className="radio"
                  value="json"
                  checked={remoteType === "json"}
                  onChange={() => setRemoteType("json")}
                />
                <span className="label-text ml-2">JSON</span>
              </label>
            </div>

            {remoteType === "json" ? (
              <LoadRemoteJsonSource
                currentValue={remoteUrl}
                setData={(d) => handleSetRemoteData(d)}
              />
            ) : (
              <LoadRemoteCSVSource
                currentValue={remoteUrl}
                setData={(d) => handleSetRemoteData(d)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
