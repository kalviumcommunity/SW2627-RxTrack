import type { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};