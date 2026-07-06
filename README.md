# Graph Italia

**Graph Italia** Permette agli utenti di trasformare dati (relativamente semplici) come CSV/JSON, locali o remoti (URL), in visualizzazioni grafiche accessibili, con l'obiettivo di semplificare la pubblicazione di questi grafici all'interno di propri siti web.

Graph Italia è attualmente predisposto per più lingue (per adesso italiano e inglese) ed estendibile a piacere. Il codice è opensource, vedi la sezione di configurazione variabili e installazione per adottarlo e capire se fa al caso tuo.

Il progetto è strutturato come **monorepo** per massimizzare la riusabilità dei componenti: la libreria React può essere utilizzata indipendentemente, mentre l'applicazione web completa offre un'interfaccia utente completa per tutte le funzionalità.

**Graph Italia** è sviluppato principalmente con **TypeScript**, **React**, e utilizza **Bun** come runtime e package manager.

## Scope

**Graph Italia** è un insieme di strumenti progettato per semplificare il processo di pubblicazione grafici all'interno di siti web, con lo scopo di facilitare utenti non tecnici nella pubblicazione di contenuti di questo tipo. Le principali funzionalità includono:

- **Come è nato** Deriva da una esigenza interna di visualizzare dati e cruscotti su siti istituzionali che gestiamo, avendo cura di rispettare principi di accessibilità, identity e trasparenza che denotano i siti in questione.

- **Come è Articolato** E' composto da diversi tool:
  - una Libreria per la visualizzazione dei grafici, che rappresenta il vero core del progetto ed è stata la prima cosa realizzata nel 2023 insiame ad un Plugin per DatoCMS dove salvare i dati per il sito innovazione.gov.it.
  - una componente Server che sovraintende alle Api per il controllo accesso e salvataggio dati nel db e rimpiazza il Plugin
  - una Web App per permettere di creare grafici a partire dal caricamento di file dati formattati ad hoc, anche questa parte rimpiazza il Plugin.

- **Creazione Grafici**: Upload file dati CSV (max 5mb) , o caricamento dati preformattati ad hoc da URL remoti, selezione delle serie da visualizzare, (solo una colonna come category ovvero stringhe e label, e più serie numeriche), selezione tipo di grafico fra i supportati (barre, linee, torta, mappe geografiche, KPI), e personalizzazione limitata di alcuni parametri quali legende e stili etc.
- **Dashboards**: Creazione di dashboard a partire dai grafici creati, combinando più grafici in un'unica vista
- **Integrazione e Condivisione**: E' possibile integrare i chart creati all'interno di siti web tramite l'utilizzo delle Api, e utilizzando apposite chiavi per ogni progetto. Ogni progetto può avere N grafici e Dashboard. E' presente anche la possibilità di flaggare i grafici come pubblici e visualizzarli ad un url corrispondente all'identificativo alfanumerico del grafico, ma per adesso questa funzionalità è disabilitatà sulla nostra istanza per motivi legali. Questa Modalità permette anche l'embedding di grafici e dashboard tramite l'utilizzo di iframes all'interno di terzi siti web.
- **Persistenza e Gestione**: Vengono salvati soltanto i dati caricati e selezionati dagli utenti. Nel caso di url remoti viene mantenuta in cache l'ultima versione valida , mentre viene effettuata una nuova richiesta se i dati sono più vecchi di tot ore (24 attualmente), e i dati vengono sostituiti se la nuova chiamata ha successo.
- **Autenticazione Utenti**: Sistema di autenticazione tramite registrazione email e password, funzionalità di recupero password tramite invio email, attivazione account post verifica email. In corso di integrazione login con SPID, CIE etc...
- **Suggerimenti AI**:Funzionalità parcheggiata,e attualmente disabilitata: una volta caricati e filtrati i dati di interesse, è possibile richiederne un'analisi ad un llm con prompt opportuno che propone possibili grafici e opportune trasformazioni, aggragazioni dei dati attuali se necesario. La funzionalità è in attesa di verifica di approvazione dal reparto legal.

## Panoramica Generale

Il progetto utilizza **Bun workspaces** per gestire i pacchetti multipli. La configurazione è nel `package.json` root con:

```json
"workspaces": ["packages/*"]
```

### Pacchetti Principali

1. **`packages/components`** - Libreria React di componenti riutilizzabili
2. **`packages/server`** - Backend API server (Hono + Bun)
3. **`packages/webapp`** - Applicazione web principale (React + Vite)
4. **`packages/ui-example-app`** - App di esempio per dimostrare l'uso dei componenti

---

## 1. Packages/Components - Libreria di Componenti

### Descrizione

Libreria npm pubblicabile (`graph-italia-components`) che fornisce componenti React per la visualizzazione di dati.

### Tecnologie

- **Build**: Rollup (con supporto ESM e CommonJS)
- **React**: v19.1.0
- **ECharts**: v5.6.0 (per grafici)
- **OpenLayers (ol)**: v10.5.0 (per mappe geografiche)
- **React Table**: @tanstack/react-table (per tabelle dati)

### Componenti Principali Esportati

#### `RenderChart`

Componente principale che renderizza diversi tipi di grafici basati sulla prop `chart`:

- **`bar`** / **`line`**: Grafici a barre e linee (BasicChart)
- **`pie`**: Grafici a torta (PieChart)
- **`map`**: Mappe geografiche con GeoJSON (GeoMapChart)
- **`cmap`**: Mappe a cluster (ClusterMap)
- **`kpi`**: Indicatori KPI (KpiGroup)

#### `ChartWrapper`

Wrapper per i grafici con funzionalità aggiuntive (download, condivisione, ecc.)

#### `DataTable`

Tabella dati interattiva con:

- Ordinamento
- Filtri
- Esportazione
- Visibilità colonne
- Scroll orizzontale

