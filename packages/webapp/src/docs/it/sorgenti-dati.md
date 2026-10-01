# Dataset

I dataset sono le sorgenti dati riutilizzabili del progetto: un catalogo di tabelle indipendente da utilizzare sui grafici.

## Come usare i dataset

- Nella sezione dedicata trovi tutti i dataset del progetto, con nome, descrizione e visibilità. Potrai consultarli e modificarli in una tabella editabile senza dover modificare i grafici in cui sono stati richiamati;
- in alternativa, potrai **leggerli e aggiornarli via API REST**: un sistema esterno (uno script programmato, un gestionale) può mantenere aggiornato il dataset con una API key in lettura/scrittura (vedi [API](/docs/api)).

## Tipologie di sorgente dei dataset

- **Locale**: il dataset è un file CSV caricato dal tuo computer; i dati sono caricati nella piattaforma;
- **Remota**: il dataset proviene da un URL (CSV o JSON) pubblicato su un sito esterno; i dati vengono scaricati da Graph Italia quando il dataset viene creato.

## Come creare un dataset

1. Vai su **Crea nuovo**, seleziona **Sorgente dati** e assegna un nome.
2. Carica il file CSV o indica una URL.
3. Dalla lista **File sorgente dati** nella tua Area Privata vai sull'editor per vedere e modificare i dati.

## Limitazioni

- La copia dei dati di una sorgente remota non si aggiorna automaticamente (l'aggiornamento a 24 ore vale per i grafici collegati direttamente a un URL);
- i grafici non si collegano ancora a una sorgente dal loro editor: per ora la sorgente è un catalogo consultabile e un punto di accesso via API.
