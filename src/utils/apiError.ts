interface ApiErrorOptions {
  statusCode?: number;
  message?: string;
  errors?: unknown[]; // You can replace with a more specific type if needed
  data?: Record<string, any> | null;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors: unknown[];
  public data: Record<string, any> | null;
  public success: boolean;

  constructor({
    statusCode = 500,
    message = "Something went wrong",
    errors = [],
    data = null,
  }: ApiErrorOptions = {}) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
    this.success = false;

    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
