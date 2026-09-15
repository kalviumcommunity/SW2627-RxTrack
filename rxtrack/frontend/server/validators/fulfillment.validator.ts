import { z } from "zod";

export const pharmacyQueueQuerySchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "READY"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const markFilledSchema = z.object({
  prescriptionId: z.string().uuid("prescriptionId must be a valid UUID"),
  notes: z.string().trim().max(500).optional(),
});