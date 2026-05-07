import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function toSkipTake({ page, limit }: PaginationQuery): { skip: number; take: number } {
  return { skip: (page - 1) * limit, take: limit };
}

export function toPaginationMeta(total: number, query: PaginationQuery): PaginationMeta {
  return {
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
}
