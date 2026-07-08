import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * When the request is multipart/form-data (file upload), every field
 * arrives as a string, including the `options` object. This middleware
 * parses it back into JSON so the Zod schema downstream sees the same
 * shape whether the request was JSON or multipart.
 */
export function normalizeMultipartBody(req: Request, _res: Response, next: NextFunction) {
  if (typeof req.body.options === "string") {
    try {
      req.body.options = JSON.parse(req.body.options);
    } catch {
      return next(ApiError.badRequest("`options` must be valid JSON."));
    }
  }
  next();
}
