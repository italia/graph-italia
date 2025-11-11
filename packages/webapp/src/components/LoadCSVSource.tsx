import { useState } from "react";
import axios from "axios";
import { log } from "../lib/utils";
import Papa from "papaparse";

const PLACEHOLDER_URL =
  "https://www.datocms-assets.com/38008/1722249098-generated-data-3x51722249031636.csv";

function LoadSource({ setRawData }: { setRawData: Function }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(PLACEHOLDER_URL);

  async function getData() {
    setLoading(true);
    try {
      let testUrl = new URL(url);
      if (testUrl) {
        axios.defaults.timeout = 5000;
        const response = await axios.get(url);
        console.log("response.data", response.data);
        Papa.parse(response.data, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const { data } = results;
            console.log("setRawData ", data);
            setRawData(data);
          },
        });
      }
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      {loading && <p>Loading...</p>}
      <div className='bg-base-200 p-4 my-5'>
        <label className='label'>Url</label>
        <input
          className='input w-full'
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button className='btn btn-primary' onClick={() => getData()}>
        fetch data
      </button>
    </div>
  );
}

export default LoadSource;
