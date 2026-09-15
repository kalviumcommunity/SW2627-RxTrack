import { z } from "zod";

// Deliberately no email field — Pharmacy.email is unique, and letting it be
// edited here means handling a P2002 collision for very little real benefit.
export const updatePharmacySchema = z
  .object({
    name: z.string().trim().min(2, "name must be at least 2 characters").max(200).optional(),
    address: z.string().trim().max(300).optional(),
    phone: z.string().trim().max(30).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export type UpdatePharmacyInput = z.infer<typeof updatePharmacySchema>;