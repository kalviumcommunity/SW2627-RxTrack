import type { NextFunction, Request, Response } from "express";
import { prescriptionService } from "../services/prescription.service";
import {
  createPrescriptionSchema,
  listPrescriptionsQuerySchema,
  prescriptionIdParamSchema,
} from "../validators/prescription.validator";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { formatIssues } from "../utils/validation";
import type { RequestActor } from "../types/prescription";

function actorFrom(req: Request): RequestActor {
  if (!req.user) throw new UnauthorizedError("Authentication required");
  return { id: req.user.sub, role: req.user.role };
}

export const prescriptionController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createPrescriptionSchema.safeParse(req.body);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const result = await prescriptionService.create(actorFrom(req), parsed.data);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listPrescriptionsQuerySchema.safeParse(req.query);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const result = await prescriptionService.list(actorFrom(req), parsed.data);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = prescriptionIdParamSchema.safeParse(req.params);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const result = await prescriptionService.getById(actorFrom(req), parsed.data.id);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },
};