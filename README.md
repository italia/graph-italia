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
2. **`packages/server`** - Backend API server (Express + Bun)
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
Server Express che gestisce autenticazione, persistenza dati, e API per charts e dashboards.

### Tecnologie
- **Runtime**: Bun
- **Framework**: Express v5.1.0
- **Database**: PostgreSQL con Prisma ORM v7.0.1
- **Autenticazione**: JWT (jsonwebtoken) + bcrypt
- **Email**: Resend (per invio email di attivazione/reset password)
- **AI**: OpenAI (per suggerimenti automatici)

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

#### Descrizione Modelli

- **`User`**: Gestione utenti con autenticazione email/password, verifica account tramite codici PIN
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
    Server[Server<br/>Express + Bun]
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
    Root --> Server[packages/server<br/>Backend API<br/>Express + Bun]
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
- `packages/server/Dockerfile.app`: Immagine alternativa
- `packages/webapp/Dockerfile`: Immagine Docker per webapp

### Database Setup
1. Installare Prisma globalmente: `bun i -g prisma@latest`
2. Configurare connection string PostgreSQL
3. Eseguire: `prisma db push`
4. Seed utenti: `bun seeds/seed-users.ts`

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
- Push su branch `main`
- Tag con pattern `v*` (es. `v1.0.0`)
- Pull Request su `main` (solo build, no push)

**Processo Release**:
```mermaid
graph LR
    Trigger[Tag/Push] --> Checkout[Checkout Code]
    Checkout --> DockerMeta[Generate Docker Tags]
    DockerMeta --> SetupQEMU[Setup QEMU]
    SetupQEMU --> SetupBuildx[Setup Docker Buildx]
    SetupBuildx --> Login[Login to GHCR]
    Login --> BuildPush[Build & Push Docker Image]
    BuildPush --> Image[ghcr.io/teamdigitale/dataviz-srv]
```

**Caratteristiche**:
- Build immagine Docker multi-stage usando `packages/server/Dockerfile.app`
- Push su GitHub Container Registry (`ghcr.io/teamdigitale/dataviz-srv`)
- Tag automatici basati su:
  - Branch name (per branch `main`)
  - Semantic versioning (`v1.0.0`, `v1.0`, `v1`)
- Supporto multi-architettura (linux/amd64)

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
   - Target: Route Express, middleware, logica business
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
  - `GITHUB_TOKEN` (per push Docker images)
  - `ANTHROPIC_API_KEY` (per Pullfrog workflow)

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
| **Backend** | Express, Bun, TypeScript |
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
