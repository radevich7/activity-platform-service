import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

/**
 * GET /api/public/health
 * Simple health-check endpoint — no authentication required.
 */
export const healthCheck = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * GET /api/public/status
 * Returns basic public API status info.
 */
export const getStatus = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    data: {
      version: '1.0.0',
      name: 'activity-platform API',
    },
  });
});
