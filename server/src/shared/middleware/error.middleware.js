import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';
import { ApiResponse } from '../lib/ApiResponse.js';

export const notFoundHandler = (req, res) => {
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

export const errorHandler = (err, req, res, _next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors = [];

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

  // Log 5xx as errors, 4xx as warnings; req.log is the pino child logger
  // injected per-request by pino-http and already carries the requestId.
  const log = req.log || console;
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
