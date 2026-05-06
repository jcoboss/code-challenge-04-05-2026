import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const existing = req.headers['x-correlation-id'];
  const correlationId =
    typeof existing === 'string' && existing.length > 0 ? existing : randomUUID();

  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  next();
}
