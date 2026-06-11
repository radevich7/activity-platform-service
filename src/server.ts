import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { Server } from 'http';
import * as mongoose from 'mongoose';
import app from './app';
import logger from './utils/logger';

const port = process.env.PORT || 4000;
const DB = process.env.DATABASE?.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '') || '';

let server: Server | undefined;

// ─── Process-level error guards ───────────────────────────────────────────────
process.on('uncaughtException', (err: Error) => {
  logger.fatal({ err }, 'UNCAUGHT EXCEPTION 💥 — shutting down');
  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  logger.fatal({ err }, 'UNHANDLED REJECTION 💥 — shutting down');
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received — shutting down gracefully');
  if (server) {
    server.close(() => logger.info('💥 Process terminated'));
  }
});

// ─── Database connection ──────────────────────────────────────────────────────
async function connectToMongoDatabase(): Promise<void> {
  try {
    await mongoose.connect(DB);
    logger.info('✅ DB connection successful');
  } catch (err: unknown) {
    logger.fatal({ err }, '❌ DB connection failed');
    process.exit(1);
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
(async () => {
  // await connectToMongoDatabase(); Not in use

  server = app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port} [${process.env.NODE_ENV}]`);
  });
})();
