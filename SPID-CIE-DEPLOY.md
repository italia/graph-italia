# SPID/CIE in produzione: istruzioni per il cluster

Il prossimo rilascio di Graph Italia permette di rendere SPID/CIE l'unico modo di accesso. Per attivarlo servono i dati del client OIDC su IAM Proxy Italia, che oggi non conosciamo, e alcune variabili nella release Helm, che dal repository non possiamo leggere né cambiare.

## Cosa cambia con il rilascio

Senza nessuna nuova variabile il comportamento resta quello di oggi: accesso con email e password, più SPID/CIE se l'OIDC è configurato. Le novità si attivano solo dalle variabili.

- **Migrazioni del database.** Il job `db-migration` (hook pre-upgrade, già attivo) applica tre nuove migrazioni Prisma:
  - `20261016120000_user_password_optional`;
  - `20261016130000_oidc_identities`: nuova tabella `OidcIdentity`, copia i collegamenti SPID/CIE esistenti e rimuove la colonna `User.sub`;
  - `20261016140000_normalize_user_emails`: email in minuscolo, salta i casi in conflitto.

  Conviene un backup del database prima del deploy.
- **Nuove variabili del server.** `ENABLE_PASSWORD_AUTH` (`false` = solo SPID/CIE), `ADMIN_EMAILS` (email che ricevono il ruolo ADMIN all'accesso) e le `OIDC_*` per IAM Proxy Italia.
- **Pipeline.** Il deploy usa `helm upgrade --reuse-values`, quindi i default del chart non arrivano alle release esistenti. Il workflow ora legge le variabili qui sopra dagli Environments di GitHub `production` e `test` e le passa a Helm solo se valorizzate.

## Cosa chiedere al team di IAM Proxy Italia

Serve un client OIDC per produzione e uno per test (o uno solo con entrambi i redirect URI). Va chiesto o verificato quanto segue.

| Cosa | Perché serve | Diventa |
| --- | --- | --- |
| URL dell'issuer (quello che espone `/.well-known/openid-configuration`) | Scoperta automatica di endpoint e chiavi | `OIDC_ISSUER` |
| Client ID e client secret | Autenticazione del server presso IAM Proxy | `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` |
| Metodo di autenticazione del client = `client_secret_basic` | È l'unico supportato dalla libreria usata (`@hono/oidc-auth`); con `private_key_jwt` il login non funziona | — |
| Registrazione del redirect URI `https://<dominio>/api/oidc/callback` per ogni ambiente | IAM Proxy rifiuta redirect non registrati | `OIDC_REDIRECT_URI` |
| Supporto a PKCE (S256) e `nonce` | La libreria li invia sempre | — |
| Scope da richiedere (es. `openid profile email`) | Senza indicazione vengono chiesti tutti quelli pubblicati dall'IdP | `OIDC_SCOPES` |
| Claim restituiti: `email`, `given_name`, `family_name`, `fiscal_number`, via ID token o `userinfo` | L'email collega l'accesso all'account; se manca (CIE) l'app la chiede e la verifica con un codice | — |
| Se la stessa persona ha lo stesso `sub` con SPID e con CIE | Informativo: l'app gestisce comunque più `sub` per account | — |

## Variabili da impostare

Tutte finiscono in `server.env` della release. I domini sono indicativi: vanno confermati quelli reali di produzione e test.

| Variabile | Tipo su GitHub | Valore | Note |
| --- | --- | --- | --- |
| `OIDC_ISSUER` | variable | dal team IAM Proxy | |
| `OIDC_CLIENT_ID` | variable | dal team IAM Proxy | |
| `OIDC_CLIENT_SECRET` | secret | dal team IAM Proxy | |
| `OIDC_AUTH_SECRET` | secret | stringa casuale di almeno 32 caratteri, es. `openssl rand -hex 32` | Firma il cookie di sessione OIDC; diverso per ambiente |
| `OIDC_REDIRECT_URI` | variable | `https://<dominio>/api/oidc/callback` | Sempre assoluto: dietro l'ingress il server vede `http://` e un percorso relativo non coinciderebbe con quello registrato |
| `OIDC_AUTH_EXTERNAL_URL` | variable | `https://<dominio>` | Origine pubblica usata per l'URL di ritorno dopo il login |
| `OIDC_SCOPES` | variable | es. `openid profile email` | Facoltativa |
| `ADMIN_EMAILS` | variable | `a@ente.it,b@ente.it` | Ricevono ADMIN all'accesso; non retrocede mai nessuno |
| `ENABLE_PASSWORD_AUTH` | variable | `true` all'inizio, `false` per il solo SPID/CIE | Da mettere a `false` solo dopo aver verificato che SPID/CIE funziona |

Una variabile va impostata con il suo valore oppure non impostata affatto: una `OIDC_*` presente ma vuota fa fallire il login SPID/CIE.

## Come impostarle

Ci sono due strade; conviene sceglierne una sola come fonte. Se una variabile è impostata in entrambe, a ogni deploy vince quella di GitHub.

### A. Environments di GitHub (consigliata)

Serve un amministratore del repository `italia/graph-italia`. In Settings → Environments → `production` (e `test`) si aggiungono le *variables* e i *secrets* della tabella sopra.

Il valore viene applicato al deploy successivo: tag `v*.*.*` per la produzione, push su `develop` per il test. Il log del passo «Deploy» elenca i nomi delle variabili applicate, senza i valori.

### B. Direttamente sulla release Helm

Per chi ha accesso al cluster. Prima si controlla cosa c'è già, stampando solo i nomi per non esporre i segreti:

```bash
helm list -n graph-italia
helm get values graph-italia -n graph-italia -o json | jq -r '.server.env | keys[]'
```

Poi si aggiorna la release con la stessa versione del chart già installata. Le virgole vanno precedute da `\`, altrimenti Helm divide il valore:

```bash
helm upgrade graph-italia oci://ghcr.io/italia/charts/graph-italia \
  --version <versione installata> -n graph-italia --reuse-values \
  --set-string server.env.OIDC_ISSUER='https://...' \
  --set-string server.env.OIDC_CLIENT_ID='...' \
  --set-string server.env.OIDC_CLIENT_SECRET='...' \
  --set-string server.env.OIDC_AUTH_SECRET="$(openssl rand -hex 32)" \
  --set-string server.env.OIDC_REDIRECT_URI='https://<dominio>/api/oidc/callback' \
  --set-string server.env.OIDC_AUTH_EXTERNAL_URL='https://<dominio>' \
  --set-string server.env.ADMIN_EMAILS='a@ente.it\,b@ente.it' \
  --set-string server.env.ENABLE_PASSWORD_AUTH=true
```

L'upgrade rilancia il job di migrazione (non trova nulla da applicare se la versione è la stessa) e riavvia i pod del server con le nuove variabili. I deploy successivi della pipeline le mantengono grazie a `--reuse-values`.

Per l'ambiente di test i comandi sono gli stessi con release e namespace `graph-italia-test`.

## Ordine di attivazione

La password si spegne solo per ultima: se SPID/CIE non funzionasse, nessuno potrebbe più entrare. Conviene fare tutto prima su test.

1. Ottenere dal team IAM Proxy i dati della tabella sopra e far registrare i redirect URI di test e produzione.
2. Fare un backup del database di produzione (le tre migrazioni partono al primo deploy del nuovo rilascio).
3. Impostare le `OIDC_*` e `ADMIN_EMAILS`, lasciando `ENABLE_PASSWORD_AUTH=true` (o non impostata).
4. Deploy, poi le verifiche della sezione successiva: accesso con SPID, con CIE (senza email: l'app chiede l'email e manda un codice) e ruolo ADMIN per gli indirizzi in `ADMIN_EMAILS`.
5. Impostare `ENABLE_PASSWORD_AUTH=false` e fare un nuovo deploy (strada A) o un `helm upgrade` (strada B).
6. Ripetere le verifiche e controllare che il form con la password non compaia più.

## Verifica e rollback

Tutte le verifiche si fanno da browser, senza accesso al cluster.

| Controllo | Esito atteso |
| --- | --- |
| `https://<dominio>/api/config` | `passwordAuth` vale `true` o `false` come impostato |
| `https://<dominio>/api/oidc/login` | Rimanda alla pagina di IAM Proxy. Un errore 500 `Session secret is not provided` o `OIDC issuer is not provided` indica variabili mancanti |
| Primo accesso SPID con email già registrata | Entra direttamente nell'account esistente |
| Primo accesso CIE (senza email) | L'app chiede l'email e invia un codice: serve il provider di posta già configurato (`MAIL_PROVIDER`) |
| Accesso con un indirizzo di `ADMIN_EMAILS` | Il menu di amministrazione compare |

**Rollback.** Per riattivare l'accesso con password basta `ENABLE_PASSWORD_AUTH=true` e un nuovo deploy o `helm upgrade`. Cancellare la variabile da GitHub non basta: la release mantiene l'ultimo valore.

Le migrazioni non vanno annullate: funzionano con entrambe le modalità. Gli account creati solo con SPID/CIE non hanno password e possono impostarla con «Password dimenticata?».
