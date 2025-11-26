import {
  RenderChart,
  type FieldDataType,
  // DataTable,
  // type MatrixType,
} from "dataviz-components";

function App() {
  const sampleData: FieldDataType = {
    "id": "cm6ywt8h80001a8a31jqg416r",
    "name": "mapchart-2025-02-10_11-27",
    "description": "xxx",
    "chart": "map",
    "config": {
      "background": "pink",
      "h": 500,
      "stack": false,
      "colors": [
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
      "legend": true,
      "xLabel": "",
      "yLabel": "",
      "gridTop": "60",
      "nameGap": "40",
      "palette": ["monocolore_a"],
      "tooltip": true,
      "gridLeft": "10%",
      "labeLine": false,
      "areaColor": "#fad900",
      "direction": "vertical",
      "gridRight": "10%",
      "gridWidth": "auto",
      "serieName": "boh",
      "visualMap": true,
      "geoJsonUrl":
        "https://www.datocms-assets.com/138980/1736438332-limits_it_regions.geojson",
      "gridBottom": "60",
      "gridHeight": "auto",
      "responsive": true,
      "totalLabel": "Totale",
      "nameProperty": "reg_name",
      "showMapLabels": false,
      "visualMapLeft": "right",
      "legendPosition": "top",
      "tooltipTrigger": "axis",
      "valueFormatter": "",
      "visualMapOrient": "vertical",
      "tooltipFormatter": "number",
    },
    "data": [
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
    "publish": true,
    "isRemote": false,
    "dataSource": null,
  };

  return (
    <div>
      <RenderChart
        {...(sampleData as FieldDataType)}
        // getPicture={() => console.log("getPicture")}
        // getInstance={(instance) => console.log("getInstance", instance)}
      />
      {/* <DataTable data={sampleData.data as MatrixType} /> */}
    </div>
  );
}

export default App;
