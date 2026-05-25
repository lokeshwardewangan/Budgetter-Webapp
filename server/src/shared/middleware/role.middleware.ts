import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';
import UserModel from '../../modules/user/user.model.js';

// Loads the user's role and verifies it matches an allowed value. Mount
// after verifyJwtToken so req.userId is populated.
export const requireRole =
  (...allowed: string[]): RequestHandler =>
  async (req, _res, next) => {
    try {
      if (!req.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
      const user = await UserModel.findById(req.userId).select('role').lean();
      if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
      if (!allowed.includes((user as { role?: string }).role ?? '')) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

export const requireAdmin = requireRole('admin');
