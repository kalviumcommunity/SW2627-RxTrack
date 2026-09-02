import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

/**
 * Guards a route by role. Must run *after* authenticate, since it reads req.user.
 * Usage: router.post("/upload", requireRole(UserRole.DOCTOR), handler)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`This action requires role: ${allowedRoles.join(" or ")}`),
      );
    }

    return next();
  };
}