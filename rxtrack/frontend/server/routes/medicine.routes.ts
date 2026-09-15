import { Router } from "express";
import { medicineController } from "../controllers/medicine.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", medicineController.list);

export default router;