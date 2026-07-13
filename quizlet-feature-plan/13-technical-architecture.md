# 13 - Kiến Trúc Kỹ Thuật (Technical Architecture)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNICAL ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏗️ System Architecture      - Tổng quan hệ thống             │
│  💻 Frontend                - Web, iOS, Android                 │
│  ⚙️ Backend                 - API, Database, Services         │
│  🤖 AI/ML Pipeline          - Machine Learning infrastructure  │
│  🔧 DevOps & Infrastructure - Cloud, CI/CD, Monitoring         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ 1. System Architecture Overview

### 1.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM OVERVIEW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CLIENTS                               │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │   Web   │  │  iOS    │  │Android │  │   PWA   │    │   │
│  │  │ (React) │  │ (Swift) │  │(Kotlin)│  │ (React) │    │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │   │
│  └───────┼────────────┼────────────┼────────────┼──────────┘   │
│          └────────────┴────────────┴────────────┘               │
│                           │                                     │
│                    ┌──────▼──────┐                             │
│                    │   API GW    │                             │
│                    │   (Kong)    │                             │
│                    └──────┬──────┘                             │
│                           │                                     │
│          ┌────────────────┼────────────────┐                   │
│          │                │                │                   │
│    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐           │
│    │   Auth    │   │    API    │   │   AI     │           │
│    │  Service  │   │  Service  │   │  Service │           │
│    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘           │
│          │               │               │                   │
│    ┌─────▼───────────────▼───────────────▼─────┐              │
│    │              DATA LAYER                    │              │
│    │  ┌─────────┐  ┌─────────┐  ┌─────────┐   │              │
│    │  │PostgreSQL│ │  Redis  │  │   S3    │   │              │
│    │  │ (Main)  │  │ (Cache) │  │(Media)  │   │              │
│    │  └─────────┘  └─────────┘  └─────────┘   │              │
│    └────────────────────────────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 2. Frontend Architecture

### 2.1 Web Application (React)
```yaml
WebStack:
  framework: "Next.js 14 (App Router)"
  language: "TypeScript"
  
  state_management:
    - zustand: "Global state"
    - react-query: "Server state"
    - jotai: "Atomic state"
    
  styling:
    - tailwind_css: "Utility-first CSS"
    - styled_components: "Component styles"
    
  testing:
    - jest: "Unit tests"
    - cypress: "E2E tests"
    - playwright: "E2E tests"
    
  deployment:
    - vercel: "CDN + Edge"
    - cloudflare: "CDN"
```

### 2.2 Mobile Apps

#### iOS (Swift/SwiftUI)
```yaml
iOSStack:
  language: "Swift 5.9+"
  ui_framework: "SwiftUI + UIKit"
  
  architecture:
    - pattern: "MVVM + Coordinator"
    - di: "SwiftUI dependency injection"
    
  networking:
    - alamofire: "HTTP client"
    - graphql_swift: "GraphQL client"
    
  storage:
    - realm: "Local database"
    - keychain: "Secure storage"
    
  testing:
    - xcuitest: "UI tests"
    - quick_nimble: "Unit tests"
```

#### Android (Kotlin/Jetpack)
```yaml
AndroidStack:
  language: "Kotlin 1.9+"
  ui_framework: "Jetpack Compose"
  
  architecture:
    - pattern: "MVVM + Clean Architecture"
    - di: "Hilt"
    
  networking:
    - retrofit: "REST client"
    - apollo: "GraphQL client"
    
  storage:
    - room: "Local database"
    - datastore: "Preferences"
    
  testing:
    - espresso: "UI tests"
    - junit: "Unit tests"
```

### 2.3 PWA Architecture
```yaml
PWAStack:
  framework: "Next.js PWA"
  
  features:
    - service_worker: "Workbox"
    - offline_support: "IndexedDB"
    - push_notifications: "Web Push"
    
  caching:
    - app_shell: "Cache First"
    - api_calls: "Network First"
    - media: "Stale While Revalidate"
```

---

## ⚙️ 3. Backend Architecture

