import { TaskStatus, TaskPriority } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import { toSkipTake, toPaginationMeta, type PaginationMeta } from '../../lib/pagination.js';
import type { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from './task.schema.js';

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  creatorId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function toTaskDTO(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  creatorId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): TaskDTO {
  return { ...task };
}

async function assertProjectOwner(projectId: string, userId: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) throw new AppError(404, 'Project not found');
  if (project.ownerId !== userId) throw new AppError(403, 'Forbidden');
}

export async function listTasks(
  projectId: string,
  userId: string,
  query: ListTasksQuery,
): Promise<{ data: TaskDTO[]; meta: PaginationMeta }> {
  await assertProjectOwner(projectId, userId);

  const where = {
    projectId,
    ...(query.status !== undefined && { status: query.status }),
    ...(query.priority !== undefined && { priority: query.priority }),
  };

  const { skip, take } = toSkipTake(query);

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.task.count({ where }),
  ]);

  return { data: tasks.map(toTaskDTO), meta: toPaginationMeta(total, query) };
}

export async function createTask(
  projectId: string,
  userId: string,
  input: CreateTaskInput,
): Promise<TaskDTO> {
  // Verify assignee exists if provided
  if (input.assigneeId !== undefined) {
    const assignee = await prisma.user.findUnique({ where: { id: input.assigneeId } });
    if (!assignee) throw new AppError(422, 'Assignee user not found');
  }

  // Verify ownership + create atomically
  const task = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError(404, 'Project not found');
    if (project.ownerId !== userId) throw new AppError(403, 'Forbidden');

    return tx.task.create({
      data: { ...input, projectId, creatorId: userId },
    });
  });

  return toTaskDTO(task);
}

export async function getTask(
  projectId: string,
  taskId: string,
  userId: string,
): Promise<TaskDTO> {
  await assertProjectOwner(projectId, userId);

  const task = await prisma.task.findUnique({ where: { id: taskId, projectId } });

  if (!task) throw new AppError(404, 'Task not found');

  return toTaskDTO(task);
}

export async function updateTask(
  projectId: string,
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
): Promise<TaskDTO> {
  await assertProjectOwner(projectId, userId);

  // Verify assignee exists if being changed
  if (input.assigneeId !== undefined) {
    const assignee = await prisma.user.findUnique({ where: { id: input.assigneeId } });
    if (!assignee) throw new AppError(422, 'Assignee user not found');
  }

  const task = await prisma.task.findUnique({ where: { id: taskId, projectId } });

  if (!task) throw new AppError(404, 'Task not found');

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: input,
  });

  return toTaskDTO(updated);
}

export async function deleteTask(
  projectId: string,
  taskId: string,
  userId: string,
): Promise<void> {
  await assertProjectOwner(projectId, userId);

  const task = await prisma.task.findUnique({ where: { id: taskId, projectId } });

  if (!task) throw new AppError(404, 'Task not found');

  await prisma.task.delete({ where: { id: taskId } });
}
