import { ROUTES } from "../../router";
import LegalPage, { LEGAL_LAST_UPDATED } from "./LegalPage";

export default function LegalNotesPage() {
  // Costruito al render: ROUTES arriva da router.tsx, che importa questa pagina.
  const content = `
# Progetto Graph Italia – Note legali e Condizioni di utilizzo

*Ultimo aggiornamento: ${LEGAL_LAST_UPDATED}*

## Parte I – Note legali

### 1. Titolare e finalità del progetto

La Presidenza del Consiglio dei Ministri - Dipartimento per la trasformazione digitale (di seguito anche solo «Dipartimento» o «DTD»), con sede in Largo Pietro di Brazzà 86, 00187 Roma, mette a disposizione la piattaforma Graph Italia ([https://graph.developers.italia.it](https://graph.developers.italia.it)) per consentire alle Pubbliche Amministrazioni di realizzare, gestire e integrare visualizzazioni grafiche a partire da dati strutturati.

Il DTD si impegna ad assicurare il corretto ed adeguato funzionamento della piattaforma. Per segnalazioni o suggerimenti è disponibile l'indirizzo [tech@innovazione.gov.it](mailto:tech@innovazione.gov.it); per segnalazioni in materia di accessibilità, l'indirizzo [accessibilita@innovazione.gov.it](mailto:accessibilita@innovazione.gov.it). Malfunzionamenti e proposte di miglioramento possono essere segnalati anche tramite la sezione [Issues](https://github.com/italia/graph-italia/issues) del repository del progetto.

### 2. Codice sorgente e riuso

Il codice sorgente è pubblicato su [https://github.com/italia/graph-italia](https://github.com/italia/graph-italia) con licenza [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html), ai sensi degli articoli 68 e 69 del decreto legislativo 7 marzo 2005, n. 82 (CAD), e delle Linee guida AgID sull'acquisizione e il riuso del software.

Le presenti Note legali e Condizioni d'uso si applicano esclusivamente all'istanza gestita dal Dipartimento. Chi riutilizza la soluzione in autonomia ne assume la piena responsabilità, comprese le funzionalità non attive sull'istanza del Dipartimento.

### 3. Marchi e segni distintivi

La licenza di cui all'articolo 2 non si estende a loghi, marchi, stemmi e altri segni distintivi, ivi compresi l'emblema della Repubblica italiana e i segni distintivi istituzionali della Presidenza del Consiglio dei Ministri e del Dipartimento, il cui utilizzo resta soggetto alla normativa vigente. Il Dipartimento si riserva di agire a tutela nei confronti di utilizzi non autorizzati di segni tali da ingenerare confusione sulla provenienza istituzionale dei contenuti.

### 4. Collegamenti a siti esterni

I collegamenti a siti di terzi sono forniti come semplice servizio agli utenti e non implicano approvazione o condivisione di responsabilità in relazione alla legittimità, alla completezza e alla correttezza delle informazioni ivi contenute.

### 5. Limitazione di responsabilità

Il Dipartimento non garantisce l'assenza di errori, l'aggiornamento costante delle informazioni né la continuità del servizio.

La piattaforma Graph Italia non certifica automaticamente la qualità, la correttezza o la liceità dei dati caricati, né effettua una verifica automatica della natura giuridica dei dati caricati. Tali aspetti rimangono sotto la responsabilità del soggetto che crea e gestisce il progetto e gli utenti sono, pertanto, tenuti a utilizzare esclusivamente dati che possono legittimamente trattare e pubblicare.

Il Dipartimento non risponde dei danni derivanti dall'accesso alla piattaforma, dall'impossibilità di accedervi o dall'utilizzo delle informazioni in essa contenute, né dei servizi di connettività utilizzati per l'accesso. Restano ferme le ipotesi di responsabilità non escludibili ai sensi della normativa vigente.

### 6. Accessibilità

Il Dipartimento è impegnato a rendere la piattaforma accessibile ai sensi della legge 9 gennaio 2004, n. 4, e delle Linee guida AgID. La dichiarazione di accessibilità è consultabile all'indirizzo [https://form.agid.gov.it/PCM/Graph_Italia/dichiarazione](https://form.agid.gov.it/PCM/Graph_Italia/dichiarazione).

## Parte II – Condizioni d'uso

Le presenti Condizioni disciplinano l'utilizzo delle funzionalità che richiedono registrazione. La creazione di un account ne comporta l'accettazione.

### 7. Chi può accedere

L'accesso è riservato al personale delle pubbliche amministrazioni che opera per finalità istituzionali. L'accesso avviene tramite SPID o CIE, ai sensi dell'articolo 64, comma 2-quater, del CAD. Una volta effettuato l'accesso, all'utente verrà chiesto di creare un proprio account e, a tal fine, di fornire un indirizzo email e indicare, sotto la propria responsabilità, la pubblica amministrazione di appartenenza.

Il Dipartimento effettua verifiche su tale indicazione. L'indicazione non veritiera comporta la disattivazione dell'account e può rilevare ai fini della responsabilità disciplinare dell'utente.

L'account è personale e non cedibile.

### 8. Utilizzo della piattaforma

L'utente utilizza la piattaforma per le sole finalità istituzionali dell'amministrazione di appartenenza e nel rispetto della normativa vigente. È in particolare vietato caricare contenuti illeciti o lesivi di diritti di terzi, immettere codice malevolo, compromettere il funzionamento della piattaforma o la sicurezza dei dati di altri utenti, accedere a risorse per le quali non si dispone di autorizzazione.

### 9. Dati caricabili

La piattaforma è destinata alla rappresentazione di dati che l'amministrazione utente è legittimata a trattare nell'esercizio delle proprie funzioni istituzionali.

Nel caso in cui l'utente caricasse dati personali rispetto ai quali detta amministrazione si qualifica come titolare del trattamento, detti dati personali saranno trattati ai sensi del Regolamento (UE) 2016/679 (di seguito «Regolamento») nonché del D.Lgs. 196/2003 e successive modificazioni (di seguito «Codice»), secondo quanto previsto all'articolo seguente.

L'utente verifica preventivamente la natura dei dati e la sussistenza di un idoneo presupposto di liceità per il trattamento dei dati personali e ne limita il caricamento a quanto necessario. La piattaforma non effettua alcuna verifica automatica al riguardo.

### 10. Trattamento dei dati personali

L'amministrazione utente opera quale titolare del trattamento dei dati personali eventualmente immessi nella piattaforma, ai sensi dell'articolo 4, punto 7), del Regolamento, e ad essa competono la determinazione delle finalità, la verifica della liceità, dell'esattezza e dell'aggiornamento dei dati, l'individuazione della base giuridica e l'adempimento degli obblighi verso gli interessati. Con riferimento a tali dati, il Dipartimento opera quale responsabile del trattamento ai sensi dell'articolo 28 del Regolamento e li tratta esclusivamente per conto dell'amministrazione titolare e sulla base delle istruzioni da essa impartite, secondo quanto previsto dall'atto di nomina a responsabile del trattamento di cui all'allegato «[Nomina a Responsabile del trattamento](${ROUTES.dataProcessor})», che costituisce atto giuridico ai sensi dell'articolo 28, paragrafo 3, del Regolamento. Il Dipartimento non certifica la qualità, la correttezza o la liceità dei dati caricati e non li utilizza per finalità proprie.

Il Dipartimento opera invece quale titolare del trattamento con riferimento ai dati personali degli utenti trattati per finalità di accesso, autenticazione alla piattaforma e creazione dell'account personale, nonché per garantire il corretto funzionamento della piattaforma e gestire eventuali segnalazioni o proposte di miglioramento, secondo quanto descritto nell'[informativa resa ai sensi dell'articolo 13 del Regolamento](${ROUTES.privacy}).

### 11. Disponibilità del servizio e conservazione

La piattaforma è resa disponibile nello stato in cui si trova, senza garanzia di livelli di servizio determinati o di continuità dell'erogazione. Si raccomanda di conservare copia dei dati e delle configurazioni di rilievo presso la propria amministrazione.

I contenuti sono conservati per il tempo necessario alle finalità del servizio, secondo i termini indicati nell'[informativa privacy](${ROUTES.privacy}). Gli account inattivi per 24 mesi sono disattivati previa comunicazione, con cancellazione dei contenuti associati. L'utente può richiedere in ogni momento la cancellazione del proprio account tramite richiesta e-mail all'indirizzo [tech@innovazione.gov.it](mailto:tech@innovazione.gov.it).

### 12. Sospensione e rimozione

Il Dipartimento può sospendere o disattivare gli account e rimuovere i contenuti caricati in caso di violazione delle presenti Condizioni, di indicazione non veritiera dell'amministrazione di appartenenza, di utilizzo lesivo della sicurezza o della funzionalità della piattaforma, o di segnalazione qualificata dell'illiceità dei contenuti. Nei casi di urgenza connessi alla sicurezza o alla liceità dei contenuti il provvedimento può essere adottato senza preavviso; ne è data comunicazione all'utente e, ove necessario, all'amministrazione di appartenenza.

### 13. Documenti contrattuali e accettazione

L'accettazione delle presenti Note legali e Condizioni d'uso equivale a tutti gli effetti all'accettazione dei relativi allegati, che ne costituiscono parte integrante e sostanziale, inclusa la [nomina a responsabile del trattamento](${ROUTES.dataProcessor}) ai sensi dell'art. 28 del Regolamento (UE) 2016/679.
`;

  return <LegalPage content={content} />;
}
