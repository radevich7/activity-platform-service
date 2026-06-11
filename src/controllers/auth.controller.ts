import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

/**
 * GET /api/auth/status
 * Returns the current authentication status of the user.
 */
export const getAuthStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const isAuthenticated = req.oidc?.isAuthenticated() ?? false;

    res.status(200).json({
      status: 'success',
      data: {
        isAuthenticated,
        user: isAuthenticated ? req.oidc?.user : null,
      },
    });
  }
);

/**
 * POST /api/auth/logout
 * Logs the user out via Auth0.
 */
export const logout = (req: Request, res: Response, _next: NextFunction): void => {
  res.oidc.logout({ returnTo: process.env.BASE_URL || 'http://localhost:4000' });
};
