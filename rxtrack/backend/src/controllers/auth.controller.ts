import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { BadRequestError } from "../utils/errors";

function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const result = await authService.register(parsed.data);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const result = await authService.login(parsed.data);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },
};