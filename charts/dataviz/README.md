# Dataviz Helm Chart

Helm chart per il deployment dell'applicazione Dataviz su Kubernetes.

## Panoramica

La chart deploya due componenti principali:
- **Webapp**: applicazione React servita da Nginx
- **Server**: API Express/Bun con Prisma ORM

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
    subgraph "Namespace: dataviz"
        subgraph "Ingress Layer"
            Ingress[Ingress<br/>dataviz]
        end
        
        subgraph "Services"
            WebappSvc[Service<br/>dataviz-webapp<br/>ClusterIP:80]
            ServerSvc[Service<br/>dataviz-server<br/>ClusterIP:3003]
        end
        
        subgraph "Deployments"
            WebappDeploy[Deployment<br/>dataviz-webapp<br/>Replicas: 1]
            ServerDeploy[Deployment<br/>dataviz-server<br/>Replicas: 1]
        end
        
        subgraph "Pods"
            WebappPod1[Pod: webapp-xxx<br/>Nginx:80]
            WebappPod2[Pod: webapp-yyy<br/>Nginx:80]
            ServerPod1[Pod: server-xxx<br/>Bun:3003]
            ServerPod2[Pod: server-yyy<br/>Bun:3003]
        end
        
        subgraph "Configuration"
            ConfigMap[ConfigMap<br/>dataviz-webapp-config<br/>config.json]
            ImageSecret[Secret<br/>image-pull-secret<br/>GHCR token]
        end
        
        subgraph "Storage"
            WebappVol1[emptyDir: /tmp]
            WebappVol2[emptyDir: /var/tmp]
            WebappVol3[emptyDir: /var/cache/nginx]
            WebappVol4[emptyDir: /var/run]
            ServerVol1[emptyDir: /tmp]
            ServerVol2[emptyDir: /var/tmp]
        end
        
        subgraph "Autoscaling"
            WebappHPA[HPA<br/>dataviz-webapp]
            ServerHPA[HPA<br/>dataviz-server]
        end
        
        subgraph "Policies"
            PDB[PodDisruptionBudget<br/>minAvailable: 1]
            NetPol[NetworkPolicy<br/>dataviz]
        end
    end
    
    subgraph "External"
        Users[Users]
        Registry[GHCR Registry]
        DB[(PostgreSQL<br/>Database)]
    end
    
    Users -->|HTTPS| Ingress
    Ingress -->|/| WebappSvc
    Ingress -->|/api| ServerSvc
    WebappSvc --> WebappPod1
    WebappSvc --> WebappPod2
    ServerSvc --> ServerPod1
    ServerSvc --> ServerPod2
    
    WebappDeploy --> WebappPod1
    WebappDeploy --> WebappPod2
    ServerDeploy --> ServerPod1
    ServerDeploy --> ServerPod2
    
    WebappPod1 --> ConfigMap
    WebappPod2 --> ConfigMap
    WebappPod1 --> WebappVol1
    WebappPod1 --> WebappVol2
    WebappPod1 --> WebappVol3
    WebappPod1 --> WebappVol4
    ServerPod1 --> ServerVol1
    ServerPod1 --> ServerVol2
    
    WebappDeploy --> ImageSecret
    ServerDeploy --> ImageSecret
    Registry --> ImageSecret
    
    WebappHPA --> WebappDeploy
    ServerHPA --> ServerDeploy
    
    PDB --> WebappDeploy
    PDB --> ServerDeploy
    NetPol --> WebappPod1
    NetPol --> WebappPod2
    NetPol --> ServerPod1
    NetPol --> ServerPod2
    
    ServerPod1 --> DB
    ServerPod2 --> DB
```

## Installazione

### Installazione base

```bash
helm install dataviz oci://ghcr.io/italia/charts/dataviz --version <version> \
  --namespace dataviz \
  --create-namespace
```

### Con configurazione personalizzata

```bash
helm install dataviz oci://ghcr.io/italia/charts/dataviz --version <version> \
  --namespace dataviz \
  --create-namespace \
  --set webapp.config.serverUrl="http://dataviz-server:3003" \
  --set server.env.DATABASE_URL="postgresql://..." \
  --set imagePullSecret.enabled=true \
  --set imagePullSecret.token="ghp_..."
```

## Configurazione Principale

### Webapp Runtime Configuration

La webapp usa un ConfigMap per la configurazione runtime, permettendo di usare la stessa immagine buildata in ambienti diversi:

```yaml
webapp:
  config:
    serverUrl: "http://dataviz-server:3003"  # URL del server API
```

Il ConfigMap viene montato come volume read-only in `/usr/share/nginx/html/config.json` e caricato dall'applicazione all'avvio.

### Server Environment Variables

```yaml
server:
  env:
    PORT: "3003"
    DATABASE_URL: "postgresql://user:pass@host:5432/db"
    DOMAINS: "dataviz.example.com"
    UPLOAD_SIZE_LIMIT: "15mb"
```

### Ingress

Supporta due modalità:

**Singolo host con paths:**
```yaml
ingress:
  enabled: true
  className: "nginx"
  host: "dataviz.example.com"
  paths:
    webapp:
      path: "/"
    server:
      path: "/api"
```

**Host multipli:**
```yaml
ingress:
  enabled: true
  hosts:
    - host: webapp.dataviz.example.com
      paths:
        - path: /
          service: webapp
    - host: api.dataviz.example.com
      paths:
        - path: /
          service: server
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

I pod utilizzano un filesystem root readonly con volumi `emptyDir` per directory temporanee:

- Webapp: `/tmp`, `/var/tmp`, `/var/cache/nginx`, `/var/run`
- Server: `/tmp`, `/var/tmp`

### Security Context

- `runAsNonRoot: true`
- `allowPrivilegeEscalation: false`
- `readOnlyRootFilesystem: true`
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
helm upgrade dataviz oci://ghcr.io/italia/charts/dataviz --version <new-version> \
  --namespace dataviz \
  --reuse-values \
  --set webapp.image.tag="<new-tag>" \
  --set server.image.tag="<new-tag>"
```

## Rimozione

```bash
helm uninstall dataviz --namespace dataviz
```

## Troubleshooting

```bash
# Verifica pods
kubectl get pods -n dataviz

# Logs
kubectl logs -n dataviz deployment/dataviz-webapp
kubectl logs -n dataviz deployment/dataviz-server

# Verifica ConfigMap
kubectl get configmap -n dataviz
kubectl describe configmap dataviz-webapp-config -n dataviz

# Verifica ingress
kubectl get ingress -n dataviz
kubectl describe ingress dataviz -n dataviz
```

## Note

- Non committare mai file `values.yaml` con dati sensibili
- Usa Kubernetes Secrets per password e token
- Il ConfigMap per la webapp permette configurazione runtime senza rebuild
- I valori di default sono in `values.yaml` (template senza dati sensibili)
