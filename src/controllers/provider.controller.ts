import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

/**
 * GET /api/provider
 * Returns a list of all providers (placeholder — replace with DB query).
 */
export const getAllProviders = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        providers: [],
      },
    });
  }
);

/**
 * GET /api/provider/:id
 * Returns a single provider by ID.
 */
export const getProvider = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // TODO: replace with DB lookup, e.g. await Provider.findById(id)
  if (!id) {
    return next(new AppError('No provider ID provided.', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      provider: null, // replace with DB result
    },
  });
});

/**
 * POST /api/provider
 * Creates a new provider.
 */
export const createProvider = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // TODO: validate req.body and persist to DB
    res.status(201).json({
      status: 'success',
      data: {
        provider: req.body,
      },
    });
  }
);

/**
 * PATCH /api/provider/:id
 * Updates an existing provider.
 */
export const updateProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('No provider ID provided.', 400));
    }

    // TODO: await Provider.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json({
      status: 'success',
      data: {
        provider: { id, ...req.body },
      },
    });
  }
);

/**
 * DELETE /api/provider/:id
 * Deletes a provider.
 */
export const deleteProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('No provider ID provided.', 400));
    }

    // TODO: await Provider.findByIdAndDelete(id)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
