import { ChartWrapper, type FieldDataType } from "dataviz-components";

const barWrapperData: FieldDataType = {
  dataSource: null,
  id: "wrapper-bar-example",
  updatedAt: "2025-04-04T15:03:00Z",
  name: "Esempio Bar Chart (Wrapper)",
  description: "",
  chart: "bar",
  config: {
    background: "#fbfbfb",
    h: 400,
    zoom: "none",
    stack: false,
    colors: [
      "#003366",
      "#004D99",
      "#0066CC",
      "#207AD5",
      "#4392E0",
      "#D48D22",
      "#CC7A00",
      "#B36B00",
      "#995C00",
      "#804D00",
    ],
    legend: true,
    smooth: "0.3",
    xLabel: "",
    yLabel: "",
    gridTop: "60",
    nameGap: "40",
    palette: ["divergente_b"],
    tooltip: true,
    gridLeft: "10%",
    labeLine: false,
    showArea: false,
    direction: "vertical",
    gridRight: "10%",
    gridWidth: "auto",
    gridBottom: "60",
    gridHeight: "auto",
    responsive: true,
    totalLabel: "Totale",
    showAllSymbol: true,
    legendPosition: "top",
    tooltipTrigger: "axis",
    valueFormatter: "",
    tooltipFormatter: "number",
  },
  data: [
    ["Categoria", "Valore A", "Valore B"],
    ["A", 120, 90],
    ["B", 200, 160],
    ["C", 150, 130],
    ["D", 80, 60],
  ],
  publish: true,
  remoteUrl: "",
  isRemote: false,
};

const barWrapperInfo = {
  title: "Bar Chart con ChartWrapper",
  subTitle: "Esempio di utilizzo del wrapper",
  text: "Descrizione di esempio per il bar chart.",
  updatedAt: "2025-04-04T15:03:00Z",
  labelUpdated: "Dati aggiornati al",
  labelShare: "Condividi",
  labelSource: "Fonte Dati",
  sourceTextInfo: "*Fonte dati di esempio*",
  labelDownloadData: "Download Data",
  labelDownloadImage: "Download Immagine",
  chartFooterText:
    "Questo è il *footer* del **Bar Chart** di esempio mostrato tramite `ChartWrapper`.",
};

export default function SampleWrapperBar() {
  return (
    <ChartWrapper
      id={barWrapperData.id}
      data={barWrapperData}
      info={barWrapperInfo}
      enableDownloadData={true}
      enableDownloadImage={true}
      shareFunction={() => console.log("Share Bar Wrapper")}
    />
  );
}
