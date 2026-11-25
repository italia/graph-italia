import {
  ChartWrapper,
  RenderDashboard,
  type ChartConfigType,
  type ChartWrapperSettings,
  type DashboardData,
  type FieldDataType,
} from "graph-italia-components";

// Defaults of the editor; each chart overrides what it needs.
const baseConfig: ChartConfigType = {
  colors: [],
  direction: "vertical",
  h: 380,
  labeLine: false,
  legend: true,
  legendPosition: "top",
  palette: "theme",
  tooltip: true,
  tooltipFormatter: "number",
  valueFormatter: "",
  totalLabel: "Totale",
  tooltipTrigger: "axis",
};

// Settings saved with a chart in the Graph Italia editor ("wrapper" on the
// server). The graph-italia-cli client returns the same shape on
// GET /api/charts/{id}, so a chart read with it can be passed as is.
const savedWrapper: ChartWrapperSettings = {
  enabled: true,
  title: "Iscritti per regione",
  subTitle: "Titolo, sottotitolo, testi e pulsanti arrivano dalle impostazioni salvate",
  text: "Il testo della scheda **Info** è salvato con il grafico.",
  sourceTextInfo: "[Dati di esempio](https://github.com/italia/graph-italia)",
  chartFooterText: "Nota sotto il grafico, anche questa salvata con il grafico.",
  showHeading: true,
  enableDownloadData: true,
  enableDownloadImage: true,
  showPoweredBy: false,
};

const barChart: FieldDataType = {
  id: "saved-wrapper-bar",
  dataSource: null,
  name: "Iscritti (nome del grafico)",
  description: "Descrizione del grafico",
  chart: "bar",
  config: baseConfig,
  data: [
    ["Regione", "2024", "2025"],
    ["Lazio", 120, 150],
    ["Lombardia", 200, 230],
    ["Puglia", 90, 110],
    ["Toscana", 140, 135],
  ],
  wrapper: savedWrapper,
};

const lineChart: FieldDataType = {
  id: "saved-wrapper-line",
  dataSource: null,
  name: "Andamento mensile",
  description: "Senza impostazioni salvate: nella dashboard il titolo è il nome del grafico",
  chart: "line",
  config: { ...baseConfig, h: 320, zoom: "x_axis" },
  data: [
    ["Mese", "Visite"],
    ["Gen", 320],
    ["Feb", 410],
    ["Mar", 380],
    ["Apr", 520],
    ["Mag", 610],
  ],
};

const textBlock: FieldDataType = {
  id: "saved-wrapper-text",
  dataSource: null,
  data: null,
  name: "dashboard-text-intro",
  chart: "text",
  config: {
    ...baseConfig,
    content:
      "### Dashboard salvata con «wrapCharts» e «singleColumn»\n\nI grafici hanno il wrapper e stanno su una sola colonna anche se gli slot sono larghi 1/3 e 2/3. I blocchi di testo non hanno mai il wrapper.",
  },
};

// A dashboard as saved in the editor: "wrap every chart" and "single column"
// are on, so RenderDashboard applies them when the props are left out.
const dashboard: DashboardData = {
  id: "saved-settings-dashboard",
  name: "Dashboard con impostazioni salvate",
  description: "wrapCharts e singleColumn letti dai dati della dashboard",
  wrapCharts: true,
  singleColumn: true,
  slots: [
    { settings: { i: "intro", x: 0, y: 0, w: 3, h: 1 }, chart: textBlock },
    { settings: { i: "bar", x: 0, y: 1, w: 1, h: 2 }, chart: barChart },
    { settings: { i: "line", x: 1, y: 1, w: 2, h: 2 }, chart: lineChart },
  ],
};

export default function SampleSavedWrapper() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <section>
        <h4>ChartWrapper con le impostazioni salvate nel grafico</h4>
        {/* No info texts and no flags: everything comes from chart.wrapper. */}
        <ChartWrapper data={barChart} info={{ text: "" }} />
      </section>
      <section>
        <h4>RenderDashboard salvata con wrapCharts e singleColumn</h4>
        <RenderDashboard data={dashboard} rowHeight={220} />
      </section>
    </div>
  );
}
