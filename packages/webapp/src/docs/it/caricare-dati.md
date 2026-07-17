# Caricare i dati

Ogni grafico nasce dai suoi dati. Nell'editor, il passaggio **Carica i tuoi dati** offre tre modalità.

## File CSV

Carica un file CSV dal tuo computer. Requisiti:

- la **prima riga** deve contenere i nomi delle colonne;
- il separatore viene riconosciuto automaticamente;
- i valori numerici possono usare il punto come separatore decimale.

## File JSON

In alternativa puoi caricare un file JSON contenente un array di oggetti con le stesse chiavi (una per colonna).

## URL remoto

Incolla l'indirizzo di un CSV o JSON pubblicato sul web (ad esempio un file su GitHub o un'API di open data). Il grafico **resta collegato alla fonte**: quando il grafico è pubblico, il server riscarica i dati dall'URL se la copia salvata è più vecchia di **24 ore**, riapplicando le trasformazioni che hai definito. È il modo giusto per grafici che devono restare aggiornati senza interventi manuali.

## Sistemare la tabella

Dopo il caricamento vedi i dati in una tabella con una barra di strumenti:

- **Filtra colonne**: escludi le colonne che non servono;
- **Riordina colonne** e **Rinomina intestazioni**;
- **Trasponi**: scambia righe e colonne (utile per le serie temporali);
- **Reimposta**: torna ai dati originali.

## Selezione di categoria e serie

Per i grafici scegli la **colonna categoria** (le etichette, ad esempio le regioni) e una o più **serie numeriche** (i valori da rappresentare).

Se la colonna categoria contiene valori ripetuti (ad esempio una riga per ogni comune, con la regione ripetuta), l'editor ti propone di **aggregare**: conteggio delle righe, somma o media dei valori numerici. L'aggregazione viene salvata nella configurazione del grafico e riapplicata automaticamente a ogni aggiornamento dei dati remoti.
