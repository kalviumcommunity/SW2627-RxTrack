import { UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { medicineRepository } from "../repositories/medicine.repository";
import { prescriptionRepository } from "../repositories/prescription.repository";
import { BadRequestError, NotFoundError } from "../utils/errors";
import type {
  CreatePrescriptionInput,
  ListPrescriptionsFilters,
  RequestActor,
} from "../types/prescription";

/** Checks ids up front so a bad id becomes a clear 400, not a Prisma foreign-key 500. */
async function assertMedicinesExist(medicineIds: string[]) {
  const found = await medicineRepository.findManyByIds(medicineIds);
  const foundIds = new Set(found.map((m) => m.id));
  const missing = medicineIds.filter((id) => !foundIds.has(id));

  if (missing.length > 0) {
    throw new BadRequestError(`Unknown medicine id(s): ${missing.join(", ")}`);
  }
}

export const prescriptionService = {
  async create(actor: RequestActor, input: CreatePrescriptionInput) {
    await assertMedicinesExist(input.medicines.map((m) => m.medicineId));
    return prescriptionRepository.createWithMedicines(actor.id, input);
  },

  async list(actor: RequestActor, filters: ListPrescriptionsFilters) {
    const where: Prisma.PrescriptionWhereInput = {};

    // Doctors see only their own patients. Pharmacy and admin see the whole queue.
    if (actor.role === UserRole.DOCTOR) {
      where.doctorId = actor.id;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prescriptionRepository.findMany(where, skip, filters.limit),
      prescriptionRepository.count(where),
    ]);

    return {
      items,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.limit)),
      },
    };
  },

  async getById(actor: RequestActor, id: string) {
    const prescription = await prescriptionRepository.findById(id);

    // 404 rather than 403 when a doctor requests someone else's prescription —
    // a 403 would confirm the record exists, which leaks patient information.
    if (
      !prescription ||
      (actor.role === UserRole.DOCTOR && prescription.doctorId !== actor.id)
    ) {
      throw new NotFoundError(`Prescription ${id} was not found`);
    }

    return prescription;
  },
};