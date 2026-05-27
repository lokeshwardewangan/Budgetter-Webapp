import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';

export type ValidationSource = 'body' | 'query' | 'params';

// Validates req[source] against a Zod schema; replaces it with parsed data
// (coerced/defaulted). On failure forwards a 400 ApiError with field details.
export const validate =
  (schema: ZodSchema, source: ValidationSource = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
        code: issue.code,
      }));
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', errors));
    }
    req[source] = result.data;
    next();
  };
