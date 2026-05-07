import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      correlationId: req.headers['x-correlation-id'],
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}
