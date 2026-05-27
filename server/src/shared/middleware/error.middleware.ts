import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ApiError, type ApiErrorIssue } from '../lib/ApiError.js';
import { ApiResponse } from '../lib/ApiResponse.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json(
      new ApiResponse(
        StatusCodes.NOT_FOUND,
        null,
        `Route not found: ${req.method} ${req.originalUrl}`,
      ),
    );
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors: ApiErrorIssue[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err?.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  } else if (err?.message) {
    message = err.message;
  }

  // 5xx → error, 4xx → warn. req.log is the per-request pino child (carries requestId).
  const log = (req as unknown as { log?: typeof console }).log || console;
  if (statusCode >= 500) log.error({ err, statusCode }, message);
  else log.warn({ err: { name: err?.name, message: err?.message }, statusCode }, message);

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors,
    data: null,
  });
};
