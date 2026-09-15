import type { PrescriptionStatus } from "@prisma/client";

export const PHARMACY_QUEUE_STATUSES: PrescriptionStatus[] = ["PENDING", "PROCESSING", "READY"];

export interface PharmacyQueueFilters {
  status?: PrescriptionStatus;
  page: number;
  limit: number;
}

export interface MarkFilledInput {
  prescriptionId: string;
  notes?: string;
}