#### `KpiItem`

Componente per visualizzare indicatori chiave di performance (KPI)

### Struttura Build

- **Input**: `src/index.ts`
- **Output**:
  - `dist/index.js` (CommonJS)
  - `dist/index.esm.js` (ESM)
  - `dist/types/index.d.ts` (TypeScript definitions)

### Dipendenze Peer

Le dipendenze sono dichiarate come `peerDependencies` per evitare duplicazioni:

- React ^19.1.0, React-DOM ^19.1.0
- ECharts ^5.6.0, echarts-for-react ^3.0.2
- OpenLayers ^10.5.0
- dayjs ^1.11.13
- react-error-boundary ^6.0.0
- react-markdown ^10.1.0, remark-gfm ^4.0.1
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (drag-and-drop)

### Integrazione

I pacchetti interni (`webapp` e `ui-example-app`) utilizzano il componente tramite:

```json
"graph-italia-components": "workspace:*"
```

---

## 2. Packages/Server - Backend API

### Descrizione

Server Hono che gestisce autenticazione, persistenza dati, e API per charts e dashboards.

### Tecnologie

- **Runtime**: Bun
- **Framework**: Hono (web framework ultraleggero)
- **Database**: PostgreSQL (Azure) con Prisma ORM v7.0.1
- **Autenticazione**: JWT + bcrypt
- **Email**: Resend (per invio email di attivazione/reset password)
- **AI**: OpenAI (per suggerimenti automatici)
- **Observability**: Pino (logging JSON), Prometheus metrics
- **API Docs**: OpenAPI + Scalar

#### Ruoli Utente

Il sistema supporta due ruoli:

- **`USER`**: Utente standard (default)
- **`ADMIN`**: Amministratore con privilegi estesi

#### Descrizione Modelli principali

- **`User`**: Gestione utenti con autenticazione email/password, verifica account tramite codici PIN, ruolo assegnabile
- **`Project`**: Contenitore a cui si possono associare grafici e dashboard, è possibile condividere i Progetti con altri utenti e Organizzazioni
- **`Chart`**: Configurazione grafici (tipo, dati, configurazione), supporto per dati remoti, pubblicazione pubblica, preview come immagine
- **`Dashboard`**: Raccolta di grafici organizzati in "slots", pubblicazione pubblica, layout personalizzabile
- **`ApiKey`**: Chiavi utilizzabili come bearers tokens per accedere tramite api ai grafici e le Dashboard
- **`Slot`**: Collegamento tra Dashboard e Chart con configurazioni personalizzate per ogni slot

#### Schema modelli prisma.

```mermaid
erDiagram
    User {
        String id PK
        String email
        String password
        Boolean verified
        Role role
        DateTime createdAt
        DateTime updatedAt
    }

    Project {
        String id PK
        String name
        String ownerId FK
        DateTime createdAt
        DateTime updatedAt
    }

    ProjectMember {
        String userId FK
        String projectId FK
        ProjectRole role
        DateTime createdAt
        DateTime updatedAt
    }

    Org {
        String id PK
        String name
        DateTime createdAt
        DateTime updatedAt
    }

    Membership {
        String userId FK
        String orgId FK
        OrgRole role
        DateTime createdAt
        DateTime updatedAt
    }

    OrgProject {
        String orgId FK
        String projectId FK
        DateTime createdAt
        DateTime updatedAt
    }

    ApiKey {
        String id PK
        String prefix
        String keyHash
        ApiKeyRole role
        Int expire
        DateTime revokedAt
        String projectId FK
        DateTime createdAt
        DateTime updatedAt
    }

    ApiLog {
        String id PK
        String method
        String endpoint
        Int status
        Int responseTime
        DateTime timestamp
        String projectName
        String apiKeyId FK
    }

    VerificationCode {
        String id PK
        String code
        CodeType type
        Int expire
        DateTime consumedAt
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    DataSource {
        String id PK
        String name
        String description
        Json data
        Json rules
        Boolean publish
        Boolean isTrasposed
        String remoteUrl
        Boolean isRemote
        String projectId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Chart {
        String id PK
        String name
        String description
        String chart
        Json config
        Json data
        Json dataSource
        Boolean publish
        String remoteUrl
        Boolean isRemote
        String projectId FK
        DateTime createdAt
        DateTime updatedAt
    }

    SourceLink {
        String dataSourceId FK
        String chartId FK
        Json config
        DateTime createdAt
        DateTime updatedAt
    }

    Dashboard {
        String id PK
        String name
        String description
        Boolean publish
        String projectId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Slot {
        String dashboardId FK
        String chartId FK
        Json settings
        String name
        String description
        DateTime createdAt
        DateTime updatedAt
    }

    User ||--o{ Project : "owns"
    User ||--o{ ProjectMember : "member of"
    User ||--o{ Membership : "belongs to"
    User ||--o{ VerificationCode : "has"

    Project ||--o{ ProjectMember : "has"
    Project ||--o{ OrgProject : "linked to"
    Project ||--o{ Chart : "contains"
    Project ||--o{ Dashboard : "contains"
    Project ||--o{ DataSource : "contains"
    Project ||--o{ ApiKey : "has"

    Org ||--o{ Membership : "has"
    Org ||--o{ OrgProject : "linked to"

    ApiKey ||--o{ ApiLog : "logs"

    Chart ||--o{ Slot : "placed in"
    Chart ||--o{ SourceLink : "linked to"

    Dashboard ||--o{ Slot : "contains"

    DataSource ||--o{ SourceLink : "linked to"
```

#### Documentazione API

- `GET /openapi.json` - Specifica OpenAPI 3.0
- `GET /docs` - Documentazione API interattiva (Scalar UI)

### Middleware

