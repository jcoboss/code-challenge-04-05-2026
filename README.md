# Task Management System API

Senior Node.js REST API challenge — a fully-featured task management system built with Express, TypeScript, PostgreSQL, and Prisma.

## Tech Stack

| Concern        | Tool                              |
|----------------|-----------------------------------|
| Runtime        | Node.js 22 LTS (ESM + native fetch) |
| Framework      | Express 5                         |
| Language       | TypeScript 5 (strict mode)        |
| Database / ORM | PostgreSQL + Prisma               |
| Validation     | Zod                               |
| Testing        | Vitest (Unit + E2E)               |
| Containers     | Docker & Docker Compose           |
| Security       | Argon2, JWT, Helmet, Rate Limiting |
| Logging        | Pino + pino-http                  |
| Linting        | ESLint + typescript-eslint        |

## Architecture

```
src/
├── app.ts                         # Express app (middleware + routes)
├── server.ts                      # HTTP server + graceful shutdown
├── config/
│   └── env.ts                     # Zod-validated environment variables
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   └── logger.ts                  # Pino logger instance
├── errors/
│   └── AppError.ts                # Base application error class
├── middleware/
│   ├── correlationId.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts     # Zod sanitizer (Phase 3.4)
└── modules/
    ├── health/                    # GET /health, GET /ready
    ├── auth/                      # POST /api/v1/auth/register|login
    ├── users/                     # /api/v1/users/me
    ├── projects/                  # /api/v1/projects
    └── tasks/                     # /api/v1/projects/:projectId/tasks
```

## Prerequisites

- Node.js 22 LTS
- Docker & Docker Compose

## Setup

### Local Development

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start PostgreSQL
docker compose up db -d

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

### Docker (full stack)

```bash
docker compose up --build
```

## Scripts

| Script           | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start dev server with hot-reload (tsx)   |
| `npm run build`  | Compile TypeScript → `dist/`             |
| `npm start`      | Run compiled production server           |
| `npm run lint`   | Run ESLint                               |
| `npm run lint:fix` | Run ESLint with auto-fix               |
| `npm test`       | Run Vitest test suite                    |

## API

Base URL: `/api/v1`

### Health (public)

| Method | Path      | Description                       |
|--------|-----------|-----------------------------------|
| GET    | /health   | Liveness — server is running      |
| GET    | /ready    | Readiness — DB connection is alive |

See [`docs/planning/api-design.md`](docs/planning/api-design.md) for the full API specification.

## Environment Variables

| Variable       | Required | Default       | Description               |
|----------------|----------|---------------|---------------------------|
| `DATABASE_URL` | ✅       | —             | PostgreSQL connection URL  |
| `JWT_SECRET`   | ✅       | —             | ≥ 32 character secret      |
| `PORT`         | ❌       | `3000`        | HTTP port                  |
| `NODE_ENV`     | ❌       | `development` | Runtime environment        |
| `JWT_EXPIRES_IN` | ❌     | `15m`         | JWT expiry duration        |
