import type { Prisma } from "@prisma/client";
import { FulfillmentStatus, PrescriptionStatus } from "@prisma/client";
import { prisma } from "../config/database";

const fulfillmentInclude = {
  pharmacy: { select: { id: true, name: true } },
  prescription: { select: { id: true, patientName: true, status: true, doctorId: true } },
} satisfies Prisma.FulfillmentInclude;

export const fulfillmentRepository = {
  markFilled(input: { prescriptionId: string; pharmacyId: string; notes?: string }) {
    return prisma.$transaction(async (tx) => {
      await tx.prescription.update({
        where: { id: input.prescriptionId },
        data: { status: PrescriptionStatus.DISPENSED },
      });
      return tx.fulfillment.upsert({
        where: {
          prescriptionId_pharmacyId: {
            prescriptionId: input.prescriptionId,
            pharmacyId: input.pharmacyId,
          },
        },
        create: {
          prescriptionId: input.prescriptionId,
          pharmacyId: input.pharmacyId,
          notes: input.notes,
          status: FulfillmentStatus.COMPLETED,
          pickedUpAt: new Date(),
        },
        update: {
          notes: input.notes,
          status: FulfillmentStatus.COMPLETED,
          pickedUpAt: new Date(),
        },
        include: fulfillmentInclude,
      });
    });
  },
};