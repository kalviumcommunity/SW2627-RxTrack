import { z } from "zod";

const medicineItemSchema = z.object({
  medicineId: z.string().uuid("medicineId must be a valid UUID"),
  quantity: z.coerce.number().int().positive("quantity must be at least 1").default(1),
  dosage: z.string().trim().max(100).optional(),
  instructions: z.string().trim().max(500).optional(),
});

export const createPrescriptionSchema = z.object({
  patientName: z.string().min(2, "patientName must be at least 2 characters").trim(),
  imageUrl: z.string().url("imageUrl must be a valid URL").optional(),
  medicines: z
    .array(medicineItemSchema)
    .min(1, "At least one medicine is required")
    .max(20, "A prescription can hold at most 20 medicines")
    .refine(
      (items) => new Set(items.map((i) => i.medicineId)).size === items.length,
      "The same medicine cannot be listed twice — combine it into a single line",
    ),
});

export const listPrescriptionsQuerySchema = z.object({
  status: z
    .enum(["PENDING", "PROCESSING", "READY", "DISPENSED", "REJECTED"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const prescriptionIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});