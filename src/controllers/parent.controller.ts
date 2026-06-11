import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

/**
 * GET /api/parent
 * Returns a list of all parents (placeholder — replace with DB query).
 */
export const getAllParents = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        parents: [],
      },
    });
  }
);

/**
 * GET /api/parent/:id
 * Returns a single parent by ID.
 */
export const getParent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No parent ID provided.', 400));
  }

  // TODO: await Parent.findById(id)
  res.status(200).json({
    status: 'success',
    data: {
      parent: null,
    },
  });
});

/**
 * POST /api/parent
 * Creates a new parent profile.
 */
export const createParent = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  // TODO: validate req.body and persist to DB
  res.status(201).json({
    status: 'success',
    data: {
      parent: req.body,
    },
  });
});

/**
 * PATCH /api/parent/:id
 * Updates a parent profile.
 */
export const updateParent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No parent ID provided.', 400));
  }

  // TODO: await Parent.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  res.status(200).json({
    status: 'success',
    data: {
      parent: { id, ...req.body },
    },
  });
});

/**
 * DELETE /api/parent/:id
 * Deletes a parent profile.
 */
export const deleteParent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('No parent ID provided.', 400));
  }

  // TODO: await Parent.findByIdAndDelete(id)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