- `checkAuth`: Verifica JWT token
- `requireUser`: Richiede utente autenticato
- `validateRequest`: Validazione con Zod
- `errorHandler`: Gestione errori
- `notFound`: 404 handler

### Funzionalità Avanzate

- **Dati Remoti**: Aggiornamento automatico ogni 24h per charts remoti
- **Sicurezza**: Helmet, CORS configurato, validazione input
- **Email**: Invio email di attivazione e reset password

---

## 3. Packages/Webapp - Applicazione Web Principale

### Descrizione

Applicazione React completa per creare, modificare e visualizzare grafici e dashboard.

### Tecnologie

- **Build Tool**: Vite
- **Framework**: React v19.1.0 + React Router v6
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: Zustand + XState (per macchine a stati)
- **Data Fetching**: SWR
- **Form Handling**: React Hook Form + Zod
- **Layout**: react-grid-layout (per dashboard drag-and-drop)
- **Dipendenze**: Usa `graph-italia-components` come workspace dependency

### Funzionalità Principali

#### Creazione Grafici

```mermaid
flowchart TD
    Start([Utente accede]) --> Login{Autenticato?}
    Login -->|No| Auth[Login/Registrazione]
    Auth --> Home[Home Page]
    Login -->|Sì| Home

    Home --> Create[+ Create New Chart]
    Create --> Load[Caricamento Dati]

    Load --> CSV[Upload CSV]
    Load --> URL[Carica da URL]
    Load --> Gen[Genera Dati Random]

    CSV --> Transform[Trasformazione Dati]
    URL --> Transform
    Gen --> Transform

    Transform --> Config[Configurazione Grafico]
    Config --> SelectType[Seleziona Tipo:<br/>bar/line/pie/map/kpi]
    Config --> Customize[Personalizza:<br/>colori, legende, tooltip]

    SelectType --> Preview[Anteprima Grafico]
    Customize --> Preview

    Preview --> Save{Salvare?}
    Save -->|Sì| SaveDB[Salva nel Database]
    Save -->|No| Config

    SaveDB --> Publish{Pubblicare?}
    Publish -->|Sì| Public[Pubblica Pubblicamente]
    Publish -->|No| Private[Salva Privato]

    Public --> Share[Condividi URL]
    Private --> List[Lista Charts]
    Share --> List
```

1. **Caricamento Dati**:
   - Upload CSV/JSON
   - Caricamento CSV/JSON da URL remoto
   - Generazione dati randomici di esempio
   - Selezione colonne dati da salvare/usare

2. **Configurazione**:
   - Selezione tipo grafico (bar, line, pie, map, kpi)
   - Personalizzazione colori/palette
   - Configurazione legende, tooltip, labels
   - Opzioni responsive

3. **Salvataggio**:
   - Salvataggio nel database

#### Dashboard

- Creazione dashboard con layout drag-and-drop
- Aggiunta multipli grafici (slots)
- Personalizzazione posizione e dimensione

#### Autenticazione

- Registrazione con verifica email
- Login/logout
- Reset/change password
- Protezione area privata con `ProtectedRoute`

#### Utility Pages

- `/load-data`: Caricamento dati da CSV/URL
- `/generate-data`: Generazione dati di esempio
- `/geo`: Utility per mappe geografiche

---

## 4. Packages/UI-Example-App - App di Esempio

### Descrizione

Applicazione React minimalista per dimostrare l'uso dei componenti `graph-italia-components`.

### Funzionalità

- Esempi di utilizzo per ogni tipo di grafico
- Componenti di esempio:
  - `SampleBarchart`
  - `SampleLinechart`
  - `SamplePiechart`
  - `SampleGeomapchart`
  - `SampleMap` (cluster map)
  - `SampleKpis`
  - `SampleTable`
  - `SampleWrapper`

### Integrazione

Usa `graph-italia-components` tramite link locale:

```json
"graph-italia-components": "link:graph-italia-components"
```

---

## Integrazione tra Componenti

### Flusso di Dati

```mermaid
graph TB
    Webapp[Webapp<br/>React + Vite]
    Components[Components<br/>React Library]
    Server[Server<br/>Hono + Bun]
    DB[(PostgreSQL<br/>Prisma ORM)]

    Webapp -->|usa| Components
    Webapp <-->|HTTP API| Server
    Server -->|query| DB
    Components -.->|può chiamare| Server
```

### Architettura Monorepo

```mermaid
graph LR
    Root[Root Package<br/>Bun Workspaces]

    Root --> Components[packages/components<br/>React Component Library<br/>Pubblicabile su npm]
    Root --> Server[packages/server<br/>Backend API<br/>Hono + Bun]
    Root --> Webapp[packages/webapp<br/>Web Application<br/>React + Vite]
    Root --> Example[packages/ui-example-app<br/>Example App<br/>Demo Components]

    Webapp -->|workspace:*| Components
    Example -->|link:| Components
    Webapp <-->|HTTP REST API| Server
```

### Dipendenze Workspace

1. **Webapp → Components**:

   ```json
   "graph-italia-components": "workspace:*"
   ```

   - Webapp importa e usa i componenti React dalla libreria
   - Build separata: components viene buildato prima di webapp

2. **UI-Example-App → Components**:

   ```json
   "graph-italia-components": "link:graph-italia-components"
   ```

   - Link locale per sviluppo

3. **Server**:
   - Indipendente, fornisce API REST
   - Comunica con webapp tramite HTTP

### Scripts di Build

Dal `package.json` root:

- `bun run dev`: Avvia webapp + server in parallelo
- `bun run build`: Builda tutti i pacchetti
- `bun run build:components`: Builda solo la libreria
- `bun run build:webapp`: Builda solo l'app web

---

## Tipi di Grafici Supportati

### 1. BasicChart (bar/line)

