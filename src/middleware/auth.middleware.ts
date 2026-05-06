import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Missing or malformed Authorization header'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (typeof decoded.sub !== 'string' || typeof decoded.email !== 'string') {
      next(new AppError(401, 'Invalid token payload'));
      return;
    }

    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}
