import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { UnauthorizedError } from "../utils/errors";
import type { JwtPayload } from "../types/auth";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or malformed Authorization header"));
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    return next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
}