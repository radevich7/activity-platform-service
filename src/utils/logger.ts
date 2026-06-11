import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Shared pino logger instance.
 *
 * Development : pretty-printed, coloured output via pino-pretty
 * Production  : newline-delimited JSON (structured, machine-readable)
 *
 * Usage anywhere in the codebase:
 *
 *   import logger from '../utils/logger';
 *
 *   logger.info('Server started');
 *   logger.warn({ userId }, 'Token about to expire');
 *   logger.error({ err }, 'Unhandled error');
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),

  // In development use pino-pretty for human-readable output.
  // pino-pretty is a dev-only transport; in production this block is omitted
  // so logs are emitted as plain JSON (ideal for Datadog, CloudWatch, etc.).
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Rename pino's default `msg` field to `message` for wider compatibility.
  messageKey: 'message',

  // Base fields added to every log line.
  base: {
    env: process.env.NODE_ENV,
  },

  // Redact sensitive fields so they never appear in log output.
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'body.password',
      'body.token',
    ],
    censor: '[REDACTED]',
  },
});

export default logger;
