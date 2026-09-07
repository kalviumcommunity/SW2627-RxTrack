import type { NextFunction, Request, Response } from "express";
import { fulfillmentService } from "../services/fulfillment.service";
import { pharmacyQueueQuerySchema, markFilledSchema } from "../validators/fulfillment.validator";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { formatIssues } from "../utils/validation";
import type { RequestActor } from "../types/prescription";

function actorFrom(req: Request): RequestActor {
  if (!req.user) throw new UnauthorizedError("Authentication required");
  return { id: req.user.sub, role: req.user.role };
}

export const fulfillmentController = {
  async pharmacyQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = pharmacyQueueQuerySchema.safeParse(req.query);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));
      const result = await fulfillmentService.getPharmacyQueue(parsed.data);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  },

  async markFilled(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = markFilledSchema.safeParse(req.body);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));
      const result = await fulfillmentService.markFilled(actorFrom(req), parsed.data);
      return res.status(201).json({ success: true, data: result });
    } catch (err) { return next(err); }
  },
};