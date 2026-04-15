#!/bin/bash
# Script to generate kubeconfig for GitHub Actions Service Account
# Run this after applying the RBAC manifests

set -e

NAMESPACE="graph-italia"
SERVICE_ACCOUNT="github-actions-deployer"
SECRET_NAME="github-actions-deployer-token"

echo "🔐 Extracting Service Account credentials..."

# Get the token
TOKEN=$(kubectl get secret $SECRET_NAME -n $NAMESPACE -o jsonpath='{.data.token}' | base64 -d)

# Get the CA certificate
CA_CERT=$(kubectl get secret $SECRET_NAME -n $NAMESPACE -o jsonpath='{.data.ca\.crt}')

# Get the API server URL
SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')

echo ""
echo "============================================"
echo "📋 GitHub Secrets Configuration"
echo "============================================"
echo ""
echo "Add these as repository secrets in GitHub:"
echo ""
echo "1. KUBE_SERVER:"
echo "   $SERVER"
echo ""
echo "2. KUBE_CA_CERT (base64 encoded):"
echo "   $CA_CERT"
echo ""
echo "3. KUBE_TOKEN:"
echo "   $TOKEN"
echo ""
echo "============================================"
echo ""
echo "✅ Done! Add these secrets to your GitHub repository settings."

