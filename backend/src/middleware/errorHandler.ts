import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.badRequest(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Single place where every error in the app is normalized into a
 * consistent JSON shape. Keeps stack traces out of responses in
 * production while still logging them server-side for debugging.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : "Something went wrong on our end.";
  const details = isApiError ? err.details : undefined;

  if (!isApiError || statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(`[${new Date().toISOString()}]`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: details ?? null,
    },
  });
}
