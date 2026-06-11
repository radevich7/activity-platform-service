import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import logger from '../utils/logger';

declare global {
  // Preserve the client across hot-reloads in development.
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  const adapter = new PrismaNeon({ connectionString });
  // Cast needed because Prisma v7 adapter typing requires explicit adapter arg
  return new PrismaClient({ adapter } as any);
}

const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

// Reuse across hot-reloads in development
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

logger.debug('Prisma client initialised');

export default prisma;
