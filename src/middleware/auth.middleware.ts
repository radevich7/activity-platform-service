import { Request, Response, NextFunction } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { isAuth0Configured } from '../config/auth0';
import AppError from '../utils/appError';

/**
 * Protects routes with Auth0 authentication.
 * Falls back to a 401 error if Auth0 is not configured (e.g. env vars missing).
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!isAuth0Configured) {
    return next(new AppError('Authentication is not configured on this server.', 401));
  }
  requiresAuth()(req, res, next);
};
