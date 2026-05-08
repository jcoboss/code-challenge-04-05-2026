/**
 * Prisma seed script — populates the database with realistic demo data.
 * Idempotent: safe to run multiple times. Each entity is only created if it
 * does not already exist (users keyed by email; projects/tasks by name+owner
 * and title+project respectively).
 *
 * Run with:  npm run db:seed
 *            npx prisma db seed
 */

import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Upsert a user by email — only hashes the password on first creation. */
async function upsertUser(data: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return existing;

  return prisma.user.create({
    data: { ...data, password: await argon2.hash(data.password) },
  });
}

/** Find-or-create a project by (name, ownerId). */
async function upsertProject(data: {
  name: string;
  description?: string;
  ownerId: string;
}) {
  const existing = await prisma.project.findFirst({
    where: { name: data.name, ownerId: data.ownerId },
  });
  if (existing) return existing;

  return prisma.project.create({ data });
}

/** Find-or-create a task by (title, projectId). */
async function upsertTask(data: {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  creatorId: string;
  assigneeId?: string;
  dueDate?: Date;
}) {
  const existing = await prisma.task.findFirst({
    where: { title: data.title, projectId: data.projectId },
  });
  if (existing) return existing;

  return prisma.task.create({ data });
}

// ---------------------------------------------------------------------------
// Seed check — skip entirely if all three entity types are fully present
// ---------------------------------------------------------------------------

async function isSeedComplete(expectedUsers: string[], expectedProjects: string[]): Promise<boolean> {
  const [userCount, projectCount, taskCount] = await Promise.all([
    prisma.user.count({ where: { email: { in: expectedUsers } } }),
    prisma.project.count({ where: { name: { in: expectedProjects } } }),
    prisma.task.count(),
  ]);

  return (
    userCount === expectedUsers.length &&
    projectCount === expectedProjects.length &&
    taskCount > 0
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const SEED_EMAILS = ['alice@example.com', 'bob@example.com', 'carol@example.com'];
  const SEED_PROJECTS = ['Task Management API', 'Mobile App', 'Marketing Website'];

  if (await isSeedComplete(SEED_EMAILS, SEED_PROJECTS)) {
    console.log('⏭️  Seed data already present — nothing to do.');
    return;
  }

  console.log('🌱 Seeding database...');

  // ── 1. Users ───────────────────────────────────────────────────────────────
  const [alice, bob, carol] = await Promise.all([
    upsertUser({ name: 'Alice Johnson', email: 'alice@example.com', password: 'Password123!' }),
    upsertUser({ name: 'Bob Smith',     email: 'bob@example.com',   password: 'Password123!' }),
    upsertUser({ name: 'Carol Williams',email: 'carol@example.com', password: 'Password123!' }),
  ]);

  console.log(`  ✓ Users: ${alice.email}, ${bob.email}, ${carol.email}`);

  // ── 2. Projects ────────────────────────────────────────────────────────────
  const [apiProject, mobileProject] = await Promise.all([
    upsertProject({
      name: 'Task Management API',
      description: 'Backend REST API built with Node.js, Express, and Prisma.',
      ownerId: alice.id,
    }),
    upsertProject({
      name: 'Mobile App',
      description: 'React Native front-end for the task management platform.',
      ownerId: alice.id,
    }),
    upsertProject({
      name: 'Marketing Website',
      description: 'Public-facing landing page and blog.',
      ownerId: bob.id,
    }),
  ]);

  console.log(`  ✓ Projects: ${apiProject.name}, ${mobileProject.name}`);

  // ── 3. Tasks ───────────────────────────────────────────────────────────────
  await Promise.all([
    // API Project
    upsertTask({
      title: 'Set up Express + TypeScript scaffold',
      description: 'Initialize project, configure tsconfig and eslint.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: apiProject.id,
      creatorId: alice.id,
      assigneeId: alice.id,
    }),
    upsertTask({
      title: 'Implement JWT authentication',
      description: 'Register, login endpoints with Argon2 hashing and JWT issuance.',
      status: TaskStatus.DONE,
      priority: TaskPriority.URGENT,
      projectId: apiProject.id,
      creatorId: alice.id,
      assigneeId: alice.id,
    }),
    upsertTask({
      title: 'Build CRUD for Projects and Tasks',
      description: 'Controller → Service → Prisma layer for all resource endpoints.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: apiProject.id,
      creatorId: alice.id,
      assigneeId: bob.id,
    }),
    upsertTask({
      title: 'Write unit tests for service layer',
      description: 'Mock Prisma and test all business logic branches.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: apiProject.id,
      creatorId: alice.id,
      assigneeId: bob.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }),
    upsertTask({
      title: 'Add OpenAPI / Swagger documentation',
      description: 'Auto-generate docs from route schemas.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: apiProject.id,
      creatorId: alice.id,
      assigneeId: carol.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    }),

    // Mobile Project
    upsertTask({
      title: 'Design login and dashboard screens',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: mobileProject.id,
      creatorId: alice.id,
      assigneeId: carol.id,
    }),
    upsertTask({
      title: 'Integrate API authentication',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: mobileProject.id,
      creatorId: alice.id,
      assigneeId: bob.id,
    }),
    upsertTask({
      title: 'Implement offline sync',
      description: 'Cache tasks locally and sync when connection is restored.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: mobileProject.id,
      creatorId: alice.id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
  ]);

  console.log('  ✓ Tasks created');
  console.log('');
  console.log('✅ Seed complete. Demo credentials:');
  console.log('   alice@example.com  /  Password123!');
  console.log('   bob@example.com    /  Password123!');
  console.log('   carol@example.com  /  Password123!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());