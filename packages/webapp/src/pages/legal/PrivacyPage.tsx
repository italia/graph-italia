import { ROUTES } from "../../router";
import LegalPage, { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_EN } from "./LegalPage";

export default function PrivacyPage() {
  // Costruito al render: ROUTES arriva da router.tsx, che importa questa pagina.
  const it = `
# Informativa in materia di protezione dei dati personali

ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR)

*Ultimo aggiornamento: ${LEGAL_LAST_UPDATED}*

La presente informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (di seguito, «Regolamento») con riferimento ai trattamenti di dati personali effettuati nell'ambito dell'autenticazione e dell'utilizzo della piattaforma «Graph Italia» (di seguito, «Piattaforma»), messa a disposizione delle Pubbliche Amministrazioni per la realizzazione, la gestione e l'integrazione di visualizzazioni grafiche a partire da dati strutturati, realizzata nell'ambito dell'attuazione delle principali linee strategiche del Piano Triennale per l'Informatica nella Pubblica Amministrazione, con particolare riferimento alla valorizzazione dei dati pubblici, alla governance digitale e al supporto ai processi decisionali basati su evidenze.

Si vedano anche le [Note legali e Condizioni di utilizzo](${ROUTES.legalNotes}) della Piattaforma.

## Titolare del trattamento

Titolare del trattamento per le finalità di seguito indicate è la Presidenza del Consiglio dei Ministri - Dipartimento per la trasformazione digitale, con sede in Largo Pietro di Brazzà 86, 00187 Roma, codice fiscale 80188230587 (di seguito anche «DTD» o «Titolare»), contattabile ai seguenti recapiti:

- Email: [segreteria.trasformazionedigitale@governo.it](mailto:segreteria.trasformazionedigitale@governo.it)
- PEC: [diptrasformazionedigitale@pec.governo.it](mailto:diptrasformazionedigitale@pec.governo.it)

Il Responsabile della Protezione dei Dati - Data Protection Officer del Titolare è contattabile ai seguenti recapiti:

- Email: [responsabileprotezionedatipcm@governo.it](mailto:responsabileprotezionedatipcm@governo.it)
- PEC: [rpd@pec.governo.it](mailto:rpd@pec.governo.it)

## Finalità del trattamento

I dati personali saranno trattati dal Titolare al fine di:

### 1. Consentire l'autenticazione e l'accesso alla Piattaforma, la creazione dell'account personale e l'utilizzo dei relativi servizi

Il DTD ha realizzato la Piattaforma nell'ambito dell'attuazione del Piano Triennale per l'Informatica nella Pubblica Amministrazione, al fine di favorire l'adozione, da parte delle Pubbliche Amministrazioni, di standard grafici uniformi per le rappresentazioni di dati.

Il trattamento dei dati personali è quindi effettuato per consentire agli utenti, nell'ambito delle attività svolte per conto della Pubblica Amministrazione di appartenenza, di autenticarsi e accedere alla Piattaforma, creare un proprio account personale e utilizzare i relativi servizi.

Il conferimento dei dati per questa finalità è necessario per accedere e utilizzare la Piattaforma. Il mancato conferimento comporta l'impossibilità di effettuare l'autenticazione e l'accesso, creare il proprio profilo e di usufruire dei servizi offerti dalla Piattaforma.

### 2. Permettere la navigazione e la fruizione della Piattaforma

I sistemi informativi e le procedure software preposte al funzionamento della Piattaforma acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione Internet.

In particolare, la Piattaforma non utilizza cookie per la profilazione degli utenti, ma unicamente cookie tecnici necessari per il suo funzionamento e per migliorare l'esperienza d'uso dei propri visitatori.

Il trattamento di tali dati è quindi necessario per consentire l'autenticazione, l'accesso, la navigazione e il corretto funzionamento della Piattaforma.

La maggior parte dei browser accetta i cookie automaticamente, ma è possibile rifiutarli.

Se non si desidera ricevere o memorizzare i cookie, si possono modificare le impostazioni di sicurezza del browser utilizzato, secondo le istruzioni rese disponibili dai relativi fornitori ai link di seguito indicati:

- [Chrome](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=it)
- [Firefox](https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop?redirectlocale=it&redirectslug=Attivare+e+disattivare+i+cookie)
- [Safari](https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac)
- [Edge](https://support.microsoft.com/it-it/help/4027947/microsoft-edge-delete-cookies)
- [Opera](https://help.opera.com/en/latest/web-preferences/)

Nel caso in cui si disabilitino detti cookie, la Piattaforma potrebbe non funzionare correttamente e l'utente verrebbe disconnesso.

### 3. Gestire eventuali segnalazioni relative a malfunzionamenti o proposte di miglioramento

Attraverso l'apposita sezione «[Issues](https://github.com/italia/graph-italia/issues)» della Piattaforma, oppure contattando il Titolare all'indirizzo [tech@innovazione.gov.it](mailto:tech@innovazione.gov.it), gli utenti possono segnalare malfunzionamenti e suggerire miglioramenti. Contattando il Titolare all'indirizzo [accessibilita@innovazione.gov.it](mailto:accessibilita@innovazione.gov.it) gli utenti possono altresì effettuare segnalazioni in materia di accessibilità.

Il trattamento di dati personali per questa finalità è necessario per garantire il corretto funzionamento e il continuo miglioramento della Piattaforma.

Il conferimento dei dati per questa finalità è necessario per la gestione delle segnalazioni dell'utente e, in assenza di tali dati, potrebbe non essere possibile dare seguito alla sua richiesta.

### 4. Adempiere ad obblighi di legge

I dati personali potranno essere trattati per adempiere ad obblighi di legge, inclusa l'ottemperanza ad eventuali richieste delle autorità competenti.

Il conferimento dei dati per questa finalità costituisce obbligo di legge e, in caso di mancato conferimento, non sarà possibile per l'utente registrarsi ed utilizzare la Piattaforma.

## Basi giuridiche del trattamento

- La base giuridica per le finalità di trattamento di cui ai precedenti punti 1-3 è l'esecuzione di un compito di interesse pubblico o connesso all'esercizio di pubblici poteri di cui è investito il Titolare, ai sensi dell'art. 6, par. 1, lett. e) del GDPR, svolto dal DTD nell'ambito dell'attuazione delle linee strategiche del Piano Triennale per l'Informatica nella Pubblica Amministrazione.
- La base giuridica per la finalità di trattamento di cui al precedente punto 4 è l'adempimento ai propri obblighi legali, ai sensi dell'art. 6, par. 1, lett. c) del GDPR.

## Categorie di dati e fonti dei dati personali

I dati trattati appartengono alle seguenti categorie:

- Dati identificativi (nome e cognome, sesso, luogo e data di nascita);
- Codice fiscale;
- Dati di contatto (indirizzo e-mail);
- Informazioni professionali relative alla Pubblica Amministrazione di appartenenza;
- Dati di navigazione («log») relativi agli accessi e all'utilizzo della Piattaforma (indirizzo IP, data e ora di accesso, informazioni sugli eventi di sistema e sulle attività effettuate dall'utente).

Effettuando l'autenticazione tramite SPID o CIE, i dati identificativi e le ulteriori informazioni necessarie all'autenticazione saranno acquisiti, rispettivamente, dal gestore dell'identità digitale prescelto o dal Ministero dell'Interno. Per la creazione del proprio account e nell'ambito della navigazione e dell'utilizzo della Piattaforma, saranno trattati dati personali raccolti direttamente presso l'interessato.

## Conservazione dei dati personali

Per l'autenticazione e l'accesso alla Piattaforma mediante SPID e CIE, i dati personali saranno trattati esclusivamente per il tempo necessario a completare la procedura di autenticazione e non saranno conservati dal Titolare. I dati forniti dall'utente per la creazione del proprio account saranno conservati sino alla cancellazione dell'account, oppure la cancellazione sarà disposta automaticamente in caso di inattività protratta per un periodo di 24 mesi. I dati personali dell'utente potranno altresì essere trattati per l'ulteriore periodo eventualmente necessario all'adempimento di obblighi di legge.

## Categorie di destinatari dei dati

I dati personali saranno trattati dai soggetti espressamente autorizzati dal Titolare, appartenenti agli uffici competenti, i quali agiscono sulla base di specifiche istruzioni fornite dal Titolare in ordine a finalità e modalità del trattamento.

Essendo il servizio destinato unicamente alla Pubblica Amministrazione, i dati anagrafici dell'utente saranno comunicati all'ente di appartenenza indicato in fase di creazione dell'account personale, al fine di verificare che l'utilizzo della Piattaforma avvenga effettivamente per conto di tale ente.

I dati personali potranno essere comunicati per le suddette finalità a fornitori e consulenti esterni, quali fornitori IT e consulenti legali.

I dati personali non saranno trasferiti al di fuori dell'UE.

## Esercizio dei diritti

- **Diritto di accedere ai dati:** è possibile ottenere conferma e informazioni sul trattamento.
- **Diritto di rettifica:** è possibile rettificare dati inesatti o integrarli.
- **Diritto alla cancellazione:** nei casi di legge, l'interessato ha diritto di ottenere la cancellazione.
- **Diritto di limitazione del trattamento:** nei casi di legge, l'interessato può chiedere di limitare il trattamento.
- **Diritto di opporsi al trattamento:** per particolari motivi è possibile opporsi al trattamento per l'esecuzione di un compito di interesse pubblico o connesso all'esercizio di pubblici poteri.
- **Diritto alla portabilità dei dati:** l'interessato ha diritto alla portabilità dei dati nei casi di legge.
- **Diritto alla revoca del consenso:** laddove fosse la base giuridica del trattamento, l'interessato può revocare il proprio consenso senza pregiudicare la validità del trattamento svolto in precedenza.

Per maggiori informazioni o per esercitare i propri diritti, l'interessato può contattare il Titolare agli indirizzi sopra indicati.

Se invece si ritiene che il trattamento dei dati personali avvenga in violazione di quanto previsto dal Regolamento, è possibile proporre reclamo, ai sensi dell'art. 77 del Regolamento, al [Garante per la protezione dei dati personali](https://www.garanteprivacy.it).
`;

  const en = `
# Personal data protection notice

pursuant to articles 13 and 14 of Regulation (EU) 2016/679 (GDPR)

*Last updated: ${LEGAL_LAST_UPDATED_EN}*

This notice is provided pursuant to articles 13 and 14 of Regulation (EU) 2016/679 (hereinafter «Regulation») with regard to the processing of personal data carried out in connection with authentication to and use of the «Graph Italia» platform (hereinafter «Platform»), made available to Public Administrations for creating, managing and integrating graphical visualisations starting from structured data, and developed as part of the implementation of the main strategic lines of the Three-Year Plan for IT in the Public Administration, with particular reference to the enhancement of public data, digital governance and support for evidence-based decision-making.

See also the [Legal Notes and Terms of Use](${ROUTES.legalNotes}) of the Platform.

## Data controller

The data controller for the purposes indicated below is the Presidency of the Council of Ministers - Department for Digital Transformation, with registered office at Largo Pietro di Brazzà 86, 00187 Rome, tax code 80188230587 (hereinafter also «DTD» or «Controller»), who can be contacted at:

- Email: [segreteria.trasformazionedigitale@governo.it](mailto:segreteria.trasformazionedigitale@governo.it)
- Certified email (PEC): [diptrasformazionedigitale@pec.governo.it](mailto:diptrasformazionedigitale@pec.governo.it)

The Controller's Data Protection Officer can be contacted at:

- Email: [responsabileprotezionedatipcm@governo.it](mailto:responsabileprotezionedatipcm@governo.it)
- Certified email (PEC): [rpd@pec.governo.it](mailto:rpd@pec.governo.it)

## Purposes of processing

Personal data will be processed by the Controller in order to:

### 1. Enable authentication and access to the Platform, the creation of the personal account and the use of the related services

The DTD developed the Platform as part of the implementation of the Three-Year Plan for IT in the Public Administration, in order to encourage Public Administrations to adopt uniform graphic standards for data representations.

Personal data are therefore processed to allow users, in the course of the activities carried out on behalf of the Public Administration they belong to, to authenticate and access the Platform, create their own personal account and use the related services.

Providing the data for this purpose is necessary to access and use the Platform. Failure to provide them makes it impossible to authenticate and access, create one's profile and use the services offered by the Platform.

### 2. Allow browsing and use of the Platform

The information systems and software procedures that operate the Platform acquire, in the course of their normal operation, some personal data whose transmission is implicit in the use of Internet communication protocols.

In particular, the Platform does not use profiling cookies, but only technical cookies that are necessary for its operation and to improve its visitors' experience.

The processing of such data is therefore necessary to allow authentication, access, browsing and the correct operation of the Platform.

Most browsers accept cookies automatically, but they can be refused.

If you do not wish to receive or store cookies, you can change the security settings of your browser, following the instructions provided by the respective vendors at the links below:

- [Chrome](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en)
- [Firefox](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop)
- [Safari](https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac)
- [Edge](https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies)
- [Opera](https://help.opera.com/en/latest/web-preferences/)

If these cookies are disabled, the Platform may not work correctly and the user would be logged out.

### 3. Handle any reports of malfunctions or improvement proposals

Through the dedicated «[Issues](https://github.com/italia/graph-italia/issues)» section of the Platform, or by contacting the Controller at [tech@innovazione.gov.it](mailto:tech@innovazione.gov.it), users can report malfunctions and suggest improvements. By contacting the Controller at [accessibilita@innovazione.gov.it](mailto:accessibilita@innovazione.gov.it), users can also submit accessibility reports.

The processing of personal data for this purpose is necessary to ensure the correct operation and continuous improvement of the Platform.

Providing the data for this purpose is necessary to handle the user's reports and, without such data, it may not be possible to follow up on the request.

### 4. Comply with legal obligations

Personal data may be processed to comply with legal obligations, including compliance with any requests from the competent authorities.

Providing the data for this purpose is a legal obligation and, if they are not provided, the user will not be able to register and use the Platform.

## Legal bases of processing

- The legal basis for the purposes of processing referred to in points 1-3 above is the performance of a task carried out in the public interest or in the exercise of official authority vested in the Controller, pursuant to art. 6(1)(e) GDPR, carried out by the DTD as part of the implementation of the strategic lines of the Three-Year Plan for IT in the Public Administration.
- The legal basis for the purpose of processing referred to in point 4 above is compliance with its legal obligations, pursuant to art. 6(1)(c) GDPR.

## Categories and sources of personal data

The data processed belong to the following categories:

- Identification data (first and last name, sex, place and date of birth);
- Tax code;
- Contact data (email address);
- Professional information about the Public Administration of belonging;
- Browsing data («logs») relating to access to and use of the Platform (IP address, date and time of access, information on system events and on the activities carried out by the user).

When authenticating through SPID or CIE, the identification data and the further information required for authentication will be acquired, respectively, from the chosen digital identity provider or from the Ministry of the Interior. For the creation of the account and in the course of browsing and using the Platform, personal data collected directly from the data subject will be processed.

## Retention of personal data

For authentication and access to the Platform through SPID and CIE, personal data will be processed only for the time needed to complete the authentication procedure and will not be retained by the Controller. The data provided by the user to create their account will be retained until the account is deleted, or deletion will take place automatically after a period of inactivity of 24 months. The user's personal data may also be processed for any further period necessary to comply with legal obligations.

## Categories of recipients of the data

Personal data will be processed by persons expressly authorised by the Controller, belonging to the competent offices, who act on the basis of specific instructions given by the Controller regarding the purposes and methods of processing.

Since the service is intended solely for the Public Administration, the user's personal details will be communicated to the administration of belonging indicated when creating the personal account, in order to verify that the Platform is actually used on behalf of that administration.

Personal data may be communicated for the above purposes to external suppliers and consultants, such as IT suppliers and legal advisers.

Personal data will not be transferred outside the EU.

## Exercise of rights

- **Right of access:** you can obtain confirmation of and information about the processing.
- **Right to rectification:** you can rectify inaccurate data or complete them.
- **Right to erasure:** in the cases provided for by law, the data subject has the right to obtain erasure.
- **Right to restriction of processing:** in the cases provided for by law, the data subject can ask to restrict the processing.
- **Right to object to processing:** on grounds relating to your particular situation, you can object to processing carried out for the performance of a task in the public interest or in the exercise of official authority.
- **Right to data portability:** the data subject has the right to data portability in the cases provided for by law.
- **Right to withdraw consent:** where consent is the legal basis for the processing, the data subject can withdraw it without affecting the lawfulness of the processing carried out before.

For further information or to exercise their rights, the data subject can contact the Controller at the addresses indicated above.

If you believe that the processing of personal data infringes the Regulation, you can lodge a complaint, pursuant to art. 77 of the Regulation, with the Italian Data Protection Authority ([Garante per la protezione dei dati personali](https://www.garanteprivacy.it)).
`;

  return <LegalPage content={{ it, en }} />;
}
