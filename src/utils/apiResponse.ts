interface ApiResponseOptions<T = any> {
  statusCode?: number;
  data?: T | null;
  message?: string;
  errors?: unknown[];
}

export class ApiResponse<T = any> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data: T | null;
  public errors: unknown[];
  public timestamp: string;

  constructor({
    statusCode = 200,
    data = null,
    message = "Success",
    errors = [],
  }: ApiResponseOptions<T> = {}) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}
