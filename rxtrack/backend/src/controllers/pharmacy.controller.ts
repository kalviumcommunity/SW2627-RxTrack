import type { NextFunction, Request, Response } from "express";
import { pharmacyService } from "../services/pharmacy.service";
import { updatePharmacySchema } from "../validators/pharmacy.validator";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { formatIssues } from "../utils/validation";
import type { RequestActor } from "../types/prescription";

function actorFrom(req: Request): RequestActor {
  if (!req.user) throw new UnauthorizedError("Authentication required");
  return { id: req.user.sub, role: req.user.role };
}

export const pharmacyController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacies = await pharmacyService.list();
      return res.status(200).json({ success: true, data: pharmacies });
    } catch (err) {
      return next(err);
    }
  },

  async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacy = await pharmacyService.getMine(actorFrom(req));
      return res.status(200).json({ success: true, data: pharmacy });
    } catch (err) {
      return next(err);
    }
  },

  async updateMine(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updatePharmacySchema.safeParse(req.body);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const pharmacy = await pharmacyService.updateMine(actorFrom(req), parsed.data);
      return res.status(200).json({ success: true, data: pharmacy });
    } catch (err) {
      return next(err);
    }
  },
};