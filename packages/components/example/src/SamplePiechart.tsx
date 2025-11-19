import {
  RenderChart,
  type FieldDataType,
  // DataTable,
  // type MatrixType,
} from "dataviz-components";
export default function App() {
  const sampleData: FieldDataType = {
    "id": "cm92sw7bf00076c5hsplehz2k",
    "name": "progetti_sul_territorio_tutti-piechart-2025-04-04_15-08",
    "description": "progetti_sul_territorio_tutti",
    "chart": "pie",
    "config": {
      "h": 550,

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
      "palette": "monocolore_a",
      "tooltip": true,
      "gridLeft": "10%",
      "labeLine": true,
      "direction": "vertical",
      "gridRight": "10%",
      "gridWidth": "auto",
      "gridBottom": "60",
      "gridHeight": "auto",
      "responsive": true,
      "totalLabel": "Totale",
      "showPieLabels": true,
      "legendPosition": "bottom",
      "tooltipTrigger": "axis",
      "valueFormatter": "",
      "tooltipFormatter": "number",
    },
    "data": [
      ["Regione__c", "count(Id)"],
      ["Emilia-Romagna", 4185],
      ["Sardegna", 3471],
      ["Campania", 7495],
      ["Puglia", 4020],
      ["Lombardia", 14585],
      ["Molise", 1426],
      ["Friuli-Venezia Giulia", 1422],
      ["Piemonte", 10117],
      ["Umbria", 1051],
      ["Toscana", 3516],
      ["Basilicata", 1443],
      ["Sicilia", 5304],
      ["Abruzzo", 3476],
      ["Veneto", 6186],
      ["Calabria", 4683],
      ["Trentino-Alto Adige/Südtirol", 2524],
      ["Marche", 2401],
      ["Lazio", 4980],
      ["Liguria", 2244],
      ["Valle d'Aosta/Vallée d'Aoste", 588],
    ],
    "publish": true,

    "isRemote": false,
    "dataSource": "",
  };

  return (
    <div>
      <RenderChart
        {...sampleData}
        // getPicture={() => console.log("getPicture")}
        // getInstance={(instance) => console.log("getInstance", instance)}
      />
      {/* <DataTable data={sampleData.data as MatrixType} /> */}
    </div>
  );
}
