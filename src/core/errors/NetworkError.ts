import { AppError } from './AppError';

export class NetworkError extends AppError {
  public readonly url?: string;
  public readonly method?: string;

  constructor(message: string, statusCode?: number, url?: string, method?: string, cause?: unknown) {
    super(message, 'NETWORK_ERROR', statusCode, cause);
    this.name = 'NetworkError';
    this.url = url;
    this.method = method;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static fromUnknown(error: unknown, url?: string, method?: string): NetworkError {
    if (error instanceof NetworkError) {
      return error;
    }

    if (error instanceof Error) {
      return new NetworkError(error.message, undefined, url, method, error);
    }

    return new NetworkError('Unexpected network error', undefined, url, method, error);
  }
}