- Grafici a barre e linee
- Supporto serie multiple
- Stack opzionale
- Zoom e pan
- Area chart opzionale
- Smooth curves

### 2. PieChart

- Grafici a torta
- Labels personalizzabili
- Tooltip formattabili
- Legenda configurabile

### 3. GeoMapChart

- Mappe geografiche con GeoJSON
- Visualizzazione dati su regioni geografiche
- Colori basati su valori
- Labels mappa opzionali

### 4. ClusterMap

- Mappe a cluster di punti
- Marker interattivi
- Clustering automatico

### 5. KPI Group

- Indicatori chiave di performance
- Valori con percentuali
- Indicatori di trend (flow)
- Colori personalizzabili

### 6. DataTable

- Tabelle dati interattive
- Ordinamento colonne
- Filtri
- Esportazione CSV
- Visibilità colonne configurabile

---

## Configurazione e Deploy

### Variabili d'Ambiente Server

- `HOST`: Host del server
- `PORT`: Porta server (default: 3003)
- `DOMAINS`: Domini CORS consentiti (comma-separated)
- `UPLOAD_SIZE_LIMIT`: Limite upload (default: 15mb)
- `ROUTES_PREFIX`: Prefisso route API
- `APP_URL`: URL applicazione frontend
- `DATABASE_URL`: Connection string PostgreSQL (per Prisma)
- `BUILD_SHA`: SHA del commit (iniettato a build time, visibile in healthcheck)
- `BUILD_TIME`: Timestamp della build (iniettato a build time, visibile in healthcheck)

### Docker

- `packages/server/Dockerfile`: Immagine Docker per server
- `packages/server/Dockerfile.app`: Immagine alternativa ottimizzata
- `packages/webapp/Dockerfile`: Immagine Docker per webapp

### Helm Chart

Il progetto include un Helm chart per il deployment su Kubernetes in `charts/graph-italia/`.

#### Struttura Deployment

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Namespace: graph-italia"
            Ingress[Ingress<br/>nginx] --> Webapp[Webapp<br/>nginx + React]
            Ingress --> Server[Server<br/>Bun + Hono]
            Server --> DB[(PostgreSQL<br/>Azure)]

            subgraph "Helm Hooks"
                Migration[Job: db-migration<br/>prisma migrate deploy]
                Seed[Job: db-seed<br/>seed-users.ts]
            end

            Migration -.->|pre-upgrade| Server
            Seed -.->|pre-upgrade| Server
        end
    end

    CI[GitHub Actions] -->|helm upgrade| Ingress
```

#### Componenti Helm

| Componente          | Descrizione                           |
| ------------------- | ------------------------------------- |
| `webapp-deployment` | Frontend React servito da nginx       |
| `server-deployment` | Backend API Bun/Hono                  |
| `db-migration-job`  | Hook pre-upgrade per migration Prisma |
| `db-seed-job`       | Hook pre-upgrade per seeding utenti   |
| `ingress`           | Routing HTTP/HTTPS con cert-manager   |

### Database Setup

#### Sviluppo Locale

1. Configurare connection string PostgreSQL in `.env`:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/graph-italia"
   ```

2. Applicare schema al database:

   ```bash
   cd packages/server
   bunx prisma migrate deploy
   ```

3. (Opzionale) Seed utenti di test:
   ```bash
   bun run seeds/seed-users.ts
   ```

#### Deployment Kubernetes (Helm)

Il database viene configurato automaticamente tramite Helm hooks:

```mermaid
sequenceDiagram
    participant Helm
    participant Migration as db-migration Job
    participant Seed as db-seed Job
    participant Server as Server Pod
    participant DB as PostgreSQL

    Helm->>Migration: pre-upgrade hook (weight: -5)
    Migration->>DB: prisma migrate deploy
    DB-->>Migration: Schema synced
    Migration-->>Helm: Job completed

    Helm->>Seed: pre-upgrade hook (weight: 0)
    Seed->>DB: Check/create users
    DB-->>Seed: Users ready
    Seed-->>Helm: Job completed

    Helm->>Server: Deploy new pods
    Server->>DB: Connect & serve
```

**Configurazione utenti in `values.yaml`:**

```yaml
dbMigration:
  enabled: true
  mode: migrateDeploy
  allowLegacyDbPushFallback: false
  legacySchemaAutoMigrate: true
  acceptDataLoss: false # Solo per fallback legacy con db push

dbSeed:
  enabled: true
  users:
    # Crea nuovo utente (skip se email esiste già)
    - email: "admin@example.com"
      password: "SecurePassword123!"
      verified: true
      role: "ADMIN"

    # Aggiorna utente esistente (richiede id)
    - id: "existing-user-id"
      email: "updated@example.com"
      password: "NewPassword!"
      verified: true
```

**Primo deployment:**

```bash
# Installazione iniziale con migration e seed
helm upgrade --install graph-italia oci://ghcr.io/italia/charts/graph-italia \
  -n graph-italia -f values.yaml
```

**Deployment successivi:**

```bash
# Solo aggiornamento immagini (migration idempotente)
helm upgrade graph-italia oci://ghcr.io/italia/charts/graph-italia \
  -n graph-italia -f values.yaml
```

### Gestione Utenti

#### Creazione Utenti via Helm

Gli utenti vengono creati/aggiornati automaticamente dal seed job durante il deployment:

```yaml
# values.yaml
dbSeed:
  enabled: true
  users:
    - email: "admin@example.com"
      password: "password"
      verified: true
      role: "ADMIN"
```

#### Registrazione Self-Service

Gli utenti possono registrarsi autonomamente tramite l'interfaccia web:

1. Accedere a `/register`
2. Inserire email e password
3. Ricevere email di verifica (via Resend)
4. Cliccare link di verifica
5. Account attivato

