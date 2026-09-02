import type { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import type { CreatePrescriptionInput } from "../types/prescription";

/**
 * One shared include so list, detail, and create all return the same shape.
 * `satisfies` (not `: Prisma.PrescriptionInclude`) is deliberate — an annotation
 * would widen the type and Prisma would lose track of which relations are loaded.
 */
const prescriptionInclude = {
  doctor: { select: { id: true, name: true, email: true } },
  medicines: {
    include: {
      medicine: {
        select: { id: true, name: true, genericName: true, strength: true, form: true },
      },
    },
  },
} satisfies Prisma.PrescriptionInclude;

export const prescriptionRepository = {
  createWithMedicines(doctorId: string, data: CreatePrescriptionInput) {
    return prisma.prescription.create({
      data: {
        patientName: data.patientName,
        imageUrl: data.imageUrl,
        doctorId,
        medicines: {
          create: data.medicines.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            dosage: item.dosage,
            instructions: item.instructions,
          })),
        },
      },
      include: prescriptionInclude,
    });
  },

  findMany(where: Prisma.PrescriptionWhereInput, skip: number, take: number) {
    return prisma.prescription.findMany({
      where,
      include: prescriptionInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count(where: Prisma.PrescriptionWhereInput) {
    return prisma.prescription.count({ where });
  },

  findById(id: string) {
    return prisma.prescription.findUnique({
      where: { id },
      include: prescriptionInclude,
    });
  },
};