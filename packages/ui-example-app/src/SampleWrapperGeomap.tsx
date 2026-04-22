import { ChartWrapper, type FieldDataType } from "graph-italia-components";

const geoWrapperData: FieldDataType = {
  id: "wrapper-geo-example",
  name: "Esempio Geo Map (Wrapper)",
  description: "Esempio di mappa con dati percentuali per regione",
  chart: "map",
  updatedAt: "2025-02-10T11:27:00Z",
  config: {
    background: "#ffffff",
    h: 500,
    stack: false,
    colors: [
      "hsla(210, 72%, 68%, 1)",
      "hsla(210, 74%, 66%, 1)",
      "hsla(210, 76%, 64%, 1)",
      "hsla(210, 78%, 62%, 1)",
      "hsla(210, 80%, 60%, 1)",
      "hsla(210, 82%, 58%, 1)",
      "hsla(210, 84%, 56%, 1)",
      "hsla(210, 86%, 54%, 1)",
      "hsla(210, 88%, 52%, 1)",
      "hsla(210, 90%, 50%, 1)",
      "hsla(210, 92%, 48%, 1)",
      "hsla(210, 94%, 46%, 1)",
      "hsla(210, 96%, 44%, 1)",
      "hsla(210, 98%, 42%, 1)",
      "hsla(210, 100%, 40%, 1)",
      "hsla(210, 100%, 40%, 1)",
      "hsla(210, 100%, 40%, 1)",
      "hsla(210, 102%, 38%, 1)",
      "hsla(210, 104%, 36%, 1)",
      "hsla(210, 106%, 34%, 1)",
      "hsla(210, 108%, 32%, 1)",
      "hsla(210, 110%, 30%, 1)",
      "hsla(210, 112%, 28%, 1)",
      "hsla(210, 114%, 26%, 1)",
      "hsla(210, 116%, 24%, 1)",
      "hsla(210, 118%, 22%, 1)",
      "hsla(210, 120%, 20%, 1)",
      "hsla(210, 122%, 18%, 1)",
      "hsla(210, 124%, 16%, 1)",
      "hsla(210, 126%, 14%, 1)",
      "hsla(210, 128%, 12%, 1)",
    ],
    legend: true,
    xLabel: "",
    yLabel: "",
    gridTop: "60",
    nameGap: "40",
    palette: ["monocolore_a"],
    tooltip: true,
    gridLeft: "10%",
    labeLine: false,
    areaColor: "#fad900",
    direction: "vertical",
    gridRight: "10%",
    gridWidth: "auto",
    serieName: "Percentuale",
    visualMap: true,
    geoJsonUrl:
      "https://www.datocms-assets.com/138980/1736438332-limits_it_regions.geojson",
    gridBottom: "60",
    gridHeight: "auto",
    responsive: true,
    totalLabel: "Totale",
    nameProperty: "reg_name",
    showMapLabels: false,
    visualMapLeft: "right",
    legendPosition: "top",
    tooltipTrigger: "axis",
    valueFormatter: "",
    visualMapOrient: "vertical",
    tooltipFormatter: "number",
  },
  data: [
    ["Regione", " Percentuale"],
    ["Abruzzo", 30],
    ["Basilicata", 23],
    ["Calabria", 55],
    ["Campania", 22],
    ["Emilia-Romagna", 46],
    ["Friuli-Venezia Giulia", 34],
    ["Lazio", 33],
    ["Liguria", 43],
    ["Lombardia", 34],
    ["Marche", 53],
    ["Molise", 54],
    ["Puglia", 34],
    ["Piemonte", 77],
    ["Trentino-Alto Adige/Südtirol", 32],
    ["Sardegna", 56],
    ["Sicilia", 67],
    ["Toscana", 78],
    ["Umbria", 42],
    ["Valle d'Aosta/Vallée d'Aoste", 54],
    ["Veneto", 44],
  ],
  publish: true,
  isRemote: false,
  dataSource: null,
};

const geoWrapperInfo = {
  title: "Geo Map con ChartWrapper",
  subTitle: "Percentuali per regione italiana",
  text: "Esempio di mappa geografica che utilizza `ChartWrapper`.",
  updatedAt: "2025-02-10T11:27:00Z",
  labelUpdated: "Dati aggiornati al",
  labelShare: "Condividi",
  labelSource: "Fonte Dati",
  sourceTextInfo:
    "*Dataset dimostrativo basato su una suddivisione delle regioni italiane*",
  labelDownloadData: "Download Dati",
  labelDownloadImage: "Download Immagine",
  chartFooterText:
    "Questo è il *footer* della **Geo Map** di esempio con distribuzione percentuale regionale.",
};

export default function SampleWrapperGeomap() {
  return (
    <ChartWrapper
      id={geoWrapperData.id}
      data={geoWrapperData}
      info={geoWrapperInfo}
      enableDownloadData={true}
      enableDownloadImage={true}
      shareFunction={() => console.log("Share Geo Wrapper")}
    />
  );
}
