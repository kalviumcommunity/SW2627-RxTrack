import { prisma } from "../config/database";

export const pharmacyRepository = {
  findByUserId(userId: string) {
    return prisma.pharmacy.findUnique({ where: { userId } });
  },
  create(data: { userId: string; name: string }) {
    return prisma.pharmacy.create({ data });
  },
  findAll() {
    return prisma.pharmacy.findMany({ orderBy: { name: "asc" } });
  },
  update(id: string, data: { name?: string; address?: string; phone?: string }) {
    return prisma.pharmacy.update({ where: { id }, data });
  },
};