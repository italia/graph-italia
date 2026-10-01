# Mappe

Le mappe collegano i dati al territorio italiano. Graph Italia supporta due tipologie di mappe.

## Mappe coropletiche

Le mappe coropletiche sono mappe tematiche che colorano le aree amministrative (regioni o province) in base a un valore: più il valore è alto, più intenso è il colore.

### Quando usarla

Usa la mappa coropletica per mostrare, ad esempio, la densità di popolazione, il reddito pro capite o i risultati di un'elezione.

### Come creare il grafico

1. Vai su **Crea nuovo**, seleziona **Grafico** e carica i tuoi dati (per maggiori informazioni vedi [Caricare i dati](/docs/caricare-dati)); in **Configura il grafico** scegli **Mappa geografica**.
2. Carica una tabella con una colonna che identifica l'area (nome o codice ISTAT della regione o provincia) e una colonna con il valore.
3. L'editor abbina le righe alle aree della mappa; l'anteprima mostra subito il risultato.

Perché l'abbinamento funzioni, i nomi delle aree devono corrispondere a quelli ufficiali (ad esempio "Emilia-Romagna", "Valle d'Aosta"). In alternativa usa i codici ISTAT.

## Mappe a punti

Le mappe a punti mostrano luoghi puntuali sul territorio (sedi, sportelli, eventi) a partire da coordinate geografiche.

### Quando usarla

Usa la mappa a punti per segnalare due o più punti specifici sul territorio.

### Come creare il grafico

1. Vai su **Crea nuovo**, seleziona **Mappa a punti** e carica i tuoi dati (per maggiori informazioni vedi [Caricare i dati](/docs/caricare-dati)). Prima di creare la mappa a punti, considera che ogni punto sulla mappa deve avere le coordinate sulla **latitudine** e **longitudine**, più eventuali colonne descrittive mostrate nel tooltip.
2. Nell'editor puoi cercare un indirizzo e aggiungere punti direttamente dalla ricerca geografica: se non hai le coordinate, usa lo strumento **Genera punti su mappa** (nel menu **Strumenti**) e crea un dataset di esempio.

## GeoJSON personalizzati

Puoi verificare un file GeoJSON con l'anteprima disponibile su **/geo** prima di usarlo, utile per confini o aree non standard.

## Condivisione

Come ogni grafico, una mappa pubblica ha un link di visualizzazione e un codice embed. Vale anche l'aggiornamento automatico dei dati remoti (vedi [Caricare i dati](/docs/caricare-dati)).
