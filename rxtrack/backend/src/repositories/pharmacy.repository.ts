import { prisma } from "../config/database";

export const pharmacyRepository = {
  findByUserId(userId: string) {
    return prisma.pharmacy.findUnique({ where: { userId } });
  },
  create(data: { userId: string; name: string }) {
    return prisma.pharmacy.create({ data });
  },
};