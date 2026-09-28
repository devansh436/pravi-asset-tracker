import { Router } from "express";
import {
  attachRole,
  requireRole,
  requireMaintenancePatchRole,
} from "../middleware/role.js";

import {
  getMaintenanceById,
  getMaintenanceList,
  patchMaintenance,
  postMaintenance,
} from "../controllers/maintenanceController.js";

const router = Router();

router.use(attachRole);

// GET → any role
router.get("/", getMaintenanceList);
router.get("/:id", getMaintenanceById);

// POST → ADMIN, INSPECTOR, MAINTENANCE
router.post(
  "/",
  requireRole("ADMIN", "INSPECTOR", "MAINTENANCE"),
  postMaintenance,
);

// PATCH:
// normal updates → ADMIN, MAINTENANCE
// COMPLETED → ADMIN, INSPECTOR, MAINTENANCE
router.patch(
  "/:id",
  requireMaintenancePatchRole,
  patchMaintenance,
);

export default router;