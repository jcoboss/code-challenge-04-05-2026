# Phase 1.2 — Data Modeling (ERD)

## Entity Relationship Overview

```
User (1) ──────< Project (N)          User owns many Projects
Project (1) ───< Task (N)             Project contains many Tasks
User (1) ──────< Task (N) [creator]   User creates many Tasks
User (1) ──────< Task (N) [assignee]  User can be assigned many Tasks (optional)
```

---

## Entities

### User
| Column      | Type      | Constraints                  |
|-------------|-----------|------------------------------|
| id          | UUID      | PK, default uuid()           |
| email       | String    | UNIQUE, NOT NULL             |
| name        | String    | NOT NULL                     |
| password    | String    | NOT NULL (Argon2 hash)       |
| createdAt   | DateTime  | default now()                |
| updatedAt   | DateTime  | auto-updated                 |

**Indexes:** `email` (unique lookup on login)

---

### Project
| Column      | Type      | Constraints                         |
|-------------|-----------|-------------------------------------|
| id          | UUID      | PK, default uuid()                  |
| name        | String    | NOT NULL                            |
| description | String?   | nullable                            |
| ownerId     | UUID      | FK → User.id, NOT NULL              |
| createdAt   | DateTime  | default now()                       |
| updatedAt   | DateTime  | auto-updated                        |

**Indexes:** `ownerId` (list projects by owner)

---

### Task
| Column      | Type          | Constraints                                  |
|-------------|---------------|----------------------------------------------|
| id          | UUID          | PK, default uuid()                           |
| title       | String        | NOT NULL                                     |
| description | String?       | nullable                                     |
| status      | TaskStatus    | default TODO                                 |
| priority    | TaskPriority  | default MEDIUM                               |
| dueDate     | DateTime?     | nullable                                     |
| projectId   | UUID          | FK → Project.id, NOT NULL, CASCADE DELETE    |
| creatorId   | UUID          | FK → User.id, NOT NULL                       |
| assigneeId  | UUID?         | FK → User.id, nullable                       |
| createdAt   | DateTime      | default now()                                |
| updatedAt   | DateTime      | auto-updated                                 |

**Indexes:** `projectId`, `creatorId`, `assigneeId`, `status`, `priority`

---

## Enums

### TaskStatus
- `TODO` — default, not yet started
- `IN_PROGRESS` — actively being worked on
- `DONE` — completed
- `CANCELLED` — abandoned

### TaskPriority
- `LOW`
- `MEDIUM` — default
- `HIGH`
- `URGENT`

---

## Key Design Decisions

1. **UUID primary keys** — avoids sequential ID enumeration (security).
2. **Cascade delete on Task.projectId** — deleting a project removes all its tasks atomically.
3. **Separate creator/assignee relations on Task** — a task creator and assignee can be different users.
4. **Indexes on all FK columns** — ensures efficient JOIN/WHERE queries as data grows.
5. **Composite index consideration** — `(projectId, status)` and `(projectId, priority)` can be added later for filtered list queries.
