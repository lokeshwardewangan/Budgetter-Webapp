export interface ApiErrorIssue {
  field?: string;
  message: string;
  code?: string;
}

class ApiError extends Error {
  data: null;
  statusCode: number;
  success: false;
  errors: ApiErrorIssue[];

  constructor(
    statusCode: number,
    message = 'Something went wrong',
    errors: ApiErrorIssue[] = [],
    stack = '',
  ) {
    super(message);
    this.data = null;
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) this.stack = stack;
  }
}

export { ApiError };
