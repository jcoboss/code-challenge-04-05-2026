# Phase 1.3 — API Design

## Base URL
```
/api/v1
```

## Response Conventions

### Success
```json
// Single resource
{ "data": { ...resource } }

// List
{
  "data": [ ...resources ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Error
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [ { "field": "email", "message": "Invalid email" } ]
}
```

---

## Endpoints

### Health (public)

| Method | Path      | Description                              |
|--------|-----------|------------------------------------------|
| GET    | /health   | Liveness probe — server is running       |
| GET    | /ready    | Readiness probe — DB connection is alive |

---

### Auth (public)

| Method | Path                      | Body                              | Response        | Description          |
|--------|---------------------------|-----------------------------------|-----------------|----------------------|
| POST   | /api/v1/auth/register     | `{ name, email, password }`       | 201 UserDTO     | Register new user    |
| POST   | /api/v1/auth/login        | `{ email, password }`             | 200 `{ accessToken }` | Login, get JWT |

> **Note:** JWT is returned as a Bearer token. Clients include it as `Authorization: Bearer <token>`.

---

### Users (protected)

| Method | Path              | Body                          | Response    | Description              |
|--------|-------------------|-------------------------------|-------------|--------------------------|
| GET    | /api/v1/users/me  | —                             | 200 UserDTO | Get own profile          |
| PATCH  | /api/v1/users/me  | `{ name?, password? }`        | 200 UserDTO | Update own profile       |
| DELETE | /api/v1/users/me  | —                             | 204         | Delete own account       |

---

### Projects (protected — owner only)

| Method | Path                   | Query / Body                         | Response           | Description             |
|--------|------------------------|--------------------------------------|--------------------|-------------------------|
| GET    | /api/v1/projects       | `?page=1&limit=20`                   | 200 ProjectList    | List owned projects     |
| POST   | /api/v1/projects       | `{ name, description? }`             | 201 ProjectDTO     | Create project          |
| GET    | /api/v1/projects/:id   | —                                    | 200 ProjectDTO     | Get project by ID       |
| PATCH  | /api/v1/projects/:id   | `{ name?, description? }`            | 200 ProjectDTO     | Update project          |
| DELETE | /api/v1/projects/:id   | —                                    | 204                | Delete project + tasks  |

---

### Tasks (protected — project owner only)

| Method | Path                                       | Query / Body                                                                          | Response      | Description              |
|--------|--------------------------------------------|---------------------------------------------------------------------------------------|---------------|--------------------------|
| GET    | /api/v1/projects/:projectId/tasks          | `?page=1&limit=20&status=TODO&priority=HIGH`                                          | 200 TaskList  | List tasks in project    |
| POST   | /api/v1/projects/:projectId/tasks          | `{ title, description?, status?, priority?, dueDate?, assigneeId? }`                  | 201 TaskDTO   | Create task              |
| GET    | /api/v1/projects/:projectId/tasks/:id      | —                                                                                     | 200 TaskDTO   | Get task by ID           |
| PATCH  | /api/v1/projects/:projectId/tasks/:id      | `{ title?, description?, status?, priority?, dueDate?, assigneeId? }`                 | 200 TaskDTO   | Update task              |
| DELETE | /api/v1/projects/:projectId/tasks/:id      | —                                                                                     | 204           | Delete task              |

---

## DTOs (Response Shapes)

### UserDTO
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "updatedAt": "2026-05-04T00:00:00.000Z"
}
```
> `password` is **never** returned.

### ProjectDTO
```json
{
  "id": "uuid",
  "name": "My Project",
  "description": "Optional description",
  "ownerId": "uuid",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "updatedAt": "2026-05-04T00:00:00.000Z"
}
```

### TaskDTO
```json
{
  "id": "uuid",
  "title": "Fix login bug",
  "description": null,
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": null,
  "projectId": "uuid",
  "creatorId": "uuid",
  "assigneeId": "uuid",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "updatedAt": "2026-05-04T00:00:00.000Z"
}
```

---

## Authorization Rules Summary

| Resource  | Who can access?                          |
|-----------|------------------------------------------|
| User/me   | Authenticated user (self only)           |
| Projects  | Authenticated user who owns the project  |
| Tasks     | Authenticated user who owns the project  |

---

## HTTP Status Codes Used

| Code | Meaning                          |
|------|----------------------------------|
| 200  | OK                               |
| 201  | Created                          |
| 204  | No Content (delete success)      |
| 400  | Bad Request (validation error)   |
| 401  | Unauthorized (missing/bad JWT)   |
| 403  | Forbidden (not owner)            |
| 404  | Not Found                        |
| 409  | Conflict (e.g. duplicate email)  |
| 422  | Unprocessable Entity             |
| 429  | Too Many Requests (rate limit)   |
| 500  | Internal Server Error            |
