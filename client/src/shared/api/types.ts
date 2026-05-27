// Generic envelope returned by every endpoint on the new REST server.
// See server/src/utils/ApiResponse.js and server/src/middleware/error.middleware.js.

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type ApiFieldError = {
  field: string;
  message: string;
  code?: string;
};

// Shape of an error response (after the central error handler). Useful for
// surfacing field-level errors from Zod validation back into a form.
export type ApiErrorBody = {
  statusCode: number;
  success: false;
  message: string;
  errors: ApiFieldError[];
  data: null;
};
