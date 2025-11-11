import { useState } from "react";
import CSVUpload from "./CSVUpload";
import JsonUpload from "./JsonUpload";
import LoadRemoteJsonSource from "./LoadRemoteJsonSource";

type ChooseLoaderProps = {
  handleUpload: (d: any) => void;
  handleSetRemoteData: (d: any) => void;
  remoteUrl: string | null;
};

export default function ChooseLoader({
  handleUpload,
  handleSetRemoteData,
  remoteUrl,
}: ChooseLoaderProps) {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <div className='my-5'>
      <div role='tablist' className='tabs tabs-bordered tabs-lift tabs-xl'>
        <a
          role='tab'
          className={`tab ${currentTab === 0 ? "tab-active" : ""}`}
          onClick={() => setCurrentTab(0)}
        >
          CSV Upload
        </a>
        <div className='tab-content'>
          <CSVUpload setData={(d: any) => handleUpload(d)} />
        </div>
        <a
          role='tab'
          className={`tab ${currentTab === 1 ? "tab-active" : ""}`}
          onClick={() => setCurrentTab(1)}
        >
          Json Upload
        </a>
        <div className='tab-content'>
          <JsonUpload setData={(d: any) => handleUpload(d)} />
        </div>
        <a
          role='tab'
          className={`tab ${currentTab === 2 ? "tab-active" : ""}`}
          onClick={() => setCurrentTab(2)}
        >
          Remote Json
        </a>
        <div className='tab-content'>
          <LoadRemoteJsonSource
            currentValue={remoteUrl}
            setData={(d: any) => handleSetRemoteData(d)}
          />
        </div>
      </div>
    </div>
  );
}
