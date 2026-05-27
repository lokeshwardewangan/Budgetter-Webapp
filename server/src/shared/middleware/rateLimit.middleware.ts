import rateLimit, { type RateLimitRequestHandler, type Options } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';

const handler: Options['handler'] = (_req, _res, next) => {
  next(new ApiError(StatusCodes.TOO_MANY_REQUESTS, 'Too many requests, please try again later'));
};

export const globalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Failures only — successful logins don't count against the cap.
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler,
});
