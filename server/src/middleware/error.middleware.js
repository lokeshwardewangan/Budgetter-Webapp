import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const notFoundHandler = (req, res) => {
  res
    .status(404)
    .json(new ApiResponse(404, null, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler. Every controller wrapped in asyncHandler funnels
// rejections here via next(err), so controllers can simply `throw new ApiError(...)`.
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

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors,
    data: null,
  });
};
