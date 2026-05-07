# Code Challenge Progress Tracker
## Senior Node.js REST API — Task Management System

---

## Tech Stack
- **Runtime:** Node.js 22 LTS (ESM + native fetch)
- **Framework:** Express
- **Language:** TypeScript (strict mode)
- **Database & ORM:** PostgreSQL + Prisma
- **Validation:** Zod
- **Testing:** Vitest (Unit + E2E)
- **Infrastructure:** Docker & Docker Compose
- **Security:** Argon2, JWT, Helmet, Rate Limiting
- **Logging:** Pino
- **Linting:** ESLint (typescript-eslint)

---

## Phase 1: Planning & Design ✅
- [x] 1.1 Requirement Analysis — Define functional requirements and acceptance criteria for Task/Project lifecycles → `docs/planning/requirements.md`
- [x] 1.2 Data Modeling — Design ERD in Prisma schema with proper indexing on foreign keys (`user_id`, `project_id`) → `docs/planning/data-model.md` + `prisma/schema.prisma`
- [x] 1.3 API Design — Map all endpoints following RESTful standards → `docs/planning/api-design.md`

---

## Phase 2: Scaffolding & Infrastructure ✅
- [x] 2.1 Repository Setup — Initialize Git, create structured `README.md` documenting tech decisions and setup
- [x] 2.2 Layered Architecture — Implement clean directory structure (Controller → Service → Repository/Data Access)
- [x] 2.3 Dockerization — Configure `Dockerfile` (multi-stage build) and `docker-compose.yml` for app + PostgreSQL
- [x] 2.4 Graceful Shutdown — Implement `SIGTERM`/`SIGINT` listeners to close DB connections and server cleanly
- [x] 2.5 Linting — Configure ESLint with `typescript-eslint` (strict ruleset), add `lint` and `lint:fix` npm scripts

---

## Phase 3: Core Development
- [ ] 3.1 Auth Layer — JWT strategy with Argon2 password hashing and middleware for protected routes
- [x] 3.2 CRUD — User, Project, Task services with full business logic
- [x] 3.3 Prisma Transactions — Use transactions for multi-table operations
- [x] 3.4 Zod Sanitizer Middleware — Validate and strip unknown properties from `req.body` and `req.params`
- [x] 3.5 Pagination — Standardize cursor or offset-based pagination for all list endpoints
- [ ] 3.6 Security Middleware — Rate limiting + security headers (Helmet)

---

## Phase 4: Observability & Reliability
- [ ] 4.1 Structured Logging — Pino logger with unique Correlation ID per request for distributed tracing
- [ ] 4.2 Global Error Handling — Custom `AppError` classes + centralized error handler middleware
- [ ] 4.3 Health Checks — `/health` and `/ready` endpoints for container orchestration

---

## Phase 5: Quality Assurance
- [ ] 5.1 Unit Tests — Test Service layer with mocked Prisma/Repository dependencies
- [ ] 5.2 Integration/E2E — Full flow: User Signup → Create Project → Add Task (test DB container)
- [ ] 5.3 Documentation — OpenAPI/Swagger interactive UI

---

## Notes

### Phase 1 Decisions
- UUID PKs chosen over serial integers to prevent resource enumeration.
- Cascade delete: `Project → Tasks` handled at DB level via Prisma `onDelete: Cascade`.
- Separate `creatorId` and `assigneeId` on Task to support delegation patterns.
- Composite indexes `(projectId, status)` and `(projectId, priority)` added for filtered list query performance.
- Offset-based pagination chosen over cursor-based for simplicity; can be upgraded later.
- Authorization model: resource ownership checked in the Service layer, not DB.
