/**
 * Standardized application error. Thrown anywhere in the request
 * lifecycle and caught by the central error-handling middleware,
 * which turns it into a consistent JSON error response.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unsupportedMedia(message: string) {
    return new ApiError(415, message);
  }

  static tooLarge(message: string) {
    return new ApiError(413, message);
  }

  static upstream(message: string, details?: unknown) {
    return new ApiError(502, message, details);
  }

  static internal(message = "Something went wrong on our end.") {
    return new ApiError(500, message);
  }
}
