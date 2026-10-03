# AWS Deployment Guide

This guide covers multiple ways to deploy the NYT Connections Clone on AWS.

## Table of Contents

- [AWS App Runner (Easiest)](#aws-app-runner)
- [AWS ECS with Fargate](#aws-ecs-with-fargate)
- [AWS EC2 with Docker](#aws-ec2-with-docker)
- [AWS Amplify](#aws-amplify)

## AWS App Runner

The simplest way to deploy Docker containers on AWS.

### Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker image pushed to ECR or Docker Hub

### Steps

1. **Push Docker image to Amazon ECR**:

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name nyt-connections-clone --region us-east-1

# Build and tag image
docker build -t nyt-connections-clone .
docker tag nyt-connections-clone:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nyt-connections-clone:latest

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nyt-connections-clone:latest
```

2. **Deploy with App Runner**:

```bash
# Create App Runner service
aws apprunner create-service \
  --service-name nyt-connections-clone \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nyt-connections-clone:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "3000"
      }
    }
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }'
```

3. **Get the service URL**:

```bash
aws apprunner describe-service --service-arn YOUR_SERVICE_ARN
```

**Cost**: ~$25-50/month for small workloads

## AWS ECS with Fargate

For more control and scalability.

### Prerequisites

- AWS CLI configured
- Docker image in ECR

### Steps

1. **Create ECS Cluster**:

```bash
aws ecs create-cluster --cluster-name nyt-connections-cluster
```

2. **Create Task Definition**:

Create `task-definition.json`:

```json
{
  "family": "nyt-connections-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "nyt-connections",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nyt-connections-clone:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nyt-connections",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register the task:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

3. **Create Application Load Balancer** (via AWS Console or CLI)

4. **Create ECS Service**:

```bash
aws ecs create-service \
  --cluster nyt-connections-cluster \
  --service-name nyt-connections-service \
  --task-definition nyt-connections-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

**Cost**: ~$15-30/month for 2 tasks

## AWS EC2 with Docker

Traditional VM-based deployment.

### Steps

1. **Launch EC2 Instance**:
   - AMI: Amazon Linux 2 or Ubuntu
   - Instance Type: t2.micro (free tier) or t3.small
   - Security Group: Allow ports 22 (SSH), 80, 443, 3000

2. **Connect and Install Docker**:

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker (Amazon Linux 2)
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Deploy Application**:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/nyt-connections-clone.git
cd nyt-connections-clone

# Run with Docker Compose
docker-compose up -d

# Or use the prebuilt image
docker-compose -f docker-compose.simple.yml up -d
```

4. **Set up Nginx (Optional)**:

```bash
sudo yum install nginx -y

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/conf.d/app.conf
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo service nginx start
```

**Cost**: ~$8-15/month (t2.micro/t3.small)

## AWS Amplify

For Next.js SSR with automatic deployments.

### Steps

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository

2. **Configure Build Settings**:

Amplify will auto-detect Next.js. Verify `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Deploy**:
   - Click "Save and deploy"
   - Amplify will build and deploy automatically on each push

**Cost**: ~$0.01/build minute + hosting (~$15-30/month)

## Cost Comparison

| Service | Monthly Cost | Pros | Cons |
|---------|-------------|------|------|
| App Runner | $25-50 | Easiest, Auto-scaling | Less control |
| ECS Fargate | $15-30 | Scalable, Managed | More complex |
| EC2 | $8-15 | Full control, Cheaper | Manual updates |
| Amplify | $15-30 | CI/CD built-in, SSR | Vendor lock-in |

## SSL/TLS Certificate

For all options, use AWS Certificate Manager for free SSL certificates:

1. Request a certificate in ACM
2. Validate domain ownership
3. Attach to your ALB/CloudFront/App Runner service

## Monitoring

Use CloudWatch for logs and metrics:

```bash
# View logs
aws logs tail /ecs/nyt-connections --follow
```

## Common Issues

**Issue**: Container fails to start
- Check CloudWatch logs
- Verify port 3000 is exposed
- Check memory/CPU limits

**Issue**: Can't access app
- Verify security group allows inbound traffic on port 3000/80/443
- Check if service is running: `docker ps`

## Support

For AWS-specific issues, consult [AWS Documentation](https://docs.aws.amazon.com/).
