# Seccomp Profiles per Graph Italia

Questi profili seccomp sono ottimizzati per i componenti Graph Italia e possono essere utilizzati
con il [Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).

## Installazione Security Profiles Operator (SPO)

```bash
# Installare SPO via Helm
helm repo add security-profiles-operator https://kubernetes-sigs.github.io/security-profiles-operator
helm install spo security-profiles-operator/security-profiles-operator -n security-profiles-operator --create-namespace
```

## Utilizzo dei profili

1. Applicare i profili SeccompProfile:
```bash
kubectl apply -f nginx-seccomp.yaml -n graph-italia
kubectl apply -f bun-seccomp.yaml -n graph-italia
```

2. Aggiornare i values.yaml per usare i profili custom:
```yaml
webapp:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: operator/graph-italia/graph-italia-nginx-seccomp.json

server:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: operator/graph-italia/graph-italia-bun-seccomp.json
```

## Note

- I profili sono stati creati analizzando le syscall tipiche di nginx e bun/node
- Testare sempre in ambiente di test prima di applicare in produzione
- Il profilo `RuntimeDefault` è già molto restrittivo e sufficiente per la maggior parte dei casi
