import { DataTable, type MatrixType } from "graph-italia-components";

const sampleMatrix: MatrixType = [
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
];

export default function SampleTable() {
  return (
    <div>
      <h4 style={{ marginTop: 24 }}>Default</h4>
      <DataTable data={sampleMatrix} id="sample-default" />

      <h4 style={{ marginTop: 32 }}>Con filtri colonne</h4>
      <DataTable data={sampleMatrix} id="sample-filters" showFilters />

      <h4 style={{ marginTop: 32 }}>Con drag-n-drop colonne</h4>
      <DataTable
        data={sampleMatrix}
        id="sample-reorder"
        enableColumnReorder
      />

      <h4 style={{ marginTop: 32 }}>Con export CSV</h4>
      <DataTable data={sampleMatrix} id="sample-export" enableExportCsv />

      <h4 style={{ marginTop: 32 }}>Tutte le feature insieme</h4>
      <DataTable
        data={sampleMatrix}
        id="sample-full"
        showFilters
        enableColumnReorder
        enableExportCsv
      />
    </div>
  );
}
