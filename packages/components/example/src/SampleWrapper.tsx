import { ChartWrapper, type FieldDataType } from "dataviz-components";

function App() {
  const sampleData: FieldDataType = {
    dataSource: null,
    "id": "jcdjdkwbcl",
    "updatedAt": "2025-06-16T16:13:16.783Z",
    "name": "Avanzamento progetti",
    "description": "",
    "chart": "bar",
    "config": {
      "background": "#fbfbfb",
      "h": 600,
      "zoom": "none",
      "stack": false,
      "colors": [
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
      "legend": true,
      "smooth": "0.3",
      "xLabel": "",
      "yLabel": "",
      "gridTop": "60",
      "nameGap": "40",
      "palette": ["divergente_b"],
      "tooltip": true,
      "gridLeft": "10%",
      "labeLine": false,
      "showArea": false,
      "direction": "vertical",
      "gridRight": "10%",
      "gridWidth": "auto",
      "gridBottom": "60",
      "gridHeight": "auto",
      "responsive": true,
      "totalLabel": "Totale",
      "showAllSymbol": true,
      "legendPosition": "top",
      "tooltipTrigger": "axis",
      "valueFormatter": "",
      "tooltipFormatter": "number",
    },
    "data": [
      ["Misura", "liquidate", "stanziate non liquidate", "disponibili"],
      ["1.1 Infrastrutture digitali", 21070551, 148499540, 356629909],
      [
        "1.2 Abilitazione e facilitazione migrazione al Cloud",
        187481680,
        671303602,
        128214718,
      ],
      [
        "1.3.1 Piattaforma Digitale Nazionale Dati",
        92921676,
        91293595,
        371784729,
      ],
      [
        "1.4.1 Esperienza del cittadino nei servizi pubblici",
        215055106,
        583102715,
        6842179,
      ],
      ["1.4.3 Adozione PagoPA e AppIO", 103323916, 114533452, 290142632],
      ["1.4.4 Adozione identità digitale", 55370000, 70083459, 80546541],
      [
        "1.4.5 Digitalizzazione degli avvisi pubblici",
        99546827,
        98666190,
        46786983,
      ],
    ],
    "publish": true,
    "remoteUrl": "",
    "isRemote": false,
  };
  const info = {
    title: "Avanzamento progetti",
    subTitle: "sottotitolo",
    text: "balbllabalb",
    updatedAt: "2025-04-04T15:03:00Z",
    labelUpdated: "Dati aggiornati al",
    labelShare: "Condividi",
    labelSource: "Fonte Dati",
    sourceTextInfo: "*Ministero della Transizione Digitale*",
    labelDownloadData: "Download Data",
    labelDownloadImage: "Download Pic",
    chartFooterText:
      "Questo è un testo di *esempio* per il _footer_ del grafico.",
  };
  return (
    <div>
      <ChartWrapper
        id='jcdjdkwbcl'
        data={sampleData}
        info={info}
        enableDownloadData={true}
        enableDownloadImage={true}
        shareFunction={() => console.log("Share function called")}
      />
    </div>
  );
}

export default App;
