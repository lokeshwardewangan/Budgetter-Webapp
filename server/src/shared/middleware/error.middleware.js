import mongoose from 'mongoose';
import { ApiError } from '../lib/ApiError.js';
import { ApiResponse } from '../lib/ApiResponse.js';

export const notFoundHandler = (req, res) => {
  res
    .status(404)
    .json(new ApiResponse(404, null, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
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
