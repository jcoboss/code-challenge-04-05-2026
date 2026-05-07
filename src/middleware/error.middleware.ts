import { STATUS_CODES } from 'node:http';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
//import { logger } from '../lib/logger.js';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: STATUS_CODES[err.statusCode] ?? 'Error',
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
    return;
  }

  console.log({ err }, 'Unhandled error');

  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
