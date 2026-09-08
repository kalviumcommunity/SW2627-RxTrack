import { PrescriptionStatus } from "@prisma/client";
import { analyticsRepository } from "../repositories/analytics.repository";
import type { FillRateStats } from "../types/analytics";

export const analyticsService = {
  async getFillRate(): Promise<FillRateStats> {
    const [total, filled] = await Promise.all([
      analyticsRepository.countTotal(),
      analyticsRepository.countByStatus(PrescriptionStatus.DISPENSED),
    ]);

    const fillRate = total === 0 ? 0 : Math.round((filled / total) * 100);

    return { totalPrescriptions: total, filled, fillRate };
  },
};
