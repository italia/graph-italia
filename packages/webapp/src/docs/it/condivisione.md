# Condividere e integrare

## Condividere con il tuo team

Per lavorare insieme ad altre persone sugli stessi grafici usa le **organizzazioni** (**menu utente → Organizzazioni**):

1. crea un'organizzazione: ne diventi amministratore (ruolo ADMIN);
2. nella scheda **Membri** clicca su **Aggiungi membro** e invita i colleghi con il loro indirizzo email, scegliendo il ruolo: **ADMIN** può gestire membri e progetti dell'organizzazione, **USER** lavora sui progetti;
3. nella scheda **Progetti** clicca su **Trasferisci progetto** e scegli uno dei tuoi progetti personali.

Da quel momento tutti i membri trovano il progetto nel selettore dell'Area Privata e ne vedono e modificano grafici, mappe, gruppi KPI, dashboard e dataset.

- Resti **proprietario** del progetto: trasferirlo all'organizzazione significa condividerlo, non cederlo;
- puoi **revocare** l'associazione in qualsiasi momento, e il progetto torna personale;
- le API key restano legate al progetto, quindi chi le usa vede gli stessi elementi del team.

Ruoli e permessi sono spiegati in [Progetti e organizzazioni](/docs/organizzazioni).

<!-- publishing:off -->
## La pubblicazione su questa istanza

Graph Italia può rendere pubblici grafici e dashboard. Chi gestisce un'istanza attiva o disattiva questa funzione con un'impostazione del server (`ENABLE_PUBLIC_PUBLISHING`): **su questa istanza la pubblicazione è disattivata**.

In pratica ogni elemento è come se fosse sempre **privato**:

- lo vedono solo le persone che accedono al progetto, cioè tu e, se il progetto è associato a un'organizzazione, i suoi membri;
- nell'editor non c'è l'impostazione di visibilità e nelle liste non ci sono link pubblici né codici da incorporare.

Graph Italia è software open source: chi lo installa sulla propria infrastruttura può attivare la pubblicazione. Come fare è spiegato nel [README del progetto](https://github.com/italia/graph-italia#pubblicazione-pubblica-link-e-embed).
<!-- /publishing -->

## Integrare grafici e dashboard nel tuo sito

Per mostrare un grafico o una dashboard nel tuo sito o applicativo web:

1. crea una **API key** di sola lettura (READONLY) per il progetto che contiene l'elemento (**menu utente → API Key**, vedi [API REST](/docs/api));
2. installa la libreria React `graph-italia-components` e usa `ChartProvider` (un grafico) o `DashboardGridProvider` (una dashboard), passando la chiave, l'indirizzo del server e l'identificativo dell'elemento: il componente recupera configurazione e dati e disegna il grafico;
3. se non usi React, o vuoi integrare i dati in un tuo backend, usa le API REST o il client tipizzato `graph-italia-cli`.

```jsx
import { ChartProvider } from "graph-italia-components";

<ChartProvider
  apiKey="dv_LA_TUA_CHIAVE"
  endpoint="https://SERVER"
  chartId="ID_GRAFICO"
  withWrapper
/>
```

- Una chiave usata nel browser è visibile a chi visita la pagina e permette di leggere **tutti** gli elementi del progetto: usa sempre una chiave READONLY e raccogli in un progetto dedicato solo ciò che vuoi mostrare;
- per non esporre la chiave, fai le chiamate dal tuo server e passa al browser solo i dati;
- puoi revocare una chiave in qualsiasi momento dalla pagina **API Key**.
<!-- publishing:on -->

## Aggiornamento dei dati

I grafici pubblici collegati a una URL remota vengono aggiornati da soli alla prima visualizzazione dopo 24 ore dall'ultimo aggiornamento: il server riscarica la fonte e riapplica le trasformazioni salvate.
<!-- /publishing -->