**Requisiti per email:**

- Configurare `RESEND_API_KEY` con chiave valida
- Configurare `SENDER_EMAIL` con dominio verificato su Resend (es. `noreply@graph-italia.example.com`)

---

## GitFlow e Branching Strategy

Il progetto utilizza un workflow Git basato su due branch principali con feature branches per lo sviluppo.

### Flusso di Lavoro

```mermaid
gitGraph
    commit id: "initial"
    branch develop
    checkout main
    commit id: "v1.0.0" tag: "v1.0.0"

    checkout main
    branch feature/nuova-funzionalita
    commit id: "feat: add new component"
    commit id: "feat: add tests"

    checkout develop
    merge feature/nuova-funzionalita id: "merge to develop" type: HIGHLIGHT
    commit id: "test in staging"

    checkout main
    merge develop id: "release to prod" type: HIGHLIGHT
    commit id: "v1.1.0" tag: "v1.1.0"
```

### Branch Principali

| Branch    | Ambiente         | Descrizione                                                                |
| --------- | ---------------- | -------------------------------------------------------------------------- |
| `main`    | **Production**   | Branch stabile, deploy in produzione solo tramite tag semantici (`v*.*.*`) |
| `develop` | **Test/Staging** | Branch di integrazione, deploy automatico su ambiente di test              |

### Workflow per Nuove Funzionalità

```mermaid
flowchart LR
    subgraph "1️⃣ Sviluppo"
        A[Crea feature branch<br/>da main] --> B[Sviluppa la<br/>funzionalità]
        B --> C[Commit e push]
    end

    subgraph "2️⃣ Testing"
        C --> D[Merge in develop]
        D --> E[Deploy automatico<br/>su graph-italia-test]
        E --> F{Test OK?}
    end

    subgraph "3️⃣ Produzione"
        F -->|Sì| G[Merge in main]
        G --> H[Crea tag v*.*.*]
        H --> I[Deploy automatico<br/>su graph-italia]
    end

    F -->|No| B
```

### Istruzioni Operative

#### 1. Creare una nuova feature

```bash
# Parti sempre da main aggiornato
git checkout main
git pull origin main

# Crea il feature branch
git checkout -b feature/nome-funzionalita
```

#### 2. Sviluppare e testare localmente

```bash
# Sviluppa la funzionalità
# ... modifiche al codice ...

# Commit delle modifiche
git add .
git commit -m "feat: descrizione della funzionalità"

# Push del branch
git push -u origin feature/nome-funzionalita
```

#### 3. Deploy su ambiente di Test

```bash
# Merge in develop per il deploy su staging
git checkout develop
git pull origin develop
git merge feature/nome-funzionalita
git push origin develop

# ✅ CI/CD deploya automaticamente su graph-italia-test
# URL: https://graph-test.developers.italia.it
```

#### 4. Promuovere in Produzione

Dopo aver verificato che tutto funziona su staging:

```bash
# Merge in main
git checkout main
git pull origin main
git merge develop  # oppure: git merge feature/nome-funzionalita
git push origin main

# ⚠️ Il push su main NON deploya automaticamente in produzione
# È necessario creare un tag per il deploy (vedi step 5)
```

#### 5. Creare un Tag di Release (obbligatorio per deploy in prod)

Il deploy in produzione avviene **solo** tramite tag semantici:

```bash
git checkout main
git tag -a v1.2.0 -m "Release 1.2.0: descrizione"
git push origin v1.2.0

# ✅ CI/CD deploya automaticamente su graph-italia (produzione)
# URL: https://graph.developers.italia.it
#
# Il tag triggera:
# - Build immagini Docker con versione 1.2.0
# - Package Helm chart con versione 1.2.0
# - Deploy automatico in produzione
```

### Flusso CI/CD Completo

```mermaid
flowchart TB
    subgraph "Developer"
        Dev[Push su branch]
    end

    subgraph "GitHub Actions"
        PR{È una PR?}
        Branch{Quale branch/tag?}

        Build[🏗️ Build Images<br/>webapp + server]
        Helm[📦 Package Helm]

        DeployTest[🧪 Deploy Test<br/>graph-italia-test]
        DeployProd[🚀 Deploy Prod<br/>graph-italia]
    end

    subgraph "Kubernetes"
        Test[graph-italia-test<br/>namespace]
        Prod[graph-italia<br/>namespace]
    end

    Dev --> PR
    PR -->|Sì| Build
    Build -->|Solo build| End[Fine]

    PR -->|No| Branch
    Branch -->|develop| Build
    Branch -->|main| Build
    Branch -->|tag v*| Build

    Build --> Helm

    Helm -->|develop| DeployTest
    Helm -->|tag v*| DeployProd

    DeployTest --> Test
    DeployProd --> Prod
```

### Riepilogo Deploy Automatici

| Evento            | Ambiente Target      | Versione                       |
| ----------------- | -------------------- | ------------------------------ |
| Push su `develop` | graph-italia-test    | `0.0.0-dev.<sha>`              |
| Push su `main`    | Nessuno (solo build) | `0.0.0-main.<sha>`             |
| Tag `v*.*.*`      | graph-italia (prod)  | Versione dal tag (es. `1.2.0`) |
| Pull Request      | Nessuno              | Solo build di verifica         |

> **Nota**: Il deploy in produzione richiede sempre un tag semantico. I push su `main` eseguono solo la build per verificare che il codice sia pronto per il rilascio.

---

## CI/CD e Build

### CI/CD Implementato

Il progetto utilizza **GitHub Actions** per l'integrazione continua e il deployment. I workflow sono configurati nella directory `.github/workflows/`.

#### Workflow CI (`.github/workflows/ci.yml`)

Eseguito automaticamente su:

