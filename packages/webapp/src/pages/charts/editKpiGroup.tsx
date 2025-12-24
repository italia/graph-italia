import { type FieldDataType } from "dataviz-components";
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import * as api from "../../lib/api";
import useChartsStoreState from "../../lib/chartListStore";
import useStoreState from "../../lib/storeState";

function Home() {
  const { id: paramId } = useParams();
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

  function handleChangeData(d: any) {
    setData(d);
  }
  const haveData =
    data && data[0].length > 0 ? true : dataSource ? true : false;

  function handleLoadChart(item: FieldDataType) {
    loadItem(item);
  }

  function handleDeleteChart(id?: string) {
    if (!id) return;
    console.log("delete chart?", id);

    const sure = confirm("Are you sure you want to delete this item?");
    if (!sure) return;

    return api.deleteChart(id).then(() => fetchCharts());
  }

  const item = paramId ? list.find((item) => item.id === paramId) : null;

  return (
    <Layout>
      <div className="p-4">
        <div className="container">
          <Link to="/home" className="link-primary">
            Back
          </Link>
          <h1>EDIT KPI GROUP: ID = {paramId}</h1>
          {item && <pre>{item.name}</pre>}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
