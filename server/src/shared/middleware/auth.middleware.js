import jwt from 'jsonwebtoken';
import { ApiError } from '../lib/ApiError.js';
import { sha256 } from '../lib/hash.js';
import ActiveSessionModel from '../../modules/session/session.model.js';

// Verifies JWT + that the session is still active. Skips loading the full
// User — session existence implies user existence (deleteAccount cascades).
const verifyJwtToken = async (req, _res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new ApiError(401, 'Unauthorized: missing access token');

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch {
      throw new ApiError(401, 'Unauthorized: invalid or expired token');
    }

    const tokenHash = sha256(token);
    const session = await ActiveSessionModel.findOne({ tokenHash, user: decoded._id })
      .select('_id')
      .lean();
    if (!session) throw new ApiError(401, 'Unauthorized: session not found');

    ActiveSessionModel.updateOne(
      { _id: session._id },
      { $set: { lastUsedAt: new Date() } },
    ).catch(() => {});

    req.userId = decoded._id;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

export default verifyJwtToken;
