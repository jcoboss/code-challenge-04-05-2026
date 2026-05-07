import { createLogger, format, transports } from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, json, colorize, simple, errors } = format;

// Always write JSON + timestamp to files so logs are machine-parseable
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format:
    env.NODE_ENV === 'production'
      ? fileFormat
      : combine(colorize(), simple()),
  transports: [
    new transports.Console(),
    // File transports — skipped in production (container stdout is captured by the orchestrator)
    ...(env.NODE_ENV !== 'production'
      ? [
          new transports.File({ filename: 'logs/app.log', format: fileFormat }),
          new transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
        ]
      : []),
  ],
});
