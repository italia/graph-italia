# Pubblicare e condividere

## Visibilità

Ogni elemento ha una visibilità, impostabile nella sezione **Informazioni** del suo editor:

- **Pubblico**: chiunque abbia il link può vederlo, senza account; può essere incorporato in altri siti;
- **Privato**: visibile solo dall'Area Privata; il link pubblico risponde con un avviso e i pulsanti di condivisione non sono disponibili.

## Link pubblico

Dalla colonna **Condividi** della lista copi il link diretto alla pagina di visualizzazione (`/display/charts/...` per i grafici, `/display/dashboards/...` per le dashboard).

## Incorporare in un altro sito (embed)

Il pulsante con l'icona del codice genera un **iframe** pronto da incollare nel tuo sito:

```html
<iframe width="600" height="400" src="https://.../embed/charts/ID" frameborder="0" allowfullscreen></iframe>
```

- L'embed è essenziale: solo la visualizzazione, senza testata e piè di pagina;
- il tema segue le preferenze del visitatore (chiaro/scuro); puoi forzarlo con `?theme=light` o `?theme=dark` in coda all'URL;
- regola `width` e `height` alle esigenze della tua pagina.

## Aggiornamento dei dati

Un grafico pubblico collegato a un URL remoto si aggiorna da solo: alla prima visualizzazione dopo 24 ore dall'ultimo aggiornamento, il server riscarica la fonte e riapplica le trasformazioni salvate.
