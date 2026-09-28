import { Router } from "express";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";
import { requireRole } from "../middleware/rbac.js";
import { getMaintenanceById, getMaintenanceList, patchMaintenance, postMaintenance } from "../controllers/maintenanceController.js";

const router = Router();
router.use(firebaseAuthRequired);
router.get("/", getMaintenanceList);
router.get("/:id", getMaintenanceById);
router.post("/", requireRole("ADMIN", "INSPECTOR"), postMaintenance);
router.patch("/:id", requireRole("ADMIN", "MAINTENANCE"), patchMaintenance);

export default router;