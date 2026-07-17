# Mappe

Le mappe collegano i dati al territorio italiano. Graph Italia supporta due famiglie di mappe.

## Mappe coropletiche

Colorano le aree amministrative (regioni o province) in base a un valore: più il valore è alto, più intenso è il colore.

1. **Crea nuovo → Mappa**.
2. Carica una tabella con una colonna che identifica l'area (nome o codice ISTAT della regione o provincia) e una colonna con il valore.
3. L'editor abbina le righe alle aree della mappa; l'anteprima mostra subito il risultato.

Perché l'abbinamento funzioni, i nomi delle aree devono corrispondere a quelli ufficiali (ad esempio "Emilia-Romagna", "Valle d'Aosta"). In alternativa usa i codici ISTAT.

## Mappe a punti

Mostrano luoghi puntuali sul territorio (sedi, sportelli, eventi) a partire da coordinate.

- Ogni punto richiede **latitudine** e **longitudine**, più eventuali colonne descrittive mostrate nel tooltip;
- nell'editor puoi cercare un indirizzo e aggiungere punti direttamente dalla ricerca geografica;
- se non hai coordinate, lo strumento **Genera punti su mappa** (menu Strumenti) crea un dataset di esempio.

## GeoJSON personalizzati

Puoi verificare un file GeoJSON con l'anteprima disponibile su **/geo** prima di usarlo, utile per confini o aree non standard.

## Condivisione

Come ogni grafico, una mappa pubblica ha un link di visualizzazione e un codice embed. Vale anche l'aggiornamento automatico dei dati remoti (vedi [Caricare i dati](/docs/caricare-dati)).
