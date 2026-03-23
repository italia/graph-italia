import { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { type FieldDataType } from 'dataviz-components';

import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from '../../lib/utils';
import Layout from '../../components/layout';
import Loading from '../../components/layout/Loading';
import ChartTable from '../../components/ChartTable';

import useStoreState from '../../lib/storeState';
import useChartsStoreState from '../../lib/chartListStore';
import stepMachine from '../../lib/stepMachine';
import * as api from '../../lib/api';

function Home() {
  const [state, send] = useMachine(stepMachine);
  const {
    config,
    chart,
    data,
    id,
    name,
    description,
    publish,
    isRemote,
    remoteUrl,
    preview,
    dataSource,

    setPreview,
    setConfig,
    setChart,
    setData,
    setRemoteUrl,
    setIsRemote,

    loadItem,
    resetItem,
  } = useStoreState((state) => state);

  const { list, setList } = useChartsStoreState((state) => state);

  const [loading, setLoading] = useState(true);
  async function fetchCharts() {
    setLoading(true);
    try {
      const data = await api.getCharts();
      setList(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharts();
  }, []);

  function reset() {
    setData(null);
  }
  function transpose() {
    setData(null);
    const transposed = transposeData(data);
    // setChart("");
    setTimeout(() => {
      handleChangeData(transposed);
    }, 300);
  }

  function handleChangeData(d: any) {
    if (!config.palette) {
      const numSeries = d.length - 1;
      let palette = getAvailablePalettes(numSeries)[0];
      config.palette = palette;
      config.colors = getPalette(palette);
      setConfig(config);
    }
    // setChart("");
    setData(d);
    send({ type: 'CONFIG' });
  }
  const haveData =
    data && data[0].length > 0 ? true : dataSource ? true : false;

  function handleUpload(d: any) {
    setData(d);
    send({ type: 'NEXT' });
  }
  function handleSetRemoteData(d: any) {
    console.log('handleSetRemoteData', d);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setData(d.data);
    setTimeout(() => {
      send({ type: 'CONFIG' });
    }, 100);
  }

  function handleLoadChart(item: FieldDataType) {
    send({ type: 'CONFIG' });
    loadItem(item);
  }

  function handleDeleteChart(id?: string) {
    if (!id) return;
    console.log('delete chart?', id);

    const sure = confirm('Are you sure you want to delete this chart?');
    if (!sure) return;

    return api
      .deleteChart(id)
      .then(() => fetchCharts())
      .then(() => send({ type: 'IDLE' }));
  }
  function handleSaveChart() {
    fetchCharts().then(() => send({ type: 'IDLE' }));
    setTimeout(() => {
      resetItem();
    }, 100);
  }

  return (
    <Layout>
      <div className='p-4'>
        <div className='container'>
          {loading ? (
            <Loading />
          ) : (
            <>
              <h4 className='text-4xl font-bold'>
                {list && list.length ? 'My Charts' : 'Welcome'}
              </h4>
              {/* {!data && (!list || list?.length === 0) && <QuickstartInfo />} */}
              <div>
                <div className='flex my-5 gap-4'>
                  <a className='btn btn-primary' href='/create-chart'>
                    + Create New
                  </a>
                </div>
                <ChartTable
                  list={list as FieldDataType[]}
                  handleLoadChart={handleLoadChart}
                  handleDeleteChart={handleDeleteChart}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
