import { useParams } from "react-router-dom";
// import RenderChart from "../../components/RenderChart";
import { RenderChart } from "dataviz-components";

import * as api from "../../lib/api";
import useSWR from "swr";
import Loading from "../../components/layout/Loading";

function EmbedChartPage() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(`${id}`, api.showChart);

  return (
    <div className=''>
      {isLoading && <Loading />}
      {error && <div className='text-error'>{error}</div>}
      {data && <RenderChart {...(data as any)} />}
    </div>
  );
}

export default EmbedChartPage;
