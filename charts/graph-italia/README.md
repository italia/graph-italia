# Graph Italia Helm Chart

Helm chart per il deployment dell'applicazione Graph Italia su Kubernetes.

## Panoramica

La chart deploya due componenti principali:
- **Webapp**: applicazione React servita da Nginx
- **Server**: API Hono/Bun con Prisma ORM

Entrambi i componenti supportano:
- Autoscaling orizzontale (HPA)
- Health checks configurabili
- Security context restrittivi (readonly root filesystem)
- Network policies opzionali
- Pod Disruption Budget

## Compatibilità

| Componente | Versione Minima | Note |
|------------|----------------|------|
| Kubernetes | 1.19+ | Testato su 1.24+ |
| Helm | 3.0+ | Richiesto per OCI registry |
| Ingress Controller | - | Nginx Ingress Controller consigliato |

## Architettura Kubernetes

```mermaid
graph TB
    subgraph "Namespace: graph-italia"
        subgraph "Helm Hooks (Pre-upgrade)"
            MigrationJob[Job<br/>db-migration<br/>prisma migrate deploy]
            SeedJob[Job<br/>db-seed<br/>seed users]
        end
        
        subgraph "Ingress Layer"
            Ingress[Ingress<br/>graph-italia]
        end
        
        subgraph "Services"
            WebappSvc[Service<br/>graph-italia-webapp<br/>ClusterIP:80]
            ServerSvc[Service<br/>graph-italia-server<br/>ClusterIP:3003]
        end
        
        subgraph "Deployments"
            WebappDeploy[Deployment<br/>graph-italia-webapp<br/>Replicas: 1]
            ServerDeploy[Deployment<br/>graph-italia-server<br/>Replicas: 1]
        end
        
        subgraph "Pods"
            WebappPod1[Pod: webapp-xxx<br/>Nginx:80]
            ServerPod1[Pod: server-xxx<br/>Bun:3003]
        end
        
        subgraph "Configuration"
            ConfigMap[ConfigMap<br/>graph-italia-webapp-config<br/>config.json]
            ImageSecret[Secret<br/>image-pull-secret<br/>GHCR token]
        end
    end
    
    subgraph "External"
        Users[Users]
        Registry[GHCR Registry]
        DB[(PostgreSQL<br/>Database)]
    end
    
    MigrationJob -->|1. Schema sync| DB
    SeedJob -->|2. Seed users| DB
    
    Users -->|HTTPS| Ingress
    Ingress -->|/| WebappSvc
    Ingress -->|/api| ServerSvc
    WebappSvc --> WebappPod1
    ServerSvc --> ServerPod1
    
    ServerPod1 --> DB
```

## Installazione

### Prima installazione (con migration e seed)

```bash
helm install graph-italia oci://ghcr.io/italia/charts/graph-italia --version <version> \
  --namespace graph-italia \
  --create-namespace \
  --set dbMigration.enabled=true \
  --set dbSeed.enabled=true \
  --set "dbSeed.users[0].email=admin@example.com" \
  --set "dbSeed.users[0].password=secure-password" \
  --set server.env.DATABASE_URL="postgresql://user:pass@host:5432/db" \
  --set server.env.JWT_SECRET="your-jwt-secret" \
  --set imagePullSecret.enabled=true \
  --set imagePullSecret.token="ghp_..."
```

### Con file values (consigliato)

```bash
# Crea un file values-secrets.yaml (NON committare!)
cat > values-secrets.yaml << EOF
imagePullSecret:
  token: "ghp_xxx"
server:
  env:
    DATABASE_URL: "postgresql://user:pass@host:5432/db"
    JWT_SECRET: "your-secret"
    OPENAI_API_KEY: "sk-xxx"
    RESEND_API_KEY: "re_xxx"
dbSeed:
  users:
    - email: "admin@example.com"
      password: "secure-password"
      verifyed: true
EOF

# Installa
helm install graph-italia oci://ghcr.io/italia/charts/graph-italia --version <version> \
  --namespace graph-italia \
  --create-namespace \
  -f values-secrets.yaml
```

## Database Migration & Seeding

La chart include due Helm hooks che vengono eseguiti **prima** del deployment:

### Migration Hook (`dbMigration`)

Il job supporta tre modalita operative:

- `mode: auto` (default): usa `prisma migrate deploy` se trova migration versionate, altrimenti fallback legacy a `prisma db push`
- `mode: migrateDeploy`: forza `prisma migrate deploy` e fallisce se non trova migration files
- `mode: dbPush`: forza il comportamento legacy con `prisma db push`

