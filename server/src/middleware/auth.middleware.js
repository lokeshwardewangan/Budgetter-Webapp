import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import UserModel from '../models/user.model.js';
import ActiveSessionModel from '../models/activeSession.model.js';

const verifyJwtToken = async (req, _res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      throw new ApiError(401, 'Unauthorized: missing access token');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch {
      throw new ApiError(401, 'Unauthorized: invalid or expired token');
    }

    const user = await UserModel.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized: user no longer exists');
    }

    // Touch the session asynchronously — not awaited so it doesn't add latency
    // to every authenticated request. A missed update is acceptable.
    ActiveSessionModel.updateOne({ token }, { $set: { lastUsedAt: new Date() } }).catch(() => {});

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

export default verifyJwtToken;
