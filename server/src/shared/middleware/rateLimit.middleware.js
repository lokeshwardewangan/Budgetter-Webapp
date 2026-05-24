import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';

const handler = (_req, _res, next) => {
  next(new ApiError(StatusCodes.TOO_MANY_REQUESTS, 'Too many requests, please try again later'));
};

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Failures only — successful logins don't count against the cap.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler,
});
