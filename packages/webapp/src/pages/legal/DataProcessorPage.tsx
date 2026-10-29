import { ROUTES } from "../../router";
import LegalPage, { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_EN } from "./LegalPage";

export default function DataProcessorPage() {
  // Costruito al render: ROUTES arriva da router.tsx, che importa questa pagina.
  const it = `
# Atto di nomina a Responsabile del trattamento

ai sensi dell'art. 28 del Regolamento (UE) 2016/679

*Allegato alle [Note legali e Condizioni di utilizzo](${ROUTES.legalNotes}) – Ultimo aggiornamento: ${LEGAL_LAST_UPDATED}*

## Art. 1 – Oggetto e ambito della Nomina

Con il presente atto di nomina (di seguito anche «Nomina»), che costituisce parte integrante delle condizioni d'uso relative alla Piattaforma Graph Italia (di seguito anche «Piattaforma») contenute nel documento «[Progetto Graph Italia – Note legali e Condizioni di utilizzo](${ROUTES.legalNotes})» (di seguito anche «Termini e Condizioni»), al quale è allegata la Nomina, la Pubblica Amministrazione che aderisce ai Termini e Condizioni (di seguito anche «Titolare») designa, in qualità di titolare del trattamento, la Presidenza del Consiglio dei Ministri - Dipartimento per la trasformazione digitale (il «DTD» o il «Responsabile») quale responsabile del trattamento ai sensi dell'art. 28 del Regolamento (UE) 2016/679 (di seguito anche «Regolamento» o «GDPR») per i trattamenti di dati personali effettuati nell'ambito dell'erogazione dei servizi disciplinati da detti Termini e Condizioni (di seguito anche «Servizi»).

## Art. 2 – Obblighi del Responsabile

Il Responsabile tratterà eventuali dati personali caricati all'interno della Piattaforma dai soggetti che la utilizzano per conto del Titolare (di seguito anche «Utenti») esclusivamente per le finalità ed il tempo strettamente necessari all'erogazione dei Servizi, nel rispetto del Regolamento, del D.Lgs. 196/2003 e successive modificazioni (di seguito anche «Codice»), e di ogni altro atto, provvedimento, regolamento o disposizione delle competenti autorità per la protezione dei dati personali (di seguito anche «Normativa in tema di trattamento dei dati personali»), nonché delle istruzioni del Titolare di cui alla presente Nomina.

Il Responsabile si impegna a mantenere, per tutta la durata del trattamento, garanzie sufficienti in termini di conoscenza specialistica, affidabilità e risorse per l'adozione di misure tecniche e organizzative adeguate, volte ad assicurare che il trattamento sia conforme alle prescrizioni della Normativa in tema di trattamento dei dati personali.

Nell'esercizio delle proprie funzioni, il Responsabile si impegna a:

a) trattare i dati conformemente alle istruzioni documentate impartite dal Titolare con il presente atto;

b) garantire che le persone che trattano dati personali per conto del Responsabile siano debitamente istruite ai sensi dell'art. 29 del Regolamento ed adeguatamente formate in materia di protezione di dati personali, osservino le istruzioni impartite dal Titolare al Responsabile e si siano impegnate alla riservatezza o abbiano un adeguato obbligo legale di riservatezza;

c) non divulgare o rendere noti a terzi i dati personali, fuori dai casi strettamente necessari per l'erogazione dei Servizi tramite la Piattaforma;

d) ai sensi dell'art. 30, par. 2, del Regolamento, tenere un Registro delle attività di trattamento svolte per conto del Titolare e cooperare con il Titolare e con l'Autorità Garante per la protezione dei dati personali, mettendo il predetto Registro a disposizione laddove ne venga fatta richiesta;

e) adottare idonea procedura di gestione delle violazioni dei dati personali, prestando la massima collaborazione nei confronti del Titolare al fine di eliminare o quantomeno ridurre al minimo gli impatti derivanti da eventi di questo tipo;

f) non trasferire (anche tramite sub-responsabili) i dati personali verso un Paese terzo o un'organizzazione internazionale senza previa autorizzazione scritta del Titolare, salvo che lo richieda il diritto dell'Unione europea o nazionale cui è soggetto il Responsabile (in tal caso, il Responsabile informa il Titolare circa tale obbligo giuridico prima del trasferimento, a meno che il diritto lo vieti per rilevanti motivi di interesse pubblico) e comunque nel rispetto della Normativa in tema di trattamento dei dati personali.

## Art. 3 – Tipologia dei dati personali oggetto di trattamento

Il Responsabile tratterà qualsiasi dato personale che gli Utenti carichino all'interno della Piattaforma, per l'erogazione dei relativi Servizi. Tali dati personali potrebbero consistere in dati di natura comune (quali dati anagrafici e di contatto) così come, eventualmente, in categorie particolari di dati personali ai sensi dell'art. 9 del Regolamento oppure in dati relativi a condanne penali e reati ai sensi dell'art. 10 del GDPR.

Resta in capo al Titolare la responsabilità di verificare la sussistenza di un idoneo presupposto di liceità per il trattamento dei dati personali caricati sulla Piattaforma.

## Art. 4 – Categorie di soggetti interessati

Il Responsabile tratterà, per conto del Titolare, i dati personali delle persone fisiche cui si riferiscono i dati personali caricati dagli Utenti all'interno della Piattaforma per la realizzazione, la gestione e l'integrazione delle visualizzazioni grafiche.

## Art. 5 – Natura del Trattamento

La natura dei trattamenti effettuati dal Responsabile consiste nella ricezione e nell'elaborazione dei dati personali caricati dagli Utenti all'interno della Piattaforma.

## Art. 6 – Finalità del Trattamento

Il trattamento viene effettuato dal Responsabile al fine di consentire agli Utenti di utilizzare la Piattaforma per la realizzazione, gestione ed integrazione delle visualizzazioni grafiche.

## Art. 7 – Durata del Trattamento

In assenza di diversa indicazione da parte del Titolare, i dati personali caricati dagli Utenti sulla Piattaforma saranno trattati esclusivamente per il tempo necessario alla realizzazione, la gestione e l'integrazione delle visualizzazioni grafiche e non saranno conservati dal Responsabile, fatte salve eventuali esigenze di conservazione in adempimento di obblighi normativi.

## Art. 8 – Misure di sicurezza

Il Responsabile si impegna ad adottare misure tecniche e organizzative adeguate a garantire un idoneo livello di sicurezza dei dati personali, ai sensi dell'art. 32 del Regolamento, necessarie a prevenire o minimizzare ogni rischio ragionevolmente prevedibile connesso alla distruzione, alla perdita, alla modifica, alla divulgazione non autorizzata o all'accesso, in modo accidentale o illegale, ai dati trattati. Tali misure di sicurezza devono essere conformi alle migliori pratiche in materia di sicurezza, anche informatica, tenuto conto dello stato dell'arte e dei costi di attuazione, nonché della natura, dell'oggetto, del contesto e delle finalità del trattamento. Il Responsabile si impegna, altresì, ad adottare e mantenere tutte le misure tecniche, operative e organizzative adeguate e proporzionate alla gestione dei potenziali rischi posti alla sicurezza della Piattaforma, in conformità alla normativa applicabile in materia di cybersicurezza.

Tali misure dovranno comprendere, tra l'altro:

- la pseudonimizzazione e/o la cifratura di dati personali;
- la capacità di assicurare, su base permanente, la riservatezza, l'integrità, la disponibilità e la resilienza dei sistemi e dei servizi che trattano i dati personali;
- la capacità di ripristinare tempestivamente la disponibilità e l'accesso dei dati in caso di incidente fisico o tecnico;
- una procedura per testare, verificare e valutare regolarmente l'efficacia delle misure tecniche e organizzative al fine di garantire la sicurezza del trattamento.

## Art. 9 – Sub-responsabili del trattamento

Il Titolare autorizza il Responsabile, ai sensi dell'art. 28, paragrafo 2, del GDPR, a ricorrere a uno o più sub-responsabili del trattamento per lo svolgimento delle specifiche attività di trattamento effettuate per conto del Titolare.

Il Responsabile garantisce che i sub-responsabili di cui si avvale prestano garanzie sufficienti per mettere in atto misure tecniche e organizzative adeguate in modo tale che il trattamento soddisfi i requisiti di cui alla Normativa in tema di trattamento dei dati personali.

## Art. 10 – Assistenza

Il Responsabile, tenuto conto della natura del trattamento e delle informazioni a sua disposizione, assiste il Titolare, su richiesta di quest'ultimo e nei limiti delle informazioni e dei mezzi ragionevolmente disponibili, al fine di dare seguito alle richieste per l'esercizio dei diritti degli interessati. Qualora gli interessati esercitino tali diritti presso il Responsabile, quest'ultimo è tenuto a non rispondere autonomamente alle relative richieste (a meno che non sia espressamente autorizzato in tal senso dal Titolare) e ad inoltrare tempestivamente le istanze al Titolare, e comunque entro 10 giorni dalla ricezione.

Il Responsabile avvisa tempestivamente il Titolare in caso di comunicazioni, ispezioni o richieste di informazioni da parte dell'Autorità Garante per la protezione dei dati personali o (in quanto concernenti il trattamento dei dati personali svolto per conto del Titolare) di qualsivoglia altra autorità e, nei limiti delle informazioni disponibili e delle attività rientranti nella propria sfera di controllo, assiste il Titolare nel caso di richieste formulate da tali autorità in merito al trattamento dei dati personali effettuato nell'ambito del funzionamento della Piattaforma.

Il Responsabile, ove richiesto dal Titolare, assiste il medesimo anche nel garantire il rispetto degli obblighi previsti dagli articoli 32-36 del GDPR, tenuto conto della natura del trattamento dei dati e delle informazioni a disposizione del Responsabile o di sub-responsabili.

## Art. 11 – Violazioni dei dati personali

Il Responsabile informa senza indebito ritardo il Titolare di ogni violazione di dati personali (data breach) che riguardi i dati personali trattati per suo conto. Su richiesta del Titolare, il Responsabile fornisce, nei limiti delle informazioni ragionevolmente disponibili, le informazioni e la documentazione pertinenti necessarie a consentire al Titolare di adempiere agli obblighi previsti agli artt. 33 e 34 del Regolamento.

## Art. 12 – Responsabile della protezione dei dati

Il Responsabile ha nominato un Responsabile della protezione dei dati, il quale può essere contattato ai seguenti recapiti:

- Email: [responsabileprotezionedatipcm@governo.it](mailto:responsabileprotezionedatipcm@governo.it)
- PEC: [rpd@pec.governo.it](mailto:rpd@pec.governo.it)

## Art. 13 – Durata

L'efficacia della presente nomina decorre dalla data di accettazione dei Termini e Condizioni e permane per l'intera durata del rapporto disciplinato dai medesimi, terminando automaticamente alla data della loro cessazione, per qualsiasi causa.

## Art. 14 – Disposizioni finali

Per quanto non espressamente previsto si applicano le disposizioni del Regolamento e del Codice.

Il presente atto non comporta alcun compenso per il Responsabile.
`;

  const en = `
# Deed of appointment as Data Processor

pursuant to art. 28 of Regulation (EU) 2016/679

*Annex to the [Legal Notes and Terms of Use](${ROUTES.legalNotes}) – Last updated: ${LEGAL_LAST_UPDATED_EN}*

## Art. 1 – Subject matter and scope of the Appointment

With this deed of appointment (hereinafter also «Appointment»), which forms an integral part of the terms of use of the Graph Italia Platform (hereinafter also «Platform») contained in the document «[Graph Italia Project – Legal Notes and Terms of Use](${ROUTES.legalNotes})» (hereinafter also «Terms and Conditions»), to which the Appointment is annexed, the Public Administration that adheres to the Terms and Conditions (hereinafter also «Controller») designates, as data controller, the Presidency of the Council of Ministers - Department for Digital Transformation (the «DTD» or the «Processor») as data processor pursuant to art. 28 of Regulation (EU) 2016/679 (hereinafter also «Regulation» or «GDPR») for the processing of personal data carried out in the course of providing the services governed by those Terms and Conditions (hereinafter also «Services»).

## Art. 2 – Obligations of the Processor

The Processor will process any personal data uploaded to the Platform by the persons who use it on behalf of the Controller (hereinafter also «Users») exclusively for the purposes and for the time strictly necessary to provide the Services, in compliance with the Regulation, Legislative Decree 196/2003 as amended (hereinafter also «Code»), and any other act, measure, regulation or provision of the competent data protection authorities (hereinafter also «Data Protection Legislation»), as well as with the Controller's instructions set out in this Appointment.

The Processor undertakes to maintain, for the whole duration of the processing, sufficient guarantees in terms of expert knowledge, reliability and resources to implement appropriate technical and organisational measures, so as to ensure that the processing complies with the requirements of the Data Protection Legislation.

In performing its functions, the Processor undertakes to:

a) process the data in accordance with the documented instructions given by the Controller with this deed;

b) ensure that the persons who process personal data on behalf of the Processor are duly instructed pursuant to art. 29 of the Regulation and adequately trained in personal data protection, comply with the instructions given by the Controller to the Processor and have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality;

c) not disclose or make known the personal data to third parties, except where strictly necessary to provide the Services through the Platform;

d) pursuant to art. 30(2) of the Regulation, keep a Record of the processing activities carried out on behalf of the Controller and cooperate with the Controller and with the Italian Data Protection Authority, making the said Record available upon request;

e) adopt a suitable procedure for managing personal data breaches, cooperating fully with the Controller in order to eliminate or at least minimise the impact of such events;

f) not transfer personal data (including through sub-processors) to a third country or an international organisation without the Controller's prior written authorisation, unless required to do so by Union or Member State law to which the Processor is subject (in such a case, the Processor informs the Controller of that legal requirement before the transfer, unless that law prohibits such information on important grounds of public interest) and in any case in compliance with the Data Protection Legislation.

## Art. 3 – Types of personal data processed

The Processor will process any personal data that Users upload to the Platform in order to provide the related Services. Such personal data may consist of common data (such as personal details and contact data) as well as, possibly, special categories of personal data pursuant to art. 9 of the Regulation or data relating to criminal convictions and offences pursuant to art. 10 GDPR.

The Controller remains responsible for verifying the existence of an appropriate lawful basis for processing the personal data uploaded to the Platform.

## Art. 4 – Categories of data subjects

The Processor will process, on behalf of the Controller, the personal data of the natural persons to whom the personal data uploaded by Users to the Platform for creating, managing and integrating graphical visualisations relate.

## Art. 5 – Nature of the Processing

The processing carried out by the Processor consists of receiving and processing the personal data uploaded by Users to the Platform.

## Art. 6 – Purpose of the Processing

The processing is carried out by the Processor in order to allow Users to use the Platform for creating, managing and integrating graphical visualisations.

## Art. 7 – Duration of the Processing

Unless otherwise indicated by the Controller, the personal data uploaded by Users to the Platform will be processed only for the time needed to create, manage and integrate the graphical visualisations and will not be retained by the Processor, without prejudice to any retention required to comply with legal obligations.

## Art. 8 – Security measures

The Processor undertakes to adopt appropriate technical and organisational measures to ensure a suitable level of security of personal data, pursuant to art. 32 of the Regulation, necessary to prevent or minimise any reasonably foreseeable risk connected with the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, the data processed. Such security measures must comply with best practices in security, including IT security, taking into account the state of the art and the costs of implementation, as well as the nature, scope, context and purposes of the processing. The Processor also undertakes to adopt and maintain all technical, operational and organisational measures that are appropriate and proportionate to managing the potential risks to the security of the Platform, in accordance with the applicable cybersecurity legislation.

Such measures shall include, among others:

- the pseudonymisation and/or encryption of personal data;
- the ability to ensure the ongoing confidentiality, integrity, availability and resilience of the systems and services processing personal data;
- the ability to restore the availability of and access to data in a timely manner in the event of a physical or technical incident;
- a process for regularly testing, assessing and evaluating the effectiveness of technical and organisational measures for ensuring the security of the processing.

## Art. 9 – Sub-processors

The Controller authorises the Processor, pursuant to art. 28(2) GDPR, to engage one or more sub-processors to carry out specific processing activities on behalf of the Controller.

The Processor ensures that the sub-processors it engages provide sufficient guarantees to implement appropriate technical and organisational measures in such a manner that the processing meets the requirements of the Data Protection Legislation.

## Art. 10 – Assistance

The Processor, taking into account the nature of the processing and the information available to it, assists the Controller, at the latter's request and within the limits of the information and means reasonably available, in responding to requests for the exercise of data subjects' rights. Where data subjects exercise such rights with the Processor, the latter shall not respond to those requests on its own (unless expressly authorised to do so by the Controller) and shall promptly forward them to the Controller, and in any case within 10 days of receipt.

The Processor promptly notifies the Controller of any communications, inspections or requests for information from the Italian Data Protection Authority or (insofar as they concern the processing of personal data carried out on behalf of the Controller) from any other authority and, within the limits of the information available and of the activities within its sphere of control, assists the Controller in the case of requests made by such authorities concerning the processing of personal data carried out in the operation of the Platform.

Where requested by the Controller, the Processor also assists it in ensuring compliance with the obligations set out in articles 32 to 36 GDPR, taking into account the nature of the processing and the information available to the Processor or to sub-processors.

## Art. 11 – Personal data breaches

The Processor informs the Controller without undue delay of any personal data breach affecting the personal data processed on its behalf. At the Controller's request, the Processor provides, within the limits of the information reasonably available, the relevant information and documentation needed to allow the Controller to fulfil the obligations set out in articles 33 and 34 of the Regulation.

## Art. 12 – Data Protection Officer

The Processor has appointed a Data Protection Officer, who can be contacted at:

- Email: [responsabileprotezionedatipcm@governo.it](mailto:responsabileprotezionedatipcm@governo.it)
- Certified email (PEC): [rpd@pec.governo.it](mailto:rpd@pec.governo.it)

## Art. 13 – Duration

This appointment takes effect from the date of acceptance of the Terms and Conditions and remains in force for the whole duration of the relationship they govern, ending automatically on the date they cease to apply, for any reason.

## Art. 14 – Final provisions

For anything not expressly provided for herein, the provisions of the Regulation and of the Code apply.

This deed does not entail any fee for the Processor.
`;

  return <LegalPage content={{ it, en }} />;
}
