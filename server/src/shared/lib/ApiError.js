class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.data = null;
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.stack = stack;
  }
}

export { ApiError };
