import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getAllParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
} from '../controllers/parent.controller';

const router = Router();

// All parent routes require authentication
router.use(requireAuth);

// GET  /api/parent
router.get('/', getAllParents);

// GET  /api/parent/:id
router.get('/:id', getParent);

// POST /api/parent
router.post('/', createParent);

// PATCH /api/parent/:id
router.patch('/:id', updateParent);

// DELETE /api/parent/:id
router.delete('/:id', deleteParent);

export default router;
