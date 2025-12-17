import { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { type FieldDataType } from "dataviz-components";

import { getAvailablePalettes, getPalette } from "../lib/utils";
import Layout from "../components/layout";
// import RenderChart from "../components/RenderChart";
import Loading from "../components/layout/Loading";
import QuickstartInfo from "../components/layout/QuickstartInfo";
import ChartList from "../components/ChartList";

import useStoreState from "../lib/storeState";
import useChartsStoreState from "../lib/chartListStore";
import stepMachine from "../lib/stepMachine";
import * as api from "../lib/api";

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

	function handleLoadChart(item: FieldDataType) {
		send({ type: "CONFIG" });
		loadItem(item);
	}

	function handleDeleteChart(id?: string) {
		if (!id) return;
		console.log("delete chart?", id);

		const sure = confirm("Are you sure you want to delete this chart?");
		if (!sure) return;

		return api
			.deleteChart(id)
			.then(() => fetchCharts())
			.then(() => send({ type: "IDLE" }));
	}

	return (
		<Layout>
			<div className="p-4">
				<div className="container">
					{loading ? (
						<Loading />
					) : (
						<>
							<h4 className="text-4xl font-bold">
								{list && list.length ? "My Charts" : "Welcome"}
							</h4>

							{!data && (!list || list?.length === 0) && <QuickstartInfo />}
							<div>
								<div className="flex my-b gap-4">
									<details className="dropdown my-10 bg-base-100 z-10">
										<summary className="btn btn-primary m-1">
											{" "}
											+ Create New chart
										</summary>
										<ul className="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg border">
											<li>
												<a href="/edit/chart">Create Chart</a>
											</li>
											<li>
												<a href="/edit/kpi">Create KpiGroup</a>
											</li>
										</ul>
									</details>
								</div>
								<ChartList
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
