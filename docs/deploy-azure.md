# Azure Deployment Guide

This guide covers deploying the NYT Connections Clone on Microsoft Azure.

## Table of Contents

- [Azure Container Instances (Easiest)](#azure-container-instances)
- [Azure Container Apps](#azure-container-apps)
- [Azure App Service](#azure-app-service)
- [Azure Kubernetes Service (AKS)](#azure-kubernetes-service)

## Prerequisites

- Azure Account
- Azure CLI installed: `az login`
- Docker image ready

## Azure Container Instances

Simplest way to run a single container.

### Steps

1. **Create Resource Group**:

```bash
az group create --name nyt-connections-rg --location eastus
```

2. **Create Container Registry (ACR)**:

```bash
# Create ACR
az acr create --resource-group nyt-connections-rg \
  --name nytconnectionsacr --sku Basic

# Login to ACR
az acr login --name nytconnectionsacr

# Build and push image
docker build -t nyt-connections-clone .
docker tag nyt-connections-clone nytconnectionsacr.azurecr.io/nyt-connections-clone:latest
docker push nytconnectionsacr.azurecr.io/nyt-connections-clone:latest
```

3. **Deploy Container Instance**:

```bash
# Enable admin access on ACR (for pulling)
az acr update --name nytconnectionsacr --admin-enabled true

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name nytconnectionsacr --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name nytconnectionsacr --query "passwords[0].value" -o tsv)

# Create container instance
az container create \
  --resource-group nyt-connections-rg \
  --name nyt-connections \
  --image nytconnectionsacr.azurecr.io/nyt-connections-clone:latest \
  --registry-login-server nytconnectionsacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label nyt-connections-app \
  --ports 3000 \
  --cpu 1 \
  --memory 1.5 \
  --environment-variables NODE_ENV=production
```

4. **Get the URL**:

```bash
az container show --resource-group nyt-connections-rg \
  --name nyt-connections --query ipAddress.fqdn
```

Access at: `http://nyt-connections-app.eastus.azurecontainer.io:3000`

**Cost**: ~$30-40/month

## Azure Container Apps

Modern serverless container platform.

### Steps

1. **Install Container Apps Extension**:

```bash
az extension add --name containerapp --upgrade
```

2. **Create Container Apps Environment**:

```bash
az containerapp env create \
  --name nyt-connections-env \
  --resource-group nyt-connections-rg \
  --location eastus
```

3. **Deploy Container App**:

```bash
az containerapp create \
  --name nyt-connections-app \
  --resource-group nyt-connections-rg \
  --environment nyt-connections-env \
  --image nytconnectionsacr.azurecr.io/nyt-connections-clone:latest \
  --registry-server nytconnectionsacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3000 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars NODE_ENV=production
```

4. **Get Application URL**:

```bash
az containerapp show \
  --name nyt-connections-app \
  --resource-group nyt-connections-rg \
  --query properties.configuration.ingress.fqdn -o tsv
```

**Features**:
- Auto-scaling (scale to zero)
- HTTPS included
- Built-in monitoring

**Cost**: ~$20-40/month (pay per use)

## Azure App Service

PaaS for web applications with built-in CI/CD.

### Option 1: Deploy from Docker Hub

1. **Create App Service Plan**:

```bash
az appservice plan create \
  --name nyt-connections-plan \
  --resource-group nyt-connections-rg \
  --is-linux \
  --sku B1
```

2. **Create Web App**:

```bash
az webapp create \
  --resource-group nyt-connections-rg \
  --plan nyt-connections-plan \
  --name nyt-connections-webapp \
  --deployment-container-image-name YOUR_DOCKERHUB_USERNAME/nyt-connections-clone:latest
```

3. **Configure Port**:

```bash
az webapp config appsettings set \
  --resource-group nyt-connections-rg \
  --name nyt-connections-webapp \
  --settings WEBSITES_PORT=3000 NODE_ENV=production
```

4. **Access**:

URL: `https://nyt-connections-webapp.azurewebsites.net`

### Option 2: Deploy from ACR

```bash
az webapp create \
  --resource-group nyt-connections-rg \
  --plan nyt-connections-plan \
  --name nyt-connections-webapp \
  --deployment-container-image-name nytconnectionsacr.azurecr.io/nyt-connections-clone:latest

# Configure ACR credentials
az webapp config container set \
  --name nyt-connections-webapp \
  --resource-group nyt-connections-rg \
  --docker-custom-image-name nytconnectionsacr.azurecr.io/nyt-connections-clone:latest \
  --docker-registry-server-url https://nytconnectionsacr.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

### Enable Continuous Deployment

```bash
# Enable webhook for automatic deployment
az webapp deployment container config \
  --enable-cd true \
  --name nyt-connections-webapp \
  --resource-group nyt-connections-rg
```

**Cost**: ~$55/month (B1 tier)

## Azure Kubernetes Service (AKS)

For production-scale deployments.

### Steps

1. **Create AKS Cluster**:

```bash
az aks create \
  --resource-group nyt-connections-rg \
  --name nyt-connections-aks \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --attach-acr nytconnectionsacr \
  --generate-ssh-keys
```

2. **Get Credentials**:

```bash
az aks get-credentials \
  --resource-group nyt-connections-rg \
  --name nyt-connections-aks
```

3. **Create Kubernetes Manifest** (`k8s-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nyt-connections
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nyt-connections
  template:
    metadata:
      labels:
        app: nyt-connections
    spec:
      containers:
      - name: app
        image: nytconnectionsacr.azurecr.io/nyt-connections-clone:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: nyt-connections-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: nyt-connections
```

4. **Deploy**:

```bash
kubectl apply -f k8s-deployment.yaml

# Get external IP
kubectl get service nyt-connections-service
```

**Cost**: ~$70-150/month (2 nodes)

## Custom Domain & SSL

### Add Custom Domain

```bash
# For Container Apps
az containerapp hostname add \
  --hostname www.yourdomain.com \
  --resource-group nyt-connections-rg \
  --name nyt-connections-app

# For App Service
az webapp config hostname add \
  --webapp-name nyt-connections-webapp \
  --resource-group nyt-connections-rg \
  --hostname www.yourdomain.com
```

### Enable SSL

```bash
# App Service - Free managed certificate
az webapp config ssl create \
  --resource-group nyt-connections-rg \
  --name nyt-connections-webapp \
  --hostname www.yourdomain.com

az webapp config ssl bind \
  --resource-group nyt-connections-rg \
  --name nyt-connections-webapp \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

## Monitoring & Logging

### Enable Application Insights

```bash
# Create App Insights
az monitor app-insights component create \
  --app nyt-connections-insights \
  --location eastus \
  --resource-group nyt-connections-rg

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app nyt-connections-insights \
  --resource-group nyt-connections-rg \
  --query instrumentationKey -o tsv)
```

### View Logs

```bash
# Container Instances logs
az container logs --resource-group nyt-connections-rg --name nyt-connections

# App Service logs
az webapp log tail --name nyt-connections-webapp --resource-group nyt-connections-rg

# Container Apps logs
az containerapp logs show \
  --name nyt-connections-app \
  --resource-group nyt-connections-rg \
  --follow
```

## Cost Comparison

| Service | Monthly Cost | Best For |
|---------|-------------|----------|
| Container Instances | $30-40 | Simple deployments |
| Container Apps | $20-40 | Modern apps, auto-scaling |
| App Service | $55+ | Traditional web apps |
| AKS | $70-150+ | Enterprise/complex apps |

## Cleanup

```bash
# Delete entire resource group
az group delete --name nyt-connections-rg --yes --no-wait
```

## Common Issues

**Issue**: Cannot pull image from ACR
- Ensure ACR admin is enabled: `az acr update --name nytconnectionsacr --admin-enabled true`
- Verify credentials are correct

**Issue**: Port not accessible
- Check WEBSITES_PORT is set to 3000 for App Service
- Verify ingress is external for Container Apps

**Issue**: Container restarts frequently
- Check logs for errors
- Verify memory/CPU limits are sufficient

## CI/CD with GitHub Actions

See the main repository's `.github/workflows` for automated deployment examples.

## Support

For Azure-specific issues, consult [Azure Documentation](https://docs.microsoft.com/azure/).
