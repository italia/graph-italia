import { useState } from "react";
import axios from "axios";
import { log } from "../../lib/utils";

const PLACEHOLDER_URL = "";

function LoadSource({
  setData,
  currentValue,
}: {
  setData: Function;
  currentValue: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(currentValue || PLACEHOLDER_URL);

  async function getData() {
    setLoading(true);
    try {
      let testUrl = new URL(url);
      if (testUrl) {
        axios.defaults.timeout = 5000;
        const response = await axios.get(url);
        console.log("response.data", response.data);
        if (response.data) {
          setData({ remoteUrl: url, data: response.data });
        }
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
          placeholder='https://example.com/data.json'
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button className='btn btn-primary' onClick={() => getData()}>
        USE REMOTE DATA
      </button>
    </div>
  );
}

export default LoadSource;
