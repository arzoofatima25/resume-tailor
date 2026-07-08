import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

/**
 * Validates req.body against the given Zod schema. On success the
 * parsed (and defaulted) value replaces req.body so downstream
 * handlers can trust its shape.
 */
export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(ApiError.badRequest("Validation failed.", details));
    }
    req.body = result.data;
    next();
  };
