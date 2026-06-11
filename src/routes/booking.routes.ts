import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/booking.controller';

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

// GET  /api/bookings
router.get('/', getAllBookings);

// GET  /api/bookings/:id
router.get('/:id', getBooking);

// POST /api/bookings
router.post('/', createBooking);

// PATCH /api/bookings/:id
router.patch('/:id', updateBooking);

// DELETE /api/bookings/:id
router.delete('/:id', deleteBooking);

export default router;
