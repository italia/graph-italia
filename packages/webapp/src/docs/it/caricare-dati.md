# Caricare i dati

Il caricamento dei dati sorgente è la prima fase per la creazione dei tuoi elementi. Puoi farlo in tre modalità.

## File CSV

Carica un file CSV dal tuo computer. Perché il file venga letto correttamente, dovrà essere impostato nel seguente modo:

- la **prima riga** deve contenere i nomi delle colonne, così il separatore viene riconosciuto automaticamente;
- i valori numerici possono usare il punto come separatore decimale.

## File JSON

In alternativa, puoi caricare un file JSON contenente un array (struttura dati) di oggetti con le stesse chiavi (una per colonna).

## URL esterno

Incolla la URL di un CSV o JSON pubblicato sul web (ad esempio, un file su GitHub o un'API di open data). Il grafico **resta collegato alla fonte**: quando il grafico è pubblico e la versione salvata ha più di **24 ore**, Graph Italia recupera i dati dall'URL e applica i cambiamenti che hai definito. In questo modo i grafici restano aggiornati senza interventi manuali.

## Sistemare la tabella

Dopo il caricamento vedi i dati in una tabella con una barra di strumenti:

- **Filtra colonne**: escludi le colonne che non servono;
- **Riordina colonne** e **Rinomina intestazioni**;
- **Trasponi**: scambia righe e colonne (utile per le serie temporali);
- **Reimposta**: torna ai dati originali.

## Selezione di categoria e serie

Per i grafici scegli la **colonna categoria** (le etichette, ad esempio le regioni) e una o più **serie numeriche** (i valori da rappresentare).

Se la colonna categoria contiene valori ripetuti (ad esempio una riga per ogni comune, con la regione ripetuta), l'editor ti propone di **aggregare**: conteggio delle righe, somma o media dei valori numerici. L'aggregazione viene salvata nella configurazione del grafico e riapplicata automaticamente a ogni aggiornamento dei dati remoti.
