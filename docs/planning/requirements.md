# Phase 1.1 — Requirement Analysis

## Functional Requirements

### Authentication
- FR-01: A user can register with a unique email, name, and password.
- FR-02: Passwords must be hashed using Argon2 before storage.
- FR-03: A user can log in with email + password and receive a signed JWT.
- FR-04: All resource endpoints (projects, tasks, users/me) require a valid JWT.

### Users
- FR-05: An authenticated user can retrieve their own profile (`/users/me`).
- FR-06: An authenticated user can update their own name and/or password.
- FR-07: An authenticated user can delete their own account (cascades their owned projects/tasks).

### Projects
- FR-08: An authenticated user can create a project (they become the owner).
- FR-09: A user can list only the projects they own (paginated).
- FR-10: A user can view, update, or delete a project only if they are the owner.
- FR-11: Deleting a project cascades deletion of all its tasks.

### Tasks
- FR-12: An authenticated user can create a task inside a project they own.
- FR-13: Tasks have a `status` (TODO | IN_PROGRESS | DONE | CANCELLED) and a `priority` (LOW | MEDIUM | HIGH | URGENT).
- FR-14: A task can have an optional `assigneeId` pointing to any registered user.
- FR-15: A user can list all tasks of a project they own (paginated, filterable by status/priority).
- FR-16: A user can view, update, or delete a task only within a project they own.
- FR-17: Tasks support an optional `dueDate` field.

### Pagination
- FR-18: All list endpoints support offset-based pagination via `page` and `limit` query parameters.
- FR-19: List responses include `{ data, meta: { total, page, limit, totalPages } }`.

---

## Non-Functional Requirements
- NFR-01: All request bodies and params are validated and sanitized via Zod (unknown fields stripped).
- NFR-02: Rate limiting applied globally (e.g., 100 req/min per IP).
- NFR-03: Security headers applied via `helmet`.
- NFR-04: Structured JSON logs with a unique `correlationId` per request (Pino).
- NFR-05: Graceful shutdown handles `SIGTERM`/`SIGINT` (close DB + server).
- NFR-06: `/health` and `/ready` endpoints for container orchestration.
- NFR-07: OpenAPI/Swagger documentation exposed at `/docs`.

---

## Acceptance Criteria

### AC — Auth
- [ ] `POST /api/v1/auth/register` with valid payload returns `201` + user object (no password).
- [ ] `POST /api/v1/auth/register` with duplicate email returns `409 Conflict`.
- [ ] `POST /api/v1/auth/login` with valid credentials returns `200` + `{ accessToken }`.
- [ ] `POST /api/v1/auth/login` with wrong password returns `401 Unauthorized`.
- [ ] Accessing a protected route without JWT returns `401 Unauthorized`.

### AC — Projects
- [ ] `POST /api/v1/projects` creates a project owned by the requesting user.
- [ ] `GET /api/v1/projects` returns only the authenticated user's projects.
- [ ] `GET /api/v1/projects/:id` returns `404` if project doesn't belong to the user.
- [ ] `DELETE /api/v1/projects/:id` removes the project and all its tasks.

### AC — Tasks
- [ ] `POST /api/v1/projects/:projectId/tasks` creates a task only if user owns the project.
- [ ] `GET /api/v1/projects/:projectId/tasks` supports `?page`, `?limit`, `?status`, `?priority` filters.
- [ ] `PATCH /api/v1/projects/:projectId/tasks/:id` allows updating any writable field.
- [ ] Assigning a task to a non-existent `assigneeId` returns `422 Unprocessable Entity`.
- [ ] `DELETE /api/v1/projects/:projectId/tasks/:id` returns `204 No Content`.

### AC — Errors
- [ ] All error responses follow `{ statusCode, error, message }` shape.
- [ ] Validation errors return `400` with a structured list of field errors.
- [ ] Unexpected server errors return `500` with a generic message (no stack trace in production).
