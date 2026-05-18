import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: error.issues,
    });
  }

  logger.error({
    message: "Unhandled error",
    error,
    path: request.path,
    method: request.method,
  });

  return response.status(500).json({
    message: "Internal server error",
  });
}