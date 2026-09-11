import { Prisma, PrescriptionStatus } from "@prisma/client";
import { pharmacyService } from "./pharmacy.service";
import { fulfillmentRepository } from "../repositories/fulfillment.repository";
import { prescriptionRepository } from "../repositories/prescription.repository";
import { ConflictError, NotFoundError } from "../utils/errors";
import type { RequestActor } from "../types/prescription";
import { PHARMACY_QUEUE_STATUSES } from "../types/fulfillment";
import type { PharmacyQueueFilters, MarkFilledInput } from "../types/fulfillment";

export const fulfillmentService = {
  async getPharmacyQueue(filters: PharmacyQueueFilters) {
    const statuses = filters.status ? [filters.status] : PHARMACY_QUEUE_STATUSES;
    const where: Prisma.PrescriptionWhereInput = { status: { in: statuses } };
    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prescriptionRepository.findQueue(where, skip, filters.limit),
      prescriptionRepository.count(where),
    ]);

    return {
      items,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) },
    };
  },

  async markFilled(actor: RequestActor, input: MarkFilledInput) {
    const prescription = await prescriptionRepository.findById(input.prescriptionId);
    if (!prescription) throw new NotFoundError(`Prescription ${input.prescriptionId} was not found`);

    // The @@unique([prescriptionId, pharmacyId]) constraint only stops THIS
    // pharmacy filling the same prescription twice — a different pharmacy
    // filling it first is caught here, by status, not by the constraint.
    if (prescription.status === PrescriptionStatus.DISPENSED) throw new ConflictError("This prescription has already been filled");
    if (prescription.status === PrescriptionStatus.REJECTED) throw new ConflictError("This prescription was rejected and cannot be filled");

    const pharmacy = await pharmacyService.resolveOrCreateForUser(actor);

    try {
      return await fulfillmentRepository.markFilled({ prescriptionId: input.prescriptionId, pharmacyId: pharmacy.id, notes: input.notes });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictError("This prescription has already been filled by your pharmacy");
      }
      throw err;
    }
  },
};