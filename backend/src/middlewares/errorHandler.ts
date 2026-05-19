import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { logger } from "../config/logger";
import { AppError } from "../utils/AppError";

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

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
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