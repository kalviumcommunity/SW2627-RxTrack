import type { PrescriptionStatus, UserRole } from "@prisma/client";

export interface PrescriptionMedicineInput {
  medicineId: string;
  quantity: number;
  dosage?: string;
  instructions?: string;
}

export interface CreatePrescriptionInput {
  patientName: string;
  imageUrl?: string;
  medicines: PrescriptionMedicineInput[];
}

export interface ListPrescriptionsFilters {
  status?: PrescriptionStatus;
  page: number;
  limit: number;
}

/**
 * Who is making the request. Always built from the verified JWT — never from
 * the request body, or a doctor could file prescriptions under someone else's id.
 */
export interface RequestActor {
  id: string;
  role: UserRole;
}