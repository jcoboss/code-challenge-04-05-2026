import { z } from 'zod';

export const updateMeSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(128).optional(),
  })
  .refine((data) => data.name !== undefined || data.password !== undefined, {
    message: 'At least one field (name or password) must be provided',
  });

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
