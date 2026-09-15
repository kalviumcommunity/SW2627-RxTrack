import type { NextFunction, Request, Response } from "express";
import { analyticsService } from "../services/analytics.service";

export const analyticsController = {
  async fillRate(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await analyticsService.getFillRate();
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  },
};
