import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';
import { sha256 } from '../lib/hash.js';
import ActiveSessionModel from '../../modules/session/session.model.js';

// Verifies JWT + that the session is still active. Skips loading the full
// User — session existence implies user existence (deleteAccount cascades).
const verifyJwtToken: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: missing access token');

    let decoded: JwtPayload & { _id: string };
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload & {
        _id: string;
      };
    } catch {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: invalid or expired token');
    }

    const tokenHash = sha256(token);
    const session = await ActiveSessionModel.findOne({ tokenHash, user: decoded._id })
      .select('_id')
      .lean();
    if (!session) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: session not found');

    ActiveSessionModel.updateOne({ _id: session._id }, { $set: { lastUsedAt: new Date() } }).catch(
      () => {},
    );

    req.userId = decoded._id;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

export default verifyJwtToken;
