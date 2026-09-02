import { prisma } from "../config/database";

export const medicineRepository = {
  /** Returns only the ids that actually exist, so the service can report the missing ones. */
  findManyByIds(ids: string[]) {
    return prisma.medicine.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  },
};