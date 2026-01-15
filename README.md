# Dataviz

**Dataviz** è una piattaforma completa per la creazione, gestione e visualizzazione di grafici e dashboard interattive. Il sistema permette agli utenti di trasformare dati grezzi (CSV, URL remoti, o dati generati) in visualizzazioni professionali e interattive, con la possibilità di salvare, pubblicare e condividere i propri grafici.

## A cosa serve questa applicazione?

**Dataviz** è progettato per semplificare il processo di creazione di visualizzazioni dati, rendendolo accessibile sia a utenti tecnici che non tecnici. Le principali funzionalità includono:

- **Creazione Grafici**: Upload dati CSV o caricamento da URL remoti, selezione del tipo di grafico più appropriato (barre, linee, torta, mappe geografiche, KPI), e personalizzazione completa di colori, legende e stili
- **Dashboard Interattive**: Creazione di dashboard personalizzate con layout drag-and-drop, combinando multipli grafici in un'unica vista
- **Pubblicazione e Condivisione**: Pubblicazione pubblica di grafici e dashboard con URL dedicati per la condivisione o l'embed in altri siti web
- **Persistenza e Gestione**: Salvataggio di grafici e dashboard nel database per accesso futuro e modifica
- **Autenticazione Utenti**: Sistema di autenticazione completo con registrazione, verifica email e gestione password
- **Suggerimenti AI**: Integrazione con OpenAI per suggerimenti automatici nella creazione di grafici

Il progetto è strutturato come **monorepo** per massimizzare la riusabilità dei componenti: la libreria React può essere utilizzata indipendentemente, mentre l'applicazione web completa offre un'interfaccia utente completa per tutte le funzionalità.

**Dataviz** è sviluppato principalmente con **TypeScript**, **React**, e utilizza **Bun** come runtime e package manager.

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
Libreria npm pubblicabile (`dataviz-components`) che fornisce componenti React per la visualizzazione di dati.

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
- React, React-DOM
- ECharts, echarts-for-react
- OpenLayers
- dayjs
- react-error-boundary
- react-markdown