- Push su branch `main`
- Pull Request

**Processo CI**:

```mermaid
graph LR
    Trigger[Push/PR] --> Checkout[Checkout Code]
    Checkout --> SetupBun[Setup Bun 1.1.27]
    SetupBun --> Install[Install Dependencies<br/>bun install --frozen-lockfile]
    Install --> Build[Build All Packages<br/>bun run build]
    Build --> Result{Success?}
    Result -->|Sì| Pass[CI Passed]
    Result -->|No| Fail[CI Failed]
```

**Steps**:

1. Checkout del codice sorgente
2. Setup Bun runtime (versione 1.1.27)
3. Installazione dipendenze con lockfile frozen
4. Build di tutti i pacchetti (`bun run build`)

#### Workflow Release (`.github/workflows/release.yml`)

Eseguito su:

- Push su branch `main` o `develop`
- Tag con pattern `v*` (es. `v1.0.0`)
- Pull Request su `main` (solo build, no push)

**Processo Release Completo**:

```mermaid
flowchart TB
    subgraph Trigger
        Push[Push main/develop]
        Tag[Tag v*]
        PR[Pull Request]
    end

    subgraph Prepare["📋 Prepare"]
        Version[Generate Version<br/>0.0.0-dev.SHA / 1.2.0]
    end

    subgraph Build["🏗️ Build Images"]
        direction LR
        BuildServer[Build Server<br/>Dockerfile.app]
        BuildWebapp[Build Webapp<br/>Dockerfile]
    end

    subgraph Package["📦 Package Helm"]
        HelmPkg[helm package]
        HelmPush[helm push OCI]
    end

    subgraph Deploy["🚀 Deploy"]
        DeployTest[Deploy Test<br/>graph-italia-test namespace]
        DeployProd[Deploy Production<br/>graph-italia namespace]
    end

    Push --> Prepare
    Tag --> Prepare
    PR --> Prepare

    Prepare --> Build
    Build --> Package

    Package -->|develop| DeployTest
    Package -->|tag v*| DeployProd

    BuildServer --> GHCR1[ghcr.io/italia/graph-italia-srv]
    BuildWebapp --> GHCR2[ghcr.io/italia/graph-italia-webapp]
    HelmPush --> GHCR3[ghcr.io/italia/charts/graph-italia]
```

**Jobs del Workflow**:

| Job                 | Descrizione                  | Trigger           |
| ------------------- | ---------------------------- | ----------------- |
| `prepare`           | Genera versione semantica    | Sempre            |
| `build-images`      | Build Docker server + webapp | Sempre            |
| `package-helm`      | Package e push Helm chart    | Non PR            |
| `deploy-test`       | Deploy su graph-italia-test  | Solo develop      |
| `deploy-production` | Deploy su graph-italia       | Solo tag `v*.*.*` |

**Versioning**:

- Branch `develop`: `0.0.0-dev.<short-sha>`
- Branch `main`: `0.0.0-main.<short-sha>` (solo build, no deploy)
- Tag `v1.2.3`: `1.2.3`

**Artefatti Prodotti**:

- `ghcr.io/italia/graph-italia-srv:<version>`
- `ghcr.io/italia/graph-italia-webapp:<version>`
- `ghcr.io/italia/charts/graph-italia:<version>`

#### Workflow Pullfrog (`.github/workflows/pullfrog.yml`)

Workflow per automazione AI-assisted tramite Pullfrog:

- Eseguibile manualmente (`workflow_dispatch`)
- Richiede `ANTHROPIC_API_KEY` come secret
- Utilizzato per automazioni guidate da AI

### Composizione della Build

#### Build Process Overview

```mermaid
graph TB
    Start[Start Build] --> Root[Root Package.json]
    Root -->|bun run build| Filter[Filter All Packages]

    Filter --> BuildComponents[Build Components<br/>rollup -c]
    Filter --> BuildWebapp[Build Webapp<br/>tsc && vite build]
    Filter --> BuildServer[Build Server<br/>TypeScript Check]

    BuildComponents --> ComponentsOutput[dist/index.js<br/>dist/index.esm.js<br/>dist/types/]
    BuildWebapp --> WebappOutput[dist/ static files]
    BuildServer --> ServerOutput[TypeScript Compiled]

    ComponentsOutput --> Docker[Optional: Docker Build]
    WebappOutput --> Docker
    ServerOutput --> Docker
```

#### 1. Build Components (`packages/components`)

**Script**: `rollup -c`

**Processo**:

- Input: `src/index.ts`
- Output:
  - `dist/index.js` (CommonJS format)
  - `dist/index.esm.js` (ESM format)
  - `dist/types/index.d.ts` (TypeScript definitions)
  - `dist/style.css` (CSS minificato)

**Configurazione Rollup**:

- Plugin TypeScript per compilazione
- Plugin CSS per importazione e minificazione CSS
- External peer dependencies (non bundle)
- Source maps abilitati

**Comando**:

```bash
bun run build:components
# o
cd packages/components && npm run build
```

#### 2. Build Webapp (`packages/webapp`)

**Script**: `tsc && vite build`

**Processo**:

1. **TypeScript Compilation**: Verifica tipi e compila (`tsc`)
2. **Vite Build**:
   - Bundle React app
   - Minificazione e ottimizzazione
   - Code splitting automatico
   - Asset optimization (CSS, immagini)

**Output**:

- `dist/` directory con:
  - `index.html`
  - `assets/` (JS, CSS bundle)
  - Static files da `public/`

**Comando**:

```bash
bun run build:webapp
# o
cd packages/webapp && npm run build
```

#### 3. Build Server (`packages/server`)

**Script**: Nessun build esplicito (runtime TypeScript con Bun)

**Processo**:

