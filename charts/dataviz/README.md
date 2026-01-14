# Dataviz Helm Chart

Helm chart per il deployment dell'applicazione Dataviz su Kubernetes.

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

## Database Migration & Seeding

La chart include due Helm hooks che vengono eseguiti **prima** del deployment:

### Migration Hook (dbMigration)

Esegue `prisma db push` per sincronizzare lo schema del database:

```yaml
dbMigration:
  enabled: true           # Abilita il job di migration
  acceptDataLoss: false   # MAI true in production!
  ttlSecondsAfterFinished: 300
  backoffLimit: 3
```

### Seed Hook (dbSeed)

Crea gli utenti iniziali (idempotente - salta utenti esistenti):

```yaml
dbSeed:
  enabled: true
  users:
    - email: "admin@example.com"
      password: "secure-password"
      verifyed: true
```

### Ordine di esecuzione

1. **Migration** (hook-weight: -5) - Sincronizza schema DB
2. **Seed** (hook-weight: 0) - Crea utenti
3. **Deployment** - Avvia i pod

## Installazione

### Prima installazione (con migration e seed)

```bash
helm install dataviz oci://ghcr.io/italia/charts/dataviz --version <version> \
  --namespace dataviz \
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

### Aggiornamento

```bash
helm upgrade dataviz oci://ghcr.io/italia/charts/dataviz --version <new-version> \
  --namespace dataviz \
  --reuse-values \
  --set webapp.image.tag="<new-tag>" \
  --set server.image.tag="<new-tag>"
```

## Troubleshooting

```bash
# Verifica pods
kubectl get pods -n dataviz

# Verifica jobs (migration/seed)
kubectl get jobs -n dataviz

# Logs migration
kubectl logs -n dataviz job/dataviz-db-migration-<revision>

# Logs seed
kubectl logs -n dataviz job/dataviz-db-seed-<revision>
```

## Note Importanti

- **Non committare mai** file values.yaml con dati sensibili
- Usa --reuse-values per mantenere i secrets tra upgrade
- I jobs di migration/seed vengono eliminati automaticamente dopo il successo
- Il seed è idempotente: salta utenti già esistenti
