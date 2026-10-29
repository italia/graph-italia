# Pubblicare e condividere

<!-- publishing:off -->
## Integrare grafici e dashboard nel tuo sito

Su questa istanza la **pubblicazione pubblica è disattivata**: gli elementi non hanno un link pubblico (`/display/...`), non si possono incorporare con un iframe (`/embed/...`) e nell'editor non c'è l'impostazione di visibilità. Restano riservati a te e a chi collabora ai tuoi progetti.

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
<!-- /publishing -->
<!-- publishing:on -->
## Visibilità degli elementi

Per ogni elemento che crei, puoi impostare la visibilità nella sezione **Informazioni** dell'editor. Gli elementi possono essere:

- **Pubblici**: chiunque abbia il link può vederli e possono essere incorporati in altri siti;
- **Privati**: visibili solo nella tua Area Privata, il link pubblico risponde con un avviso e i pulsanti di condivisione non sono disponibili.

## Come condividere un link pubblico

Nella colonna **Condividi** della lista trovi il link diretto alla pagina di visualizzazione: `/display/charts/...` per i grafici e `/display/dashboards/...` per le dashboard.

## Come incorporare un elemento in un altro sito (embed)

Il pulsante con l'icona del codice genera un **iframe** pronto da incollare nel tuo sito:

```html
<iframe width="600" height="400" src="https://.../embed/charts/ID" frameborder="0" allowfullscreen></iframe>
```

- L'embed è essenziale: solo la visualizzazione, senza testata e piè di pagina;
- il tema segue le preferenze del visitatore (chiaro/scuro); puoi forzarlo con `?theme=light` o `?theme=dark` in coda all'URL;
- regola `width` e `height` alle esigenze della tua pagina.

## Integrare con la libreria componenti

In alternativa al link pubblico e all'iframe, puoi mostrare anche gli elementi privati nel tuo sito con la libreria React `graph-italia-components` e una **API key** di sola lettura del progetto (vedi [API REST](/docs/api)).

## Aggiornamento dei dati

I grafici pubblici collegati a una URL remota vengono aggiornati da soli alla prima visualizzazione dopo 24 ore dall'ultimo aggiornamento: il server riscarica la fonte e riapplica le trasformazioni salvate.
<!-- /publishing -->
