import { prisma } from "../config/database";

export const medicineRepository = {
  /** Returns only the ids that actually exist, so the service can report the missing ones. */
  findManyByIds(ids: string[]) {
    return prisma.medicine.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  },
  /** Powers the medicine picker on the prescription upload form. */
  findAll(search?: string) {
    return prisma.medicine.findMany({
      where: search
        ? { name: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { name: "asc" },
    });
  },
};