- Bun esegue direttamente TypeScript (`bun index.ts`)
- Prisma Client viene generato: `npx prisma generate`
- Nessuna compilazione necessaria (Bun runtime)

**Docker Build**:
Il server viene buildato in Docker usando multi-stage build:

```mermaid
graph LR
    Base[Base: bun-node] --> Install[Install: Install Deps]
    Install --> Prerelease[Prerelease: Copy Files]
    Prerelease --> Release[Release: Final Image]
    Release --> Run[Run: bun index.ts]
```

**Stages Dockerfile.app**:

1. **BASE**: Immagine base `oven/bun:1.3.1` con Node.js
2. **INSTALL**: Installazione dipendenze in cache
3. **PRERELEASE**: Copia file applicazione e node_modules
4. **RELEASE**: Immagine finale ottimizzata

#### Build Completa Monorepo

**Comando root**:

```bash
bun run build
```

Esegue `bun run --filter '*' build` che:

- Identifica tutti i pacchetti con script `build`
- Esegue build in ordine di dipendenze
- Components viene buildato prima di Webapp (dipendenza workspace)

**Ordine di Build**:

1. `packages/components` (nessuna dipendenza interna)
2. `packages/webapp` (dipende da components)
3. `packages/server` (indipendente)
4. `packages/ui-example-app` (dipende da components)

### Test Applicativi

**Stato Attuale**: ❌ **Nessun test implementato**

Il progetto **non include** framework di testing configurati:

- ❌ Nessun test unitario
- ❌ Nessun test di integrazione
- ❌ Nessun test end-to-end
- ❌ Nessun framework configurato (Jest, Vitest, Playwright, Cypress)

**Evidenze**:

- Nessun file `.test.ts`, `.spec.ts` nel codebase
- Nessuna configurazione Jest/Vitest nei `package.json`
- Rollup config esclude pattern di test (`**/__tests__/**`, `**/*.test.tsx`) ma non esistono
- CI workflow esegue solo build, non test

**Raccomandazioni per Implementazione Futura**:

1. **Test Unitari** (Components):
   - Framework: Vitest o Jest
   - Target: Componenti React isolati
   - Libreria: React Testing Library

2. **Test API** (Server):
   - Framework: Vitest o Jest
   - Target: Route Hono, middleware, logica business
   - Libreria: Supertest per HTTP testing

3. **Test E2E** (Webapp):
   - Framework: Playwright o Cypress
   - Target: Flussi utente completi

4. **Test di Integrazione**:
   - Test database con Prisma
   - Test autenticazione end-to-end

### Sicurezza CI/CD

- **GitGuardian**: Configurato (`.gitguardian.yaml`) per scansione segreti nel codice
- **Secrets Management**: Utilizzo GitHub Secrets per:
  - `GITHUB_TOKEN` (per push Docker images e Helm charts)
  - `ANTHROPIC_API_KEY` (per Pullfrog workflow)
  - `KUBE_CONFIG` (per deploy su Kubernetes)

### Deployment Environments

```mermaid
graph LR
    subgraph "GitHub Actions"
        CI[CI/CD Pipeline]
    end

    subgraph "Kubernetes Cluster"
        subgraph "Test Environment"
            TestNS[graph-italia-test namespace]
            TestDB[(Azure PostgreSQL)]
        end

        subgraph "Production Environment"
            ProdNS[graph-italia namespace]
            ProdDB[(Azure PostgreSQL)]
        end
    end

    CI -->|develop push| TestNS
    CI -->|tag v*| ProdNS
    TestNS --> TestDB
    ProdNS --> ProdDB
```

| Environment | Namespace           | Database         | Trigger           | URL                               |
| ----------- | ------------------- | ---------------- | ----------------- | --------------------------------- |
| Test        | `graph-italia-test` | Azure PostgreSQL | Push su `develop` | `graph-test.developers.italia.it` |
| Production  | `graph-italia`      | Azure PostgreSQL | Tag `v*.*.*`      | `graph.developers.italia.it`      |

### Monitoring & Alerting

Il progetto include un sistema completo di monitoring basato su Prometheus, Grafana e Alertmanager.

#### Metriche Esposte

Il server espone metriche Prometheus su `/metrics`:

| Metrica                                    | Tipo      | Descrizione                             |
| ------------------------------------------ | --------- | --------------------------------------- |
| `http_requests_total`                      | Counter   | Richieste HTTP per method, path, status |
| `http_request_duration_seconds`            | Histogram | Latenza richieste HTTP                  |
| `graph_italia_db_queries_total`            | Counter   | Query database per operation, status    |
| `graph_italia_db_query_duration_seconds`   | Histogram | Latenza query database                  |
| `graph_italia_ai_requests_total`           | Counter   | Richieste OpenAI per status             |
| `graph_italia_ai_request_duration_seconds` | Histogram | Latenza richieste OpenAI                |

#### Dashboard Grafana

La dashboard è disponibile in `charts/graph-italia/dashboards/graph-italia-dashboard.json`.

**Importazione manuale**:

1. Grafana → Dashboards → Import
2. Upload `graph-italia-dashboard.json`
3. Selezionare datasource Prometheus e Loki

**Sezioni della dashboard**:

- Overview (requests/s, error rate, latency, pods)
- HTTP Traffic (requests by status, latency percentiles)
- Database (query latency, queries by operation)
- AI/OpenAI (request latency, success/error)
- Resources (CPU, Memory)
- Ingress & WAF (ModSecurity events)
- Logs (backend logs, errors & warnings)

#### Alert Rules

Gli alert sono definiti in `charts/graph-italia/templates/prometheusrule.yaml`:

