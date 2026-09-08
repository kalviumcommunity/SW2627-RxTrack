import { PrescriptionStatus } from "@prisma/client";
import { prisma } from "../config/database";

export const analyticsRepository = {
  countTotal() {
    return prisma.prescription.count();
  },

  countByStatus(status: PrescriptionStatus) {
    return prisma.prescription.count({ where: { status } });
  },
};
