import { z } from "zod";

export const listMedicinesQuerySchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
});