Prima di applicare le migration, il job esegue sempre `prisma migrate status` quando usa il path `migrate deploy`, cosi eventuali incoerenze (es. modifiche manuali al DB non baselinate) falliscono con un errore esplicito.
Inoltre, con `legacySchemaAutoMigrate: true`, il job esegue un bootstrap automatico per convertire lo schema legacy (`userId`) allo schema a progetti (`projectId`) e baseline delle migration storiche.

```yaml
dbMigration:
  enabled: true           # Abilita il job di migration
  mode: migrateDeploy     # Consigliato per ambienti con migration versionate
  allowLegacyDbPushFallback: false
  legacySchemaAutoMigrate: true
  acceptDataLoss: false   # Solo per fallback legacy con db push
  ttlSecondsAfterFinished: 300
  backoffLimit: 3
```

### Seed Hook (`dbSeed`)

Crea gli utenti iniziali (idempotente - salta utenti esistenti):

```yaml
dbSeed:
  enabled: true
  users:
    - email: "admin@example.com"
      password: "secure-password"
      verifyed: true
    - email: "user@example.com"
      password: "another-password"
      verifyed: true
```

### Ordine di esecuzione

1. **Migration** (hook-weight: -5) - Applica le migration Prisma pendenti
2. **Seed** (hook-weight: 0) - Crea utenti
3. **Deployment** - Avvia i pod

### Disabilitare dopo prima installazione

Dopo la prima installazione, puoi disabilitare il seed per evitare creazioni accidentali:

```bash
helm upgrade graph-italia ... --set dbSeed.enabled=false
```

## Configurazione Principale

### Webapp Runtime Configuration

La webapp usa un ConfigMap per la configurazione runtime:

```yaml
webapp:
  config:
    serverUrl: "https://graph-italia.example.com"  # URL del server API
```

### Server Environment Variables

```yaml
server:
  env:
    PORT: "3003"
    DATABASE_URL: "postgresql://user:pass@host:5432/db"
    JWT_SECRET: "your-secret"
    DOMAINS: "https://graph-italia.example.com"
    UPLOAD_SIZE_LIMIT: "15mb"
    ROUTES_PREFIX: "/api"
    SENDER_EMAIL: "noreply@example.com"
    OPENAI_API_KEY: "sk-xxx"
    RESEND_API_KEY: "re_xxx"
```

### Ingress

```yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  host: "graph-italia.example.com"
  paths:
    webapp:
      path: "/"
      pathType: Prefix
    server:
      path: "/api"
      pathType: Prefix
  tls:
    - secretName: graph-italia-tls
      hosts:
        - graph-italia.example.com
```

## Autoscaling

```yaml
webapp:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 80
```

## Security

### Readonly Root Filesystem

I pod utilizzano un filesystem root readonly con volumi `emptyDir`:

- Webapp: `/tmp`, `/var/tmp`, `/var/cache/nginx`, `/var/run`
- Server: `/tmp`, `/var/tmp`

### Security Context

- `runAsNonRoot: true`
- `allowPrivilegeEscalation: false`
- `readOnlyRootFilesystem: true` (webapp), `false` (server - Prisma needs write)
- `capabilities.drop: ["ALL"]`

### Network Policies

```yaml
networkPolicy:
  enabled: true
  allowSameNamespace: true
  ingressNamespace: "ingress-nginx"
```

## Aggiornamento

```bash
# Con reuse-values (mantiene i secrets)
helm upgrade graph-italia oci://ghcr.io/italia/charts/graph-italia --version <new-version> \
  --namespace graph-italia \
  --reuse-values \
  --set webapp.image.tag="<new-tag>" \
  --set server.image.tag="<new-tag>"
```

## Troubleshooting

```bash
# Verifica pods
kubectl get pods -n graph-italia

# Verifica jobs (migration/seed)
kubectl get jobs -n graph-italia

# Logs migration
kubectl logs -n graph-italia job/graph-italia-db-migration-<revision>

# Logs seed
kubectl logs -n graph-italia job/graph-italia-db-seed-<revision>

# Logs applicazione
kubectl logs -n graph-italia deployment/graph-italia-webapp
kubectl logs -n graph-italia deployment/graph-italia-server

# Verifica ConfigMap
kubectl get configmap -n graph-italia
kubectl describe configmap graph-italia-webapp-config -n graph-italia

# Verifica ingress
kubectl get ingress -n graph-italia
kubectl describe ingress graph-italia -n graph-italia
```

## Note Importanti

- **Non committare mai** file `values.yaml` con dati sensibili
- Usa `--reuse-values` per mantenere i secrets tra upgrade
- I valori di default sono in `values.yaml` (template senza dati sensibili)
- I jobs di migration/seed vengono eliminati automaticamente dopo il successo
- Il seed è idempotente: salta utenti già esistenti