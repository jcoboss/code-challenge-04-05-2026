import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
//import { pinoHttp } from 'pino-http';
//import { logger } from './lib/logger.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { healthRouter } from './modules/health/health.router.js';
import { authRouter } from './modules/auth/auth.router.js';
import { userRouter } from './modules/users/user.router.js';
import { projectRouter } from './modules/projects/project.router.js';
import { taskRouter } from './modules/tasks/task.router.js';

export const app = express();

// Security headers
app.use(helmet());

// Rate limiting — 100 requests per minute per IP
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// HTTP request logging
//app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json());

// Correlation ID header
app.use(correlationIdMiddleware);

// Health probes (no /api/v1 prefix — used by container orchestrators)
app.use(healthRouter);

// API v1 routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/projects/:projectId/tasks', taskRouter);

// Global error handler (must be last)
app.use(errorMiddleware);
