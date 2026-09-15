import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prescriptionController } from "../controllers/prescription.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// "Auth middleware on routes" — one line covers every route in this file,
// so a new route can never accidentally ship unauthenticated.
router.use(authenticate);

router.post("/upload", requireRole(UserRole.DOCTOR), prescriptionController.upload);
router.get("/", prescriptionController.list);
router.get("/:id", prescriptionController.getById);

export default router;