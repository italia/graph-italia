import { useParams } from "react-router-dom";
import { RenderChart } from "dataviz-components";
import * as api from "../../lib/api";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import useSWR from "swr";

function ShowChartPage() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(`${id}`, api.showChart);
  return (
    <Layout>
      <div className=''>
        {isLoading && <Loading />}
        {error && (
          <div role='alert' className='alert alert-error'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{error.message}</span>
          </div>
        )}
        {data && <RenderChart {...(data as any)} />}
      </div>
    </Layout>
  );
}

export default ShowChartPage;
