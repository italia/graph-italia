# Sorgenti dati

Le sorgenti dati sono i dataset riutilizzabili del progetto: un catalogo di tabelle indipendente dai singoli grafici.

## A cosa servono

- Tenere in un unico posto i dataset del progetto, con nome, descrizione e visibilità;
- consultarli e modificarli in una tabella editabile senza passare da un grafico;
- **leggerli e aggiornarli via API REST**: un sistema esterno (uno script schedulato, un gestionale) può mantenere aggiornato il dataset con una API key in lettura/scrittura (vedi [API](/docs/api)).

## Tipi di sorgente

- **Locale**: un file CSV caricato; i dati vivono nella piattaforma;
- **Remota**: un URL a un CSV o JSON pubblicato altrove; i dati vengono scaricati alla creazione.

## Creazione e gestione

1. **Crea nuovo → Sorgente dati**, assegna un nome.
2. Carica il file o indica l'URL.
3. Dalla lista **Sorgenti dati** dell'Area Privata apri la matita per vedere e modificare i dati.

## Limiti attuali

- La copia dei dati di una sorgente remota non si aggiorna automaticamente (l'aggiornamento a 24 ore vale per i grafici collegati direttamente a un URL);
- i grafici non si collegano ancora a una sorgente dal loro editor: per ora la sorgente è un catalogo consultabile e un punto di accesso via API.
