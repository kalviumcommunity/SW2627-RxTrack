import { Router } from "express";
import { UserRole } from "@prisma/client";
import { fulfillmentController } from "../controllers/fulfillment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/pharmacy-queue",
  requireRole(UserRole.PHARMACY, UserRole.ADMIN),
  fulfillmentController.pharmacyQueue,
);

router.post(
  "/mark-filled",
  requireRole(UserRole.PHARMACY, UserRole.ADMIN),
  fulfillmentController.markFilled,
);

export default router;