| Alert                       | Condizione                                          | Severità |
| --------------------------- | --------------------------------------------------- | -------- |
| `GraphItaliaDown`           | Nessun pod running per 2 min                        | Critical |
| `GraphItaliaHighErrorRate`  | 5xx > 10% per 5 min                                 | Critical |
| `GraphItaliaDatabaseErrors` | Errori DB > 0.5/s per 3 min                         | Critical |
| `GraphItaliaCrashLooping`   | > 5 restart in 30 min                               | Critical |
| `GraphItaliaHighWAFBlocks`  | 4xx > 30% **e** > 5 req/s (solo prod ns) per 10 min | Warning  |
| `GraphItaliaUnresponsive`   | p95 latency > 30s                                   | Critical |
| `GraphItaliaOutOfMemory`    | Memory > 95% per 5 min                              | Critical |

#### Configurazione Email Alerting

Per ricevere notifiche email, configurare nei values:

```yaml
monitoring:
  serviceMonitor:
    enabled: true
    labels:
      release: kube-prometheus-stack
  prometheusRule:
    enabled: true
    labels:
      release: kube-prometheus-stack
  alertmanagerConfig:
    enabled: true
    emailTo: "team@example.com, ops@example.com"
    # Opzionali (hanno default):
    # emailFrom: "TBD@italia.it"
    # smarthost: "smtp.eu.mailgun.org:587"
    # authUsername: "TBD@italia.it"
    # authPasswordSecret: "alertmanager-smtp-secret"
```

---

## Architettura e Pattern

### Design Patterns Utilizzati

1. **Component Library Pattern**: Separazione libreria componenti riutilizzabili
2. **Monorepo Pattern**: Gestione multipli pacchetti correlati
3. **API-First**: Backend RESTful separato dal frontend
4. **State Machine Pattern**: XState per flussi complessi
5. **Workspace Dependencies**: Dipendenze interne tramite workspace protocol

### Best Practices

- **TypeScript**: Tipizzazione forte in tutto il progetto
- **Peer Dependencies**: Evita duplicazione dipendenze
- **Modularità**: Separazione chiara tra componenti, server, app
- **Validazione**: Zod per validazione input API
- **Sicurezza**: JWT, bcrypt, helmet, CORS
- **Error Handling**: Middleware centralizzato per errori

---

## Tecnologie Chiave

| Categoria    | Tecnologie                       |
| ------------ | -------------------------------- |
| **Runtime**  | Bun                              |
| **Frontend** | React 19, TypeScript, Vite       |
| **Backend**  | Hono, Bun, TypeScript            |
| **Database** | PostgreSQL, Prisma ORM           |
| **Charts**   | ECharts 5                        |
| **Maps**     | OpenLayers 10                    |
| **Styling**  | TailwindCSS, DaisyUI             |
| **State**    | Zustand, XState                  |
| **Build**    | Rollup (components), Vite (apps) |
| **Auth**     | JWT, bcrypt                      |
| **Email**    | Resend                           |
| **AI**       | OpenAI API                       |

---

## Troubleshooting

### Gestione Utenti via kubectl

Se hai bisogno di creare o verificare utenti manualmente senza passare dal seed job, puoi usare `kubectl exec` per accedere direttamente al database.

#### Verificare utenti esistenti

```bash
kubectl run -n graph-italia db-check --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "SELECT id, email, role, verified FROM \"User\";"
```

#### Creare un nuovo utente

Prima genera l'hash della password:

```bash
kubectl exec -n graph-italia deployment/graph-italia-server -- \
  bun -e "const {hash} = require('bcrypt'); hash('PASSWORD', 10).then(console.log)"
```

Poi crea l'utente:

```bash
kubectl run -n graph-italia db-create-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "INSERT INTO \"User\" (id, email, password, verified, role, \"createdAt\", \"updatedAt\")
      VALUES ('user-001', 'email@example.com', '\$2b\$10\$HASH...', true, 'USER', NOW(), NOW());"
```

#### Verificare/Approvare un utente esistente

```bash
kubectl run -n graph-italia db-verify-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "UPDATE \"User\" SET verified = true WHERE email = 'email@example.com';"
```

#### Promuovere utente ad ADMIN

```bash
kubectl run -n graph-italia db-promote-admin --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'email@example.com';"
```

#### Eliminare un utente

```bash
kubectl run -n graph-italia db-delete-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "DELETE FROM \"User\" WHERE email = 'email@example.com';"
```

> **Nota**: Sostituisci `$DATABASE_URL` con la connection string del database o esportala come variabile d'ambiente. Per production, recupera la connection string dal `values.yaml` o dai secrets Kubernetes.

### Problemi Comuni

| Problema                                 | Soluzione                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| Utente non riceve email di verifica      | Verificare `RESEND_API_KEY` e `SENDER_EMAIL` nel deployment                     |
| Login fallisce con "Invalid credentials" | Verificare che l'utente sia `verified = true`                                   |
| Migration job fallisce                   | Controllare i logs con `kubectl logs -n graph-italia -l component=db-migration` |
| Seed job fallisce                        | Controllare i logs con `kubectl logs -n graph-italia -l component=db-seed`      |

---

## Conclusioni

Il progetto **Graph Italia** è un sistema completo e modulare per la creazione e gestione di visualizzazioni dati. La struttura monorepo permette:

1. **Riutilizzo**: Componenti React pubblicabili come libreria npm
2. **Separazione**: Backend e frontend completamente separati
3. **Scalabilità**: Facile aggiungere nuovi pacchetti o funzionalità
4. **Manutenibilità**: Codice organizzato e tipizzato

Il sistema supporta un workflow completo: dall'upload dati, alla configurazione grafici, al salvataggio e pubblicazione, fino alla creazione di dashboard complesse.

---

## License

Copyright© 2023-present - Presidenza del Consiglio dei Ministri

The source code is released under the GNU Affero General Public License (SPDX code: AGPL-3.0-only)
