import { ApiError } from '../lib/ApiError.js';
import UserModel from '../../modules/user/user.model.js';

// Loads the user's role and verifies it matches an allowed value. Mount
// after verifyJwtToken so req.userId is populated.
export const requireRole =
  (...allowed) =>
  async (req, _res, next) => {
    try {
      if (!req.userId) throw new ApiError(401, 'Unauthorized');
      const user = await UserModel.findById(req.userId).select('role').lean();
      if (!user) throw new ApiError(401, 'Unauthorized');
      if (!allowed.includes(user.role)) throw new ApiError(403, 'Forbidden');
      next();
    } catch (err) {
      next(err);
    }
  };

export const requireAdmin = requireRole('admin');
