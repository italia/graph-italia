# Kubernetes RBAC for GitHub Actions

Questa configurazione crea un Service Account con permessi limitati per il deploy da GitHub Actions.

## Cosa viene creato

1. **Namespaces**: `graph-italia` e `graph-italia-test`
2. **ServiceAccount**: `github-actions-deployer` nel namespace `graph-italia`
3. **Secret**: Token long-lived per accesso esterno
4. **ClusterRole**: `helm-deployer` con permessi per Helm deployments
5. **RoleBindings**: Accesso limitato SOLO ai namespace `graph-italia` e `graph-italia-test`

## Setup iniziale (one-time)

```bash
# Applica i manifest
kubectl apply -f service-account.yaml
kubectl apply -f rbac.yaml

# Ottieni il token del Service Account
kubectl get secret github-actions-deployer-token -n graph-italia -o jsonpath='{.data.token}' | base64 -d

# Ottieni il certificato CA del cluster
kubectl get secret github-actions-deployer-token -n graph-italia -o jsonpath='{.data.ca\.crt}'

# Ottieni l'endpoint del cluster
kubectl cluster-info | grep "Kubernetes control plane"
```

## Configurazione GitHub Secrets

Aggiungi questi secrets nel repository GitHub:

| Secret | Descrizione |
|--------|-------------|
| `KUBE_TOKEN` | Il token del Service Account (output del comando sopra) |
| `KUBE_CA_CERT` | Il certificato CA in base64 |
| `KUBE_SERVER` | L'URL dell'API server Kubernetes (es: `https://your-cluster.hcp.italynorth.azmk8s.io:443`) |

## Sicurezza

- ✅ Il Service Account ha accesso SOLO ai namespace `graph-italia` e `graph-italia-test`
- ✅ Non può creare/modificare namespace
- ✅ Non può accedere ad altri namespace del cluster
- ✅ Non richiede Azure Service Principal
- ✅ Permessi minimi necessari per Helm deploy

