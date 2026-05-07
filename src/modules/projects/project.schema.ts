import { z } from 'zod';
import { paginationSchema } from '../../lib/pagination.js';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field (name or description) must be provided',
  });

export const listProjectsSchema = paginationSchema;

export const projectParamSchema = z.object({ id: z.string().uuid('Invalid project ID') });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsSchema>;
