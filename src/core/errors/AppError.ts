export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly cause?: unknown;

  constructor(message: string, code = 'APP_ERROR', statusCode?: number, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