### Integrazione
I pacchetti interni (`webapp` e `ui-example-app`) utilizzano il componente tramite:
```json
"dataviz-components": "workspace:*"
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

### Modelli Database (Prisma Schema)

```mermaid
erDiagram
    User ||--o{ Chart : "crea"
    User ||--o{ Dashboard : "crea"
    User ||--o{ DataSource : "crea"
    User ||--o{ Code : "ha"
    
    Dashboard ||--o{ Slot : "contiene"
    Chart ||--o{ Slot : "usato_in"
    Chart ||--o{ SourceLink : "collegato_a"
    DataSource ||--o{ SourceLink : "collegato_a"
    
    User {
        string id PK
        string email UK
        string password
        boolean verifyed
        Role role
        datetime createdAt
        datetime updatedAt
    }
    
    Chart {
        string id PK
        string userId FK
        string name
        string description
        string chart
        json config
        json data
        boolean publish
        string remoteUrl
        boolean isRemote
        string preview
        datetime createdAt
        datetime updatedAt
    }
    
    Dashboard {
        string id PK
        string userId FK
        string name
        string description
        boolean publish
        datetime createdAt
        datetime updatedAt
    }
    
    Slot {
        string dashboardId PK,FK
        string chartId PK,FK
        json settings
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    DataSource {
        string id PK
        string userId FK
        string name
        string description
        json data
        json rules
        boolean publish
        boolean isTrasposed
        string remoteUrl
        boolean isRemote
        datetime createdAt
        datetime updatedAt
    }
    
    Code {
        string id PK
        string userId FK
        string code
        int expire
        datetime createdAt
        datetime updatedAt
    }
    
    SourceLink {
        string dataSourceId PK,FK
        string chartId PK,FK
        json config
        datetime createdAt
        datetime updatedAt
    }
```

#### Ruoli Utente

Il sistema supporta due ruoli:
- **`USER`**: Utente standard (default)
- **`ADMIN`**: Amministratore con privilegi estesi

#### Descrizione Modelli

- **`User`**: Gestione utenti con autenticazione email/password, verifica account tramite codici PIN, ruolo assegnabile
- **`Chart`**: Configurazione grafici (tipo, dati, configurazione), supporto per dati remoti, pubblicazione pubblica, preview come immagine
- **`Dashboard`**: Raccolta di grafici organizzati in "slots", pubblicazione pubblica, layout personalizzabile
- **`DataSource`**: Fonti dati riutilizzabili, supporto per dati remoti, trasposizione dati
- **`Slot`**: Collegamento tra Dashboard e Chart con configurazioni personalizzate per ogni slot
- **`Code`**: Codici PIN temporanei per verifica account e reset password
- **`SourceLink`**: Collegamento tra Chart e DataSource con configurazioni specifiche

### API Routes

#### `/auth`
- `POST /register` - Registrazione nuovo utente
- `POST /login` - Login con JWT cookie
- `POST /recover` - Richiesta reset password
- `POST /verify` - Verifica codice PIN
- `GET /user` - Info utente corrente
- `GET /logout` - Logout

#### `/charts`
- `GET /` - Lista charts dell'utente
- `GET /:id` - Dettaglio chart
- `GET /show/:id` - Visualizzazione pubblica (se pubblicato)
- `POST /` - Crea nuovo chart
- `PUT /:id` - Aggiorna chart
- `DELETE /:id` - Elimina chart
- `POST /publish/:id` - Pubblica/nascondi chart

#### `/dashboards`
- `GET /` - Lista dashboards dell'utente
- `GET /:id` - Dettaglio dashboard con slots
- `POST /` - Crea nuovo dashboard
- `PUT /:id` - Aggiorna dashboard
- `PUT /:id/slots` - Aggiorna slots del dashboard
- `DELETE /:id` - Elimina dashboard

#### `/hints`
- `POST /` - Suggerimenti AI per creazione grafici (richiede OpenAI)

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
- **Dipendenze**: Usa `dataviz-components` come workspace dependency

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
   - Upload CSV
   - Caricamento da URL remoto
   - Generazione dati randomici
   - Trasformazione dati

2. **Configurazione**:
   - Selezione tipo grafico (bar, line, pie, map, kpi)
   - Personalizzazione colori/palette
   - Configurazione legende, tooltip, labels
   - Opzioni responsive

3. **Salvataggio**:
   - Salvataggio nel database
   - Pubblicazione pubblica
   - Generazione preview immagine

#### Dashboard
- Creazione dashboard con layout drag-and-drop
- Aggiunta multipli grafici (slots)
- Personalizzazione posizione e dimensione
- Visualizzazione pubblica e embed

#### Autenticazione
- Registrazione con verifica email
- Login/logout
- Reset password
- Protezione route con `ProtectedRoute`

#### Visualizzazione Pubblica
- Pagine `/charts/:id/view` e `/dashboards/:id/view` per visualizzazione pubblica
- Pagine `/charts/:id/embed` e `/dashboards/:id/embed` per embed esterno

#### Utility Pages
- `/load-data`: Caricamento dati da CSV/URL
- `/generate-data`: Generazione dati di esempio
- `/geo`: Utility per mappe geografiche

### State Management

#### Store Zustand
- `storeState.ts`: Stato globale per chart corrente
- `chartListStore.ts`: Lista charts salvati
- `dashboard-edit.store.ts`: Stato editing dashboard
- `dashboard-view.store.ts`: Stato visualizzazione dashboard
- `user_store.ts`: Stato utente

#### XState Machine
- `stepMachine.ts`: Macchina a stati per il flusso di creazione chart

```mermaid
stateDiagram-v2
    [*] --> idle: Inizializzazione
    idle --> input: Crea nuovo chart
    input --> config: Dati caricati
    config --> done: Configurazione completata
    done --> idle: Salvataggio completato
    config --> input: Reset dati
    done --> config: Modifica configurazione
```

### Routing
Router configurato con React Router v6:
- Route pubbliche: `/`, `/charts/:id/view`, `/dashboards/:id/view`
- Route protette: `/home`, `/charts/:id/edit`, `/dashboards`
- Route auth: `/login`, `/register`, `/verify/:uid`, `/recover-password`

---

## 4. Packages/UI-Example-App - App di Esempio

### Descrizione
Applicazione React minimalista per dimostrare l'uso dei componenti `dataviz-components`.

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
Usa `dataviz-components` tramite link locale:
```json
"dataviz-components": "link:dataviz-components"
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
   "dataviz-components": "workspace:*"
   ```
   - Webapp importa e usa i componenti React dalla libreria
   - Build separata: components viene buildato prima di webapp

2. **UI-Example-App → Components**:
   ```json
   "dataviz-components": "link:dataviz-components"
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
- Database PostgreSQL connection string (per Prisma)

### Docker
- `packages/server/Dockerfile`: Immagine Docker per server
- `packages/server/Dockerfile.app`: Immagine alternativa ottimizzata
- `packages/webapp/Dockerfile`: Immagine Docker per webapp

### Helm Chart

Il progetto include un Helm chart per il deployment su Kubernetes in `charts/dataviz/`.

#### Struttura Deployment

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Namespace: dataviz"
            Ingress[Ingress<br/>nginx] --> Webapp[Webapp<br/>nginx + React]
            Ingress --> Server[Server<br/>Bun + Hono]
            Server --> DB[(PostgreSQL<br/>Azure)]
            
            subgraph "Helm Hooks"
                Migration[Job: db-migration<br/>prisma db push]
                Seed[Job: db-seed<br/>seed-users.ts]
            end
            
            Migration -.->|pre-upgrade| Server
            Seed -.->|pre-upgrade| Server
        end
    end
    
    CI[GitHub Actions] -->|helm upgrade| Ingress
```

#### Componenti Helm

| Componente | Descrizione |
|------------|-------------|
| `webapp-deployment` | Frontend React servito da nginx |
| `server-deployment` | Backend API Bun/Hono |
| `db-migration-job` | Hook pre-upgrade per `prisma db push` |
| `db-seed-job` | Hook pre-upgrade per seeding utenti |
| `ingress` | Routing HTTP/HTTPS con cert-manager |

### Database Setup

#### Sviluppo Locale

1. Configurare connection string PostgreSQL in `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dataviz"
   ```

2. Applicare schema al database:
   ```bash
   cd packages/server
   bunx prisma db push
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
    Migration->>DB: prisma db push
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
  acceptDataLoss: false  # MAI true in produzione!

dbSeed:
  enabled: true
  users:
    # Crea nuovo utente (skip se email esiste già)
    - email: "admin@example.com"
      password: "SecurePassword123!"
      verifyed: true
      role: "ADMIN"
    
    # Aggiorna utente esistente (richiede id)
    - id: "existing-user-id"
      email: "updated@example.com"
      password: "NewPassword!"
      verifyed: true
```

**Primo deployment:**

```bash
# Installazione iniziale con migration e seed
helm upgrade --install dataviz oci://ghcr.io/italia/charts/dataviz \
  -n dataviz -f values.yaml
```

**Deployment successivi:**

```bash
# Solo aggiornamento immagini (migration idempotente)
helm upgrade dataviz oci://ghcr.io/italia/charts/dataviz \
  -n dataviz -f values.yaml
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
      verifyed: true
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
- Configurare `SENDER_EMAIL` con dominio verificato su Resend (es. `noreply@dataviz.example.com`)

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
        Version[Generate Version<br/>0.0.0-test.SHA / v1.0.0]
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
        DeployTest[Deploy Test<br/>dataviz-test namespace]
        DeployProd[Deploy Production<br/>dataviz namespace]
    end
    
    Push --> Prepare
    Tag --> Prepare
    PR --> Prepare
    
    Prepare --> Build
    Build --> Package
    
    Package --> DeployTest
    DeployTest -->|main branch| DeployProd
    
    BuildServer --> GHCR1[ghcr.io/italia/dataviz-srv]
    BuildWebapp --> GHCR2[ghcr.io/italia/dataviz-webapp]
    HelmPush --> GHCR3[ghcr.io/italia/charts/dataviz]
```

**Jobs del Workflow**:

| Job | Descrizione | Trigger |
|-----|-------------|---------|
| `prepare` | Genera versione semantica | Sempre |
| `build-images` | Build Docker server + webapp | Sempre |
| `package-helm` | Package e push Helm chart | Non PR |
| `deploy-test` | Deploy su dataviz-test | Non PR |
| `deploy-production` | Deploy su dataviz | Solo main + non PR |

**Versioning**:
- Branch `develop`: `0.0.0-test.<short-sha>`
- Branch `main`: `0.0.0-test.<short-sha>`
- Tag `v1.2.3`: `1.2.3`

**Artefatti Prodotti**:
- `ghcr.io/italia/dataviz-srv:<version>`
- `ghcr.io/italia/dataviz-webapp:<version>`
- `ghcr.io/italia/charts/dataviz:<version>`

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
            TestNS[dataviz-test namespace]
            TestDB[(Azure PostgreSQL)]
        end
        
        subgraph "Production Environment"
            ProdNS[dataviz namespace]
            ProdDB[(Azure PostgreSQL)]
        end
    end
    
    CI -->|develop/main push| TestNS
    CI -->|main push only| ProdNS
    TestNS --> TestDB
    ProdNS --> ProdDB
```

| Environment | Namespace | Database | Branch | URL |
|-------------|-----------|----------|--------|-----|
| Test | `dataviz-test` | Azure PostgreSQL | develop, main | `dataviz-test.innovazione.gov.it` |
| Production | `dataviz` | Azure PostgreSQL | main | `dataviz.innovazione.gov.it` |

### Monitoring & Alerting

Il progetto include un sistema completo di monitoring basato su Prometheus, Grafana e Alertmanager.

#### Metriche Esposte

Il server espone metriche Prometheus su `/metrics`:

| Metrica | Tipo | Descrizione |
|---------|------|-------------|
| `http_requests_total` | Counter | Richieste HTTP per method, path, status |
| `http_request_duration_seconds` | Histogram | Latenza richieste HTTP |
| `dataviz_db_queries_total` | Counter | Query database per operation, status |
| `dataviz_db_query_duration_seconds` | Histogram | Latenza query database |
| `dataviz_ai_requests_total` | Counter | Richieste OpenAI per status |
| `dataviz_ai_request_duration_seconds` | Histogram | Latenza richieste OpenAI |

#### Dashboard Grafana

La dashboard è disponibile in `charts/dataviz/dashboards/dataviz-dashboard.json`.

**Importazione manuale**:
1. Grafana → Dashboards → Import
2. Upload `dataviz-dashboard.json`
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

Gli alert sono definiti in `charts/dataviz/templates/prometheusrule.yaml`:

| Alert | Condizione | Severità |
|-------|------------|----------|
| `DatavizDown` | Nessun pod running per 2 min | Critical |
| `DatavizHighErrorRate` | 5xx > 10% per 5 min | Critical |
| `DatavizDatabaseErrors` | Errori DB > 0.5/s per 3 min | Critical |
| `DatavizCrashLooping` | > 5 restart in 30 min | Critical |
| `DatavizHighWAFBlocks` | 4xx > 30% per 10 min | Critical |
| `DatavizUnresponsive` | p95 latency > 30s | Critical |
| `DatavizOutOfMemory` | Memory > 95% per 5 min | Critical |

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
    # emailFrom: "dataviz@innovazione.gov.it"
    # smarthost: "smtp.eu.mailgun.org:587"
    # authUsername: "dataviz@innovazione.gov.it"
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

| Categoria | Tecnologie |
|-----------|-----------|
| **Runtime** | Bun |
| **Frontend** | React 19, TypeScript, Vite |
| **Backend** | Hono, Bun, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Charts** | ECharts 5 |
| **Maps** | OpenLayers 10 |
| **Styling** | TailwindCSS, DaisyUI |
| **State** | Zustand, XState |
| **Build** | Rollup (components), Vite (apps) |
| **Auth** | JWT, bcrypt |
| **Email** | Resend |
| **AI** | OpenAI API |

---

## Troubleshooting

### Gestione Utenti via kubectl

Se hai bisogno di creare o verificare utenti manualmente senza passare dal seed job, puoi usare `kubectl exec` per accedere direttamente al database.

#### Verificare utenti esistenti

```bash
kubectl run -n dataviz db-check --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "SELECT id, email, role, verifyed FROM \"User\";"
```

#### Creare un nuovo utente

Prima genera l'hash della password:

```bash
kubectl exec -n dataviz deployment/dataviz-server -- \
  bun -e "const {hash} = require('bcrypt'); hash('PASSWORD', 10).then(console.log)"
```

Poi crea l'utente:

```bash
kubectl run -n dataviz db-create-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "INSERT INTO \"User\" (id, email, password, verifyed, role, \"createdAt\", \"updatedAt\") 
      VALUES ('user-001', 'email@example.com', '\$2b\$10\$HASH...', true, 'USER', NOW(), NOW());"
```

#### Verificare/Approvare un utente esistente

```bash
kubectl run -n dataviz db-verify-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "UPDATE \"User\" SET verifyed = true WHERE email = 'email@example.com';"
```

#### Promuovere utente ad ADMIN

```bash
kubectl run -n dataviz db-promote-admin --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'email@example.com';"
```

#### Eliminare un utente

```bash
kubectl run -n dataviz db-delete-user --rm -it --restart=Never \
  --image=postgres:15-alpine -- \
  psql "$DATABASE_URL" \
  -c "DELETE FROM \"User\" WHERE email = 'email@example.com';"
```

> **Nota**: Sostituisci `$DATABASE_URL` con la connection string del database o esportala come variabile d'ambiente. Per production, recupera la connection string dal `values.yaml` o dai secrets Kubernetes.

### Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| Utente non riceve email di verifica | Verificare `RESEND_API_KEY` e `SENDER_EMAIL` nel deployment |
| Login fallisce con "Invalid credentials" | Verificare che l'utente sia `verifyed = true` |
| Migration job fallisce | Controllare i logs con `kubectl logs -n dataviz -l component=db-migration` |
| Seed job fallisce | Controllare i logs con `kubectl logs -n dataviz -l component=db-seed` |

---

## Conclusioni

Il progetto **Dataviz** è un sistema completo e modulare per la creazione e gestione di visualizzazioni dati. La struttura monorepo permette:

1. **Riutilizzo**: Componenti React pubblicabili come libreria npm
2. **Separazione**: Backend e frontend completamente separati
3. **Scalabilità**: Facile aggiungere nuovi pacchetti o funzionalità
4. **Manutenibilità**: Codice organizzato e tipizzato

Il sistema supporta un workflow completo: dall'upload dati, alla configurazione grafici, al salvataggio e pubblicazione, fino alla creazione di dashboard complesse.

---

## License

Copyright© 2023-present - Presidenza del Consiglio dei Ministri

The source code is released under the BSD license (SPDX code: BSD-3-Clause)
