import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/** Prisma error codes worth translating instead of reporting as a server fault. */
const PRISMA_STATUS: Record<string, number> = {
  P2002: 409, // unique constraint — e.g. the same medicine twice on one prescription
  P2003: 400, // foreign key — an id in the payload points at nothing
  P2025: 404, // record not found
};

function classify(err: unknown): { status: number; message: string } | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as { type?: string; code?: string };

  // Thrown by express.json() — nearly always a quoting mistake in the request
  if (e.type === "entity.parse.failed") {
    return { status: 400, message: "Malformed JSON body" };
  }

  if (e.code && PRISMA_STATUS[e.code]) {
    return { status: PRISMA_STATUS[e.code], message: `Database rejected the request (${e.code})` };
  }

  return null;
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }

  const known = classify(err);
  if (known) {
    return res.status(known.status).json({ success: false, error: known.message });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ success: false, error: "Internal server error" });
}