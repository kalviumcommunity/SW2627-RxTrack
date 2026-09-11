import type { NextFunction, Request, Response } from "express";
import { medicineService } from "../services/medicine.service";
import { listMedicinesQuerySchema } from "../validators/medicine.validator";
import { BadRequestError } from "../utils/errors";
import { formatIssues } from "../utils/validation";

export const medicineController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listMedicinesQuerySchema.safeParse(req.query);
      if (!parsed.success) return next(new BadRequestError(formatIssues(parsed.error)));

      const medicines = await medicineService.list(parsed.data.search);
      return res.status(200).json({ success: true, data: medicines });
    } catch (err) {
      return next(err);
    }
  },
};