# Pubblicare e condividere

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

## Aggiornamento dei dati

I grafici pubblici collegati a una URL remota vengono aggiornati da soli alla prima visualizzazione dopo 24 ore dall'ultimo aggiornamento: il server riscarica la fonte e riapplica le trasformazioni salvate.
