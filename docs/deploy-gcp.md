# Google Cloud Platform (GCP) Deployment Guide

This guide covers deploying the NYT Connections Clone on Google Cloud Platform.

## Table of Contents

- [Cloud Run (Recommended)](#cloud-run)
- [Google Kubernetes Engine (GKE)](#google-kubernetes-engine)
- [Compute Engine (VM)](#compute-engine)
- [App Engine](#app-engine)

## Prerequisites

- GCP Account with billing enabled
- `gcloud` CLI installed and authenticated: `gcloud auth login`
- Docker image ready

## Cloud Run

Fully managed serverless platform for containers. **Recommended for most use cases.**

### Steps

1. **Set up GCP Project**:

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

2. **Build and Push to Container Registry**:

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Build image
docker build -t gcr.io/YOUR_PROJECT_ID/nyt-connections-clone .

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/nyt-connections-clone
```

3. **Deploy to Cloud Run**:

```bash
gcloud run deploy nyt-connections \
  --image gcr.io/YOUR_PROJECT_ID/nyt-connections-clone \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production
```

4. **Get Service URL**:

```bash
gcloud run services describe nyt-connections \
  --region us-central1 \
  --format 'value(status.url)'
```

### Deploy from Source (Alternative)

Cloud Run can build from source directly:

```bash
gcloud run deploy nyt-connections \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

**Features**:
- Scale to zero (pay only when used)
- HTTPS automatically configured
- Custom domains supported
- Auto-scaling

**Cost**: 
- Free tier: 2 million requests/month
- After: ~$0.00002400/request (~$10-30/month typical)

## Google Kubernetes Engine (GKE)

For production-scale Kubernetes deployments.

### Steps

1. **Create GKE Cluster**:

```bash
gcloud container clusters create nyt-connections-cluster \
  --zone us-central1-a \
  --num-nodes 2 \
  --machine-type e2-small \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 3
```

2. **Get Cluster Credentials**:

```bash
gcloud container clusters get-credentials nyt-connections-cluster \
  --zone us-central1-a
```

3. **Create Kubernetes Manifests** (`k8s-manifests.yaml`):

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
        image: gcr.io/YOUR_PROJECT_ID/nyt-connections-clone:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
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
    protocol: TCP
  selector:
    app: nyt-connections
```

4. **Deploy to GKE**:

```bash
kubectl apply -f k8s-manifests.yaml

# Get external IP
kubectl get service nyt-connections-service
```

5. **Set up Ingress (Optional for HTTPS)**:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nyt-connections-ingress
  annotations:
    kubernetes.io/ingress.class: "gce"
    kubernetes.io/ingress.global-static-ip-name: "nyt-connections-ip"
spec:
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: nyt-connections-service
            port:
              number: 80
```

**Cost**: ~$50-100/month (autopilot) or ~$70-150/month (standard)

## Compute Engine

Traditional VM deployment.

### Steps

1. **Create VM Instance**:

```bash
gcloud compute instances create nyt-connections-vm \
  --zone us-central1-a \
  --machine-type e2-micro \
  --image-family ubuntu-2004-lts \
  --image-project ubuntu-os-cloud \
  --boot-disk-size 10GB \
  --tags http-server,https-server
```

2. **Configure Firewall**:

```bash
gcloud compute firewall-rules create allow-http \
  --allow tcp:80,tcp:443,tcp:3000 \
  --target-tags http-server

gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22 \
  --target-tags http-server
```

3. **SSH and Install Docker**:

```bash
# SSH into VM
gcloud compute ssh nyt-connections-vm --zone us-central1-a

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

4. **Deploy Application**:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/nyt-connections-clone.git
cd nyt-connections-clone

# Run with Docker Compose
sudo docker-compose up -d
```

5. **Get External IP**:

```bash
gcloud compute instances describe nyt-connections-vm \
  --zone us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

**Cost**: 
- e2-micro (free tier): $0/month (1 per account)
- e2-small: ~$13/month

## App Engine

Fully managed PaaS (limited Docker support).

### Steps

1. **Create `app.yaml`**:

```yaml
runtime: custom
env: flex

automatic_scaling:
  min_num_instances: 1
  max_num_instances: 3
  cool_down_period_sec: 120
  cpu_utilization:
    target_utilization: 0.7

resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10

env_variables:
  NODE_ENV: 'production'
```

2. **Deploy**:

```bash
gcloud app deploy
```

3. **View Application**:

```bash
gcloud app browse
```

**Note**: App Engine Flexible uses more resources and can't scale to zero.

**Cost**: ~$50-100/month minimum

## Custom Domain & SSL

### Cloud Run

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service nyt-connections \
  --domain www.yourdomain.com \
  --region us-central1

# Follow DNS instructions to add records
```

SSL is automatically provisioned.

### Load Balancer with Managed Certificate

```bash
# Reserve static IP
gcloud compute addresses create nyt-connections-ip --global

# Create managed SSL certificate
gcloud compute ssl-certificates create nyt-connections-cert \
  --domains=yourdomain.com,www.yourdomain.com \
  --global
```

## CI/CD with Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/nyt-connections-clone:$COMMIT_SHA', '.']
  
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/nyt-connections-clone:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'nyt-connections'
      - '--image'
      - 'gcr.io/$PROJECT_ID/nyt-connections-clone:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/nyt-connections-clone:$COMMIT_SHA'

options:
  machineType: 'N1_HIGHCPU_8'
```

Set up trigger:

```bash
gcloud builds triggers create github \
  --repo-name=nyt-connections-clone \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Monitoring & Logging

### View Logs

```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=nyt-connections" --limit 50

# GKE logs
kubectl logs -l app=nyt-connections -f

# Compute Engine logs
gcloud compute ssh nyt-connections-vm --zone us-central1-a --command "docker logs nyt-connections-clone"
```

### Set up Monitoring

Cloud Monitoring is automatically enabled for Cloud Run and GKE.

View metrics in [Cloud Console](https://console.cloud.google.com/monitoring).

## Cost Comparison

| Service | Monthly Cost | Best For |
|---------|-------------|----------|
| Cloud Run | $10-30 | Recommended, serverless |
| Compute Engine (e2-micro) | $0 (free tier) | Development/testing |
| Compute Engine (e2-small) | ~$13 | Simple production |
| GKE (autopilot) | ~$50-100 | Production apps |
| App Engine Flex | ~$50-100 | Legacy apps |

## Best Practices

1. **Use Cloud Run** for most use cases - it's the most cost-effective and easiest
2. **Enable Container Analysis** for vulnerability scanning
3. **Use Secret Manager** for sensitive configuration
4. **Set up Cloud CDN** for static assets
5. **Enable Cloud Armor** for DDoS protection

## Cleanup

```bash
# Delete Cloud Run service
gcloud run services delete nyt-connections --region us-central1

# Delete GKE cluster
gcloud container clusters delete nyt-connections-cluster --zone us-central1-a

# Delete Compute Engine instance
gcloud compute instances delete nyt-connections-vm --zone us-central1-a

# Delete Container Registry images
gcloud container images delete gcr.io/YOUR_PROJECT_ID/nyt-connections-clone
```

## Common Issues

**Issue**: Cloud Run service timeout
- Increase timeout: `--timeout 300`
- Check application startup time

**Issue**: Cannot access from browser
- Verify `--allow-unauthenticated` flag
- Check firewall rules for Compute Engine

**Issue**: High costs
- Use Cloud Run with scale-to-zero
- Set max instances limit
- Use e2-micro for dev/test

## Support

For GCP-specific issues, consult [GCP Documentation](https://cloud.google.com/docs).
