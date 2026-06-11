import { Router } from 'express';
import { healthCheck, getStatus } from '../controllers/public.controller';

const router = Router();

// GET /api/public/health
router.get('/health', healthCheck);

// GET /api/public/status
router.get('/status', getStatus);

export default router;
