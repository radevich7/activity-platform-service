import { Router } from 'express';
import { getAuthStatus, logout } from '../controllers/auth.controller';

const router = Router();

// Auth0 login/callback/logout are handled automatically by express-openid-connect
// These are custom application-level auth routes

// GET  /api/auth/status  — returns current session auth state
router.get('/status', getAuthStatus);

// POST /api/auth/logout  — triggers Auth0 logout flow
router.post('/logout', logout);

export default router;
