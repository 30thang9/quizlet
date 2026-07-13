# 08 - Deployment Architecture

## 🎯 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cloud Provider: AWS (Amazon Web Services)                      │
│  Container: Docker + Kubernetes (EKS)                           │
│  CI/CD: GitHub Actions + ArgoCD                                │
│  Infrastructure: Terraform                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Route 53 (DNS)                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    CloudFront (CDN)                      │  │
│  │  ┌───────────────┐  ┌───────────────┐                  │  │
│  │  │   Static/WEB   │  │     API      │                   │  │
│  │  │   (S3 + CF)   │  │  (CloudFront) │                   │  │
│  │  └───────────────┘  └───────────────┘                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│         │                    │                                 │
│         │                    ▼                                 │
│         │         ┌─────────────────────────────────┐         │
│         │         │         ALB (Load Balancer)      │         │
│         │         └─────────────────────────────────┘         │
│         │                    │                                 │
│         │         ┌──────────┴──────────┐                    │
│         │         ▼                      ▼                     │
│         │  ┌─────────────┐      ┌─────────────┐              │
│         │  │   EKS       │      │   EKS       │              │
│         │  │  (API Pods) │      │  (Web Pods) │              │
│         │  └──────┬──────┘      └─────────────┘              │
│         │         │                                          │
│         ▼         ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                     Redis (ElastiCache)                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │   Cache     │  │   Session   │  │    Jobs    │    │  │
│  │  │  (Cache)   │  │  (Sessions) │  │  (Bull/BullMQ)│   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └─────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   RDS PostgreSQL                          │  │
│  │  ┌─────────────┐  ┌─────────────┐                       │  │
│  │  │  Primary   │  │   Replica   │                       │  │
│  │  │  (Writer)  │◀━│  (Reader)   │                       │  │
│  │  └─────────────┘  └─────────────┘                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                      S3 Buckets                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │   Media    │  │   Assets   │  │  Backups   │    │  │
│  │  │  (Images) │  │  (Static) │  │            │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Docker Configuration

### Backend (NestJS)
```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start
CMD ["node", "dist/main.js"]
```

### Frontend (Next.js)
```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

### Docker Compose (Development)
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/quizlet
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./apps/api/src:/app/src
    command: npm run start:dev

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    depends_on:
      - api
    volumes:
      - ./apps/web/src:/app/src
      - ./apps/web/public:/app/public
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=quizlet
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Development tools
  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  postgres_data:
  redis_data:
```

---

## ☸️ Kubernetes Configuration

### Backend Deployment
```yaml
# kubernetes/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: quizlet
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/quizlet/api:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: redis-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: jwt-secret
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 30
```

### HPA (Horizontal Pod Autoscaler)
```yaml
# kubernetes/api-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: quizlet
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### Service
```yaml
# kubernetes/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: quizlet
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============ CI ============
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:cov
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
        env:
          CYPRESS_BASE_URL: http://localhost:4000

  # ============ BUILD & PUSH ============
  build-and-push:
    name: Build & Push Images
    runs-on: ubuntu-latest
    needs: [lint, test]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    outputs:
      api-tag: ${{ steps.meta.outputs.api-tag }}
      web-tag: ${{ steps.meta.outputs.web-tag }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push API
        uses: docker/build-push-action@v5
        with:
          context: ./apps/api
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ steps.meta.outputs.api-tag }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build and push Web
        uses: docker/build-push-action@v5
        with:
          context: ./apps/web
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/web:${{ steps.meta.outputs.web-tag }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ============ DEPLOY ============
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build-and-push]
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --region ${{ vars.AWS_REGION }} --name quizlet-cluster
          kubectl set image deployment/api api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ needs.build-and-push.outputs.api-tag }}
          kubectl rollout status deployment/api -n quizlet-staging --timeout=300s

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --region ${{ vars.AWS_REGION }} --name quizlet-cluster
          kubectl set image deployment/api api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ needs.build-and-push.outputs.api-tag }}
          kubectl rollout status deployment/api -n quizlet-production --timeout=300s
```

---

## 🗄️ Terraform (Infrastructure as Code)

### Main Infrastructure
```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "quizlet-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway     = true
  enable_vpn_gateway     = false
  enable_dns_hostnames   = true
  enable_dns_support      = true
}

# RDS PostgreSQL
module "rds" {
  source = "terraform-aws-modules/rds/aws"
  
  identifier = "quizlet-postgres"
  
  engine               = "postgres"
  engine_version       = "16.1"
  family               = "postgres16"
  major_engine_version = "16"
  
  instance_class        = "db.t3.medium"
  multi_az              = true
  allocated_storage      = 100
  max_allocated_storage = 500
  
  db_name  = "quizlet"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [module.security_group.security_group_id]
  
  maintenance_window      = "mon:00:00-mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period  = 7
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}

# ElastiCache Redis
module "redis" {
  source = "terraform-aws-modules/elasticache/aws"
  
  cluster_id           = "quizlet-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.medium"
  number_cache_nodes   = 2
  parameter_group_name = "default.redis7"
  
  vpc_security_group_ids = [module.security_group.security_group_id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_enabled          = true
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "quizlet-cluster"
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    api = {
      name         = "api-nodes"
      instance_type = "t3.medium"
      min_size      = 3
      max_size      = 20
      desired_size  = 3
      
      key_name = var.ssh_key_name
    }
  }
}
```

---

## 📊 Monitoring & Observability

### Prometheus + Grafana
```yaml
# kubernetes/monitoring.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: monitoring

---
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
  namespace: monitoring
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend
  ruleSelector:
    matchLabels:
      role: alert-rules
  alerting:
    alertmanagers:
      - namespace: monitoring
        name: alertmanager-main
```

### Key Metrics to Monitor
```
┌─────────────────────────────────────────────────────────────────┐
│                    KEY METRICS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Application Metrics                                           │
│  ├── Request rate (req/sec)                                    │
│  ├── Error rate (%)                                            │
│  ├── Response time (p50, p95, p99)                            │
│  └── Active connections                                        │
│                                                                 │
│  Business Metrics                                              │
│  ├── Active users                                             │
│  ├── Study sessions started                                    │
│  ├── Cards reviewed                                            │
│  └── Conversion rate                                           │
│                                                                 │
│  Infrastructure Metrics                                        │
│  ├── CPU/Memory utilization                                   │
│  ├── Pod restarts                                             │
│  ├── Network I/O                                              │
│  └── Disk usage                                               │
│                                                                 │
│  Database Metrics                                              │
│  ├── Connection pool usage                                     │
│  ├── Query latency                                            │
│  ├── Replication lag                                          │
│  └── Cache hit rate                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Environment Variables

### Backend (.env.example)
```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quizlet
DATABASE_LOGGING=true

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_TEAM_ID=

# AWS
AWS_REGION=us-east-1
S3_BUCKET=quizlet-media
S3_CDN_URL=

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@quizlet-clone.com

# Storage
MAX_FILE_SIZE=10485760  # 10MB

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Frontend (.env.example)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Auth
NEXT_PUBLIC_JWT_ISSUER=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
```
