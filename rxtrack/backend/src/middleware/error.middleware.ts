import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }
  console.error("Unexpected error:", err);
  return res.status(500).json({ success: false, error: "Internal server error" });
}