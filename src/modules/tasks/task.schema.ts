import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { paginationSchema } from '../../lib/pagination.js';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().uuid('Invalid assignee ID').optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export const listTasksSchema = paginationSchema.extend({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export const taskParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  id: z.string().uuid('Invalid task ID'),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksSchema>;
