import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getAllProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} from '../controllers/provider.controller';

const router = Router();

// All provider routes require authentication
router.use(requireAuth);

// GET  /api/provider
router.get('/', getAllProviders);

// GET  /api/provider/:id
router.get('/:id', getProvider);

// POST /api/provider
router.post('/', createProvider);

// PATCH /api/provider/:id
router.patch('/:id', updateProvider);

// DELETE /api/provider/:id
router.delete('/:id', deleteProvider);

export default router;
