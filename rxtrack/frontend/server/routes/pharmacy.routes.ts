import { Router } from "express";
import { UserRole } from "@prisma/client";
import { pharmacyController } from "../controllers/pharmacy.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();
router.use(authenticate);

router.get("/", pharmacyController.list);
router.get("/me", requireRole(UserRole.PHARMACY), pharmacyController.getMine);
router.patch("/me", requireRole(UserRole.PHARMACY), pharmacyController.updateMine);

export default router;