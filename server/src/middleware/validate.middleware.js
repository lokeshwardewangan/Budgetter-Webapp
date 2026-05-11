import { ApiError } from '../utils/ApiError.js';

/**
 * Express middleware factory that validates a request slice against a Zod schema.
 *
 *   router.post('/login', validate(loginSchema), controller.login);                    // body
 *   router.get('/x',     validate(querySchema, 'query'), controller.get);              // query
 *   router.delete('/:id', validate(idSchema, 'params'), controller.remove);            // params
 *
 * On success, `req[source]` is replaced with the parsed (coerced/defaulted) data so
 * controllers and services receive clean, typed values. On failure, a 400
 * ApiError is forwarded to the central error handler with field-level details.
 */
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
        code: issue.code,
      }));
      return next(new ApiError(400, 'Validation failed', errors));
    }
    req[source] = result.data;
    next();
  };
