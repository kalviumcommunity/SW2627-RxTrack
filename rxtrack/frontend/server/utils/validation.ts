import { z } from "zod";

/**
 * Collapses a Zod failure into one readable line.
 * Nested paths come through usefully: "medicines.0.quantity: quantity must be at least 1"
 */
export function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
}