import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

/**
 * GET /api/bookings
 * Returns all bookings for the authenticated user.
 */
export const getAllBookings = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        bookings: [],
      },
    });
  }
);

/**
 * GET /api/bookings/:id
 * Returns a single booking by ID.
 */
export const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No booking ID provided.', 400));
  }

  // TODO: await Booking.findById(id)
  res.status(200).json({
    status: 'success',
    data: {
      booking: null,
    },
  });
});

/**
 * POST /api/bookings
 * Creates a new booking.
 */
export const createBooking = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // TODO: validate req.body, check availability, persist to DB
    res.status(201).json({
      status: 'success',
      data: {
        booking: req.body,
      },
    });
  }
);

/**
 * PATCH /api/bookings/:id
 * Updates a booking (e.g. reschedule, cancel).
 */
export const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No booking ID provided.', 400));
  }

  // TODO: await Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  res.status(200).json({
    status: 'success',
    data: {
      booking: { id, ...req.body },
    },
  });
});

/**
 * DELETE /api/bookings/:id
 * Cancels / deletes a booking.
 */
export const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No booking ID provided.', 400));
  }

  // TODO: await Booking.findByIdAndDelete(id)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
