import { ChartWrapper, type FieldDataType } from "graph-italia-components";

const pieWrapperData: FieldDataType = {
  dataSource: null,
  id: "wrapper-pie-example",
  updatedAt: "2025-06-01T09:00:00Z",
  name: "Esempio Pie Chart (Wrapper)",
  description: "",
  chart: "pie",
  config: {
    background: "#ffffff",
    h: 500,
    zoom: "none",
    stack: false,
    colors: [
      "hsla(210, 72%, 68%, 1)",
      "hsla(210, 76%, 64%, 1)",
      "hsla(210, 80%, 60%, 1)",
      "hsla(210, 84%, 56%, 1)",
      "hsla(210, 88%, 52%, 1)",
    ],
    legend: true,
    smooth: "0.3",
    xLabel: "",
    yLabel: "",
    gridTop: "60",
    nameGap: "40",
    palette: ["monocolore_a"],
    tooltip: true,
    gridLeft: "10%",
    labeLine: true,
    showArea: false,
    direction: "vertical",
    gridRight: "10%",
    gridWidth: "auto",
    gridBottom: "60",
    gridHeight: "auto",
    responsive: true,
    totalLabel: "Totale",
    showAllSymbol: true,
    legendPosition: "bottom",
    tooltipTrigger: "axis",
    valueFormatter: "",
    tooltipFormatter: "number",
  },
  data: [
    ["Categoria", "Valore"],
    ["Nord", 40],
    ["Centro", 25],
    ["Sud", 20],
    ["Isole", 15],
  ],
  publish: true,
  remoteUrl: "",
  isRemote: false,
};

const pieWrapperInfo = {
  title: "Pie Chart con ChartWrapper",
  subTitle: "Distribuzione per area geografica",
  text: "Esempio di grafico a torta che utilizza `ChartWrapper`.",
  updatedAt: "2025-06-01T09:00:00Z",
  labelUpdated: "Dati aggiornati al",
  labelShare: "Condividi",
  labelSource: "Fonte Dati",
  sourceTextInfo: "*Dataset di esempio per la suddivisione territoriale*",
  labelDownloadData: "Download Dati",
  labelDownloadImage: "Download Immagine",
  chartFooterText:
    "Questo è il *footer* del **Pie Chart** di esempio con suddivisione per area.",
};

export default function SampleWrapperPie() {
  return (
    <ChartWrapper
      id={pieWrapperData.id}
      data={pieWrapperData}
      info={pieWrapperInfo}
      enableDownloadData={true}
      enableDownloadImage={true}
      shareFunction={() => console.log("Share Pie Wrapper")}
    />
  );
}
