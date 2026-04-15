import { ChartWrapper, type FieldDataType } from "graph-italia-components";

const lineWrapperData: FieldDataType = {
  dataSource: null,
  id: "wrapper-line-example",
  updatedAt: "2025-05-01T10:00:00Z",
  name: "Esempio Line Chart (Wrapper)",
  description: "",
  chart: "line",
  config: {
    background: "#ffffff",
    h: 350,
    zoom: "none",
    stack: false,
    colors: ["#0066CC"],
    legend: true,
    smooth: "0.3",
    xLabel: "",
    yLabel: "",
    gridTop: "60",
    nameGap: "40",
    palette: ["_1_a"],
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
    ["Giorno", "Visite"],
    ["2025-04-01", 1200],
    ["2025-04-02", 1500],
    ["2025-04-03", 1100],
    ["2025-04-04", 1800],
    ["2025-04-05", 900],
    ["2025-04-06", 1300],
  ],
  publish: true,
  remoteUrl: "",
  isRemote: false,
};

const lineWrapperInfo = {
  title: "Line Chart con ChartWrapper",
  subTitle: "Andamento visite giornaliere",
  text: "Grafico di esempio che mostra un andamento nel tempo.",
  updatedAt: "2025-05-01T10:00:00Z",
  labelUpdated: "Dati aggiornati al",
  labelShare: "Condividi",
  labelSource: "Fonte Dati",
  sourceTextInfo: "*Dati fittizi generati per la demo*",
  labelDownloadData: "Download Dati",
  labelDownloadImage: "Download Immagine",
  chartFooterText:
    "Questo è il *footer* del **Line Chart** di esempio con dati giornalieri.",
};

export default function SampleWrapperLine() {
  return (
    <ChartWrapper
      id={lineWrapperData.id}
      data={lineWrapperData}
      info={lineWrapperInfo}
      enableDownloadData={true}
      enableDownloadImage={true}
      shareFunction={() => console.log("Share Line Wrapper")}
    />
  );
}