### 3.1 API Service
```yaml
APIService:
  language: "Node.js / Python"
  framework: "Express / FastAPI"
  
  architecture:
    - microservices: boolean
    - monolith: boolean (hybrid approach)
    
  api_style:
    - rest: "Primary API"
    - graphql: "Flexible queries"
    - websocket: "Real-time"
```

### 3.2 Database Schema (Conceptual)

#### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  role ENUM('free', 'plus', 'unlimited', 'teacher'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
)
```

#### Study Sets Table
```sql
study_sets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  visibility ENUM('public', 'private', 'password', 'link'),
  password_hash VARCHAR,
  language VARCHAR,
  subject VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Cards Table
```sql
cards (
  id UUID PRIMARY KEY,
  study_set_id UUID REFERENCES study_sets(id),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  image_url VARCHAR,
  audio_url VARCHAR,
  position INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Classes Table
```sql
classes (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  subject VARCHAR,
  enrollment_code VARCHAR UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 3.3 Key Services
```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 Auth Service                                                │
│  ├── User authentication                                        │
│  ├── JWT token management                                       │
│  └── OAuth providers                                            │
│                                                                 │
│  📚 Study Set Service                                           │
│  ├── CRUD operations                                           │
│  ├── Version control                                            │
│  └── Search & indexing                                          │
│                                                                 │
│  👥 Class Service                                               │
│  ├── Class management                                           │
│  ├── Enrollment                                                 │
│  └── Assignments                                               │
│                                                                 │
│  📊 Progress Service                                            │
│  ├── SRS algorithm                                              │
│  ├── Statistics tracking                                         │
│  └── Analytics                                                 │
│                                                                 │
│  🔔 Notification Service                                        │
│  ├── Push notifications                                         │
│  ├── Email                                                     │
│  └── In-app                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 4. AI/ML Infrastructure

### 4.1 AI Service Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    AI SERVICE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   User     │───▶│   AI API    │───▶│  LLM        │        │
│  │   Input    │    │   Gateway   │    │  (GPT-4)    │        │
│  └─────────────┘    └──────┬──────┘    └─────────────┘        │
│                            │                                   │
│                            ▼                                   │
│                    ┌─────────────┐                           │
│                    │  Prompt     │                           │
│                    │  Engineering│                           │
│                    └─────────────┘                           │
│                            │                                   │
│                            ▼                                   │
│                    ┌─────────────┐                           │
│                    │   Content   │                           │
│                    │  Generator  │                           │
│                    └─────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 AI Features Implementation
```yaml
AIFeatures:
  magic_notes:
    input: "PDF, Images, Text"
    process: "OCR + LLM + Extractor"
    output: "Outlines, Summaries, Flashcards"
    
  flashcard_generation:
    input: "Text content"
    process: "NLP + LLM"
    output: "Terms + Definitions"
    
  ask_quizlet:
    input: "User question"
    process: "RAG + Context + LLM"
    output: "Answer + Citations"
    
  expert_solutions:
    input: "Textbook/Problem"
    process: "RAG + Expert Database"
    output: "Step-by-step solution"
```

### 4.3 ML Models Used
| Feature | Model Type | Provider |
|---------|-----------|----------|
| Text Generation | LLM (GPT-4) | OpenAI |
| Image Analysis | Vision AI | Google Cloud |
| OCR | Document AI | Google Cloud |
| Speech | Text-to-Speech | AWS Polly |
| Embeddings | Vector DB | Pinecone/Milvus |

---

## 🔧 5. Infrastructure & DevOps

### 5.1 Cloud Infrastructure
```yaml
CloudInfrastructure:
  provider: "AWS"
  
  compute:
    - ecs_fargate: "Containers"
    - lambda: "Serverless"
    - ec2: "Heavy workloads"
    
  database:
    - rds_postgresql: "Primary DB"
    - elasticache_redis: "Cache"
    - dynamodb: "NoSQL (sessions)"
    
  storage:
    - s3: "Media files"
    - cloudfront: "CDN"
    
  security:
    - iam: "Access control"
    - kms: "Encryption keys"
    - waf: "Web application firewall"
    - shield: "DDoS protection"
```

### 5.2 CI/CD Pipeline
```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐          │
│  │Commit│───▶│Build│───▶│ Test │───▶│ Staging│───▶│ Prod │    │
│  │Push │    │     │    │      │    │       │    │      │    │
│  └─────┘    └─────┘    └─────┘    └─────┘    └─────┘          │
│                                                                 │
│  Tools:                                                         │
│  ├── GitHub Actions / CircleCI                                  │
│  ├── Docker / Kubernetes                                        │
│  ├── Terraform / Pulumi                                         │
│  └── Datadog / New Relic                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Monitoring & Observability
```yaml
Monitoring:
  metrics:
    - datadog: "APM + Metrics"
    - prometheus: "Metrics collection"
    - grafana: "Dashboards"
    
  logging:
    - elk_stack: "Elasticsearch, Logstash, Kibana"
    - cloudwatch: "AWS logs"
    
  alerting:
    - pagerduty: "Incident management"
    - slack: "Notifications"
```

---

## 📊 6. Scalability Considerations

### 6.1 Scaling Strategy
```
┌─────────────────────────────────────────────────────────────────┐
│                    SCALING STRATEGY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Horizontal Scaling:                                            │
│  ├── Auto-scaling groups                                       │
│  ├── Load balancers                                             │
│  └── Database read replicas                                     │
│                                                                 │
│  Caching Layers:                                                │
│  ├── Redis (application cache)                                 │
│  ├── CDN (static assets)                                       │
│  └── Database query cache                                      │
│                                                                 │
│  Database Optimization:                                         │
│  ├── Indexing                                                  │
│  ├── Sharding (if needed)                                      │
│  └── Read replicas                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Performance Targets
| Metric | Target |
|--------|--------|
| API Response Time | < 200ms p95 |
| Page Load Time | < 2s |
| Mobile App Launch | < 2s cold start |
| Search Latency | < 100ms |
| Uptime | 99.9% |

---

## 🔐 7. Security Architecture

### 7.1 Security Layers
```yaml
SecurityLayers:
  network:
    - vpc: "Isolated network"
    - security_groups: "Firewall rules"
    - nacl: "Subnet rules"
    
  application:
    - https_only: boolean
    - csrf_protection: boolean
    - rate_limiting: boolean
    - input_validation: boolean
    
  data:
    - encryption_at_rest: boolean
    - encryption_in_transit: boolean
    - field_level_encryption: boolean
```

---

## 📱 8. Mobile-Specific Architecture

### 8.1 Offline Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    OFFLINE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    LOCAL STORAGE                         │   │
│  │                                                         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │   │
│  │  │ SQLite  │  │  Media  │  │ Sync   │                 │   │
│  │  │  /Room  │  │  Cache  │  │ Queue  │                 │   │
│  │  └─────────┘  └─────────┘  └─────────┘                 │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SYNC LAYER                            │   │
│  │                                                         │   │
│  │  ├── Conflict resolution                                  │   │
│  │  ├── Priority queue                                      │   │
│  │  └── Retry logic                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💰 9. Cost Estimation

### 9.1 Monthly Cost (MVP)
```
┌─────────────────────────────────────────────────────────────────┐
│                    COST ESTIMATION (MVP)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Infrastructure:                                                │
│  ├── Compute: $500-1000/month                                   │
│  ├── Database: $200-500/month                                  │
│  ├── Storage: $100-200/month                                   │
│  └── CDN: $100-300/month                                       │
│                                                                 │
│  AI Services:                                                  │
│  └── OpenAI API: $500-2000/month (usage-based)                │
│                                                                 │
│  Third-party:                                                   │
│  ├── Analytics: $0-100/month                                   │
│  ├── Monitoring: $100-300/month                                 │
│  └── Communication: $50-200/month                              │
│                                                                 │
│  Total: ~$1,500-4,500/month                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Tiếp Theo

Xem **Lộ Trình Triển Khai** trong file `14-implementation-roadmap.md`
