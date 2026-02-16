import { useState, useEffect } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useMachine } from "@xstate/react";
import { RenderChart, DataTable, type FieldDataType } from "dataviz-components";

import { getAvailablePalettes, getPalette, transposeData } from "../lib/utils";
import Layout from "../components/layout";
// import RenderChart from "../components/RenderChart";
import SelectChart from "../components/SelectChart";
import ChartOptions from "../components/ChartOptions";
import ChartSave from "../components/ChartSave";
import Loading from "../components/layout/Loading";
import QuickstartInfo from "../components/layout/QuickstartInfo";
import ChartList from "../components/ChartList";
import Steps from "../components/layout/Steps";

import useStoreState from "../lib/storeState";
import useChartsStoreState from "../lib/chartListStore";
import stepMachine from "../lib/stepMachine";
import { dataToCSV, downloadCSV } from "../lib/downloadUtils";
import * as auth from "../lib/auth";
import * as api from "../lib/api";
import ChooseLoader from "../components/load-data/ChooseLoader";

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
		send({ type: "CONFIG" });
	}
	const haveData =
		data && data[0].length > 0 ? true : dataSource ? true : false;

	function handleUpload(d: any) {
		setData(d);
		send({ type: "NEXT" });
	}
	function handleSetRemoteData(d: any) {
		console.log("handleSetRemoteData", d);
		setIsRemote(true);
		setRemoteUrl(d.remoteUrl);
		setData(d.data);
		setTimeout(() => {
			send({ type: "CONFIG" });
		}, 100);
	}

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
	function handleSaveChart() {
		fetchCharts().then(() => send({ type: "IDLE" }));
		setTimeout(() => {
			resetItem();
		}, 100);
	}

	function getStepIndex() {
		if (state.matches("idle")) return 0;
		if (state.matches("input")) return 1;
		if (state.matches("config")) return 2;
		if (state.matches("done")) return 3;
		return 0;
	}

	return (
		<Layout>
			<PanelGroup orientation="horizontal" className="w-full">
				<Panel defaultSize={10} minSize={10} className="bg-base-100">
					<Steps
						hasData={data ? true : false}
						listLen={list.length ?? 0}
						stepIndex={getStepIndex()}
						send={send}
					/>
				</Panel>
				<PanelResizeHandle className="bg-primary w-1" />
				<Panel defaultSize={30} minSize={30} className="bg-base-100">
					<div className="p-4">
						{state.matches("idle") && (
							<div className="container">
								{loading ? (
									<Loading />
								) : (
									<>
										<h4 className="text-4xl font-bold">
											{list && list.length ? "My Charts" : "Welcome"}
										</h4>

										{!data && (!list || list?.length === 0) && (
											<QuickstartInfo />
										)}
										<div>
											<div className="flex my-5 gap-4">
												{!data && (
													<div
														className="btn btn-primary"
														onClick={() => send({ type: "INPUT" })}
													>
														+ Create New chart
													</div>
												)}
												{data && (
													<div
														className="btn btn-primary"
														onClick={() => send({ type: "CONFIG" })}
													>
														Congfigure chart
													</div>
												)}
												{data && (
													<div
														className="btn btn-outline btn-primary"
														onClick={() => {
															send({ type: "IDLE" });
															resetItem();
														}}
													>
														Reset data
													</div>
												)}
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
						)}

						{state.matches("input") && (
							<div className="container">
								<h4 className="text-4xl font-bold">Upload your data</h4>
								<ChooseLoader
									handleUpload={handleUpload}
									remoteUrl={remoteUrl}
									handleSetRemoteData={handleSetRemoteData}
								/>
							</div>
						)}

						{state.matches("config") && (
							<div className="container">
								<h4 className="text-4xl font-bold">Configure Chart</h4>
								<SelectChart setChart={setChart} chart={chart} />
								<ChartOptions
									config={config}
									setConfig={setConfig}
									chart={chart}
									numSeries={(data as any)?.length - 1 || 0}
								/>
							</div>
						)}
						{state.matches("done") && (
							<div className="container">
								<h4 className="text-4xl font-bold">Save Chart</h4>
								Give a name to your chart and save it
								<ChartSave
									item={{
										id,
										chart,
										name,
										description,
										publish,
										config,
										data,
										remoteUrl,
										isRemote,
										preview,
									}}
									handleSave={() => handleSaveChart()}
								/>
							</div>
						)}
					</div>
				</Panel>
				<PanelResizeHandle className="bg-primary w-1" />
				<Panel defaultSize={60} minSize={40}>
					{haveData && (
						<>
							<div className="p-4">
								<DataTable
									data={data as any}
									// transpose={transpose}
									// download={() => {
									//   downloadCSV(dataToCSV(data), 'selected-data-' + Date.now());
									// }}
								/>
								{chart && (
									<>
										<RenderChart
											chart={chart}
											data={data}
											config={config}
											dataSource={null}
											getPicture={(pic: string) => setPreview(pic)}
										/>
										{config && chart && (
											<div className="w-full flex justify-end">
												<button
													className="my-5 btn btn-primary"
													onClick={() => send({ type: "DONE" })}
												>
													SAVE / EXPORT
												</button>
											</div>
										)}
									</>
								)}
							</div>
						</>
					)}
				</Panel>
			</PanelGroup>
		</Layout>
	);
}

export default Home;
