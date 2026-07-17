# API REST

Tutto ciò che fai dall'interfaccia si può fare via API: creare e aggiornare grafici, leggere dashboard, alimentare sorgenti dati da uno script.

## API key

1. Vai su **menu utente → API Key**;
2. crea una chiave scegliendo il ruolo: **READONLY** (sola lettura) o **READWRITE** (lettura e scrittura);
3. copia subito il valore (inizia con `dv_`): non sarà più mostrato.

La chiave è **legata al progetto** attivo al momento della creazione: le richieste operano su quel progetto.

## Autenticazione

Passa la chiave nell'header `Authorization`:

```bash
curl -H "Authorization: Bearer dv_LA_TUA_CHIAVE" \
  https://SERVER/api/charts
```

## Endpoint principali

| Risorsa | Endpoint | Operazioni |
| --- | --- | --- |
| Grafici | `/api/charts` | elenco, dettaglio, creazione, modifica, eliminazione |
| Grafico pubblico | `/api/charts/show/:id` | lettura senza autenticazione (solo elementi pubblici) |
| Gruppi KPI | `/api/charts/kpi-group` | creazione e modifica dei gruppi KPI |
| Dashboard | `/api/dashboards` | elenco, dettaglio, slot |
| Sorgenti dati | `/api/datasources` | elenco, dettaglio, creazione, aggiornamento dati |

## Documentazione interattiva

Il server espone la specifica **OpenAPI** su `/openapi.json` e una documentazione interattiva (Scalar) su `/docs`, con tutti gli endpoint, gli schemi e la possibilità di provare le chiamate.

## Esempio: aggiornare una sorgente dati da uno script

```bash
curl -X PUT \
  -H "Authorization: Bearer dv_LA_TUA_CHIAVE" \
  -H "Content-Type: application/json" \
  -d '{"data": [["regione","valore"],["Lazio",42]]}' \
  https://SERVER/api/datasources/ID_SORGENTE
```

Con una chiave READWRITE e un cron notturno, i dataset del progetto restano sempre aggiornati.
