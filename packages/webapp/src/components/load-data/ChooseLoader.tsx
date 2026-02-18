import { useState } from "react";
import CSVUpload from "./CSVUpload";
import JsonUpload from "./JsonUpload";
import LoadRemoteJsonSource from "./LoadRemoteJsonSource";
import LoadRemoteCSVSource from "./LoadRemoteCSVSource";

type ChooseLoaderProps = {
  handleUpload: (d: any) => void;
  handleSetRemoteData: (d: any) => void;
  remoteUrl: string | null;
  initialData?: any;
};

// Tab definitions with icons and descriptions
const TABS = [
  {
    id: 0,
    label: "CSV File",
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
    description: "Upload a CSV file from your computer",
  },
  {
    id: 1,
    label: "JSON File",
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
    description: "Upload a JSON file from your computer",
  },
  {
    id: 2,
    label: "Remote URL",
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
    description: "Load data from a remote JSON URL",
  },
];

export default function ChooseLoader({
  handleUpload,
  handleSetRemoteData,
  remoteUrl,
  initialData,
}: ChooseLoaderProps) {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            role="tab"
            className={`tab gap-2 transition-all ${currentTab === tab.id
              ? "tab-active bg-base-100 shadow-sm"
              : "hover:bg-base-100/50"
              }`}
            onClick={() => setCurrentTab(tab.id)}
            aria-selected={currentTab === tab.id}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <p className="text-sm text-base-content/60 px-1">
        {TABS[currentTab].description}
      </p>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-lg">
        {currentTab === 0 && (
          <CSVUpload
            setData={(d: any) => handleUpload(d)}
            initialData={initialData}
          />
        )}
        {currentTab === 1 && (
          <JsonUpload
            setData={(d: any) => handleUpload(d)}
            initialData={initialData}
          />
        )}
        {currentTab === 2 && (
          <>


            {/* <b>TODO: ADD RADIO BUTTONS TO CHOOSE JSON OR CSV</b> */}

            <LoadRemoteJsonSource
              currentValue={remoteUrl}
              setData={(d: any) => handleSetRemoteData(d)}
            />
            <LoadRemoteCSVSource
              currentValue={remoteUrl}
              setData={(d: any) => handleSetRemoteData(d)}
            />
          </>
        )}
      </div>
    </div>
  );
}
