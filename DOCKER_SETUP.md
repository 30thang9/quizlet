# 🐳 Docker Setup Guide

This guide helps you run the Quizlet application using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

## Quick Start

1. **Clone the repository**
   ```bash
   cd quizlet
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Check services are running**
   ```bash
   docker-compose ps
   ```

4. **Access the application**
   - Web App: http://localhost:4000
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/docs

## Services

| Service | Port | Description |
|---------|------|-------------|
| `web` | 4000 | Next.js web application |
| `api` | 3000 | NestJS API server |
| `db` | 5432 | PostgreSQL database |
| `redis` | 6379 | Redis cache |

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Clean up (remove volumes)
```bash
docker-compose down -v
```

## Environment Variables

The Docker Compose file uses sensible defaults for local development. To customize:

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit the values as needed.

### Key Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `JWT_SECRET` | (auto-generated) | JWT signing secret |
| `EMAIL_PROVIDER` | `mock` | Email provider (mock/resend/sendgrid) |
| `AI_PROVIDER` | `mock` | AI provider (mock/openai/gemini/claude) |

## Production Deployment

For production, use the `docker-compose.example.yml` file with environment-specific values:

```bash
# Set required environment variables
export POSTGRES_USER=your_user
export POSTGRES_PASSWORD=your_secure_password
export POSTGRES_DB=quizlet
export JWT_SECRET=your-secure-jwt-secret
export JWT_REFRESH_SECRET=your-secure-refresh-secret
export OPENAI_API_KEY=sk-your-openai-key
export RESEND_API_KEY=re_your_resend_key

# Start production services
docker-compose -f docker-compose.example.yml up -d
```

## Troubleshooting

### Database connection issues
```bash
# Check if database is healthy
docker-compose ps db

# View database logs
docker-compose logs db
```

### API not responding
```bash
# Check API logs
docker-compose logs api

# Rebuild and restart API
docker-compose up -d --build api
```

### Database migrations
```bash
# Run migrations inside the API container
docker-compose exec api npm run db:migrate
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

## Development vs Production

| Mode | File | Features |
|------|------|----------|
| Development | `docker-compose.yml` | Mock services, debug logs |
| Production | `docker-compose.example.yml` | Real services, optimized builds |

## Resource Requirements

Minimum recommended:
- 4GB RAM
- 2 CPU cores

For best performance:
- 8GB RAM
- 4+ CPU cores
