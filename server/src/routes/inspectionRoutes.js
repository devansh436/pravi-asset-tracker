import { Router } from "express";
import {
  attachRole,
  requireRole,
} from "../middleware/role.js";

import {
  getInspections,
  postInspection,
} from "../controllers/inspectionController.js";

const router = Router({ mergeParams: true });

router.use(attachRole);

// GET → any role
router.get("/", getInspections);

// POST → ADMIN, INSPECTOR
router.post(
  "/",
  requireRole("ADMIN", "INSPECTOR"),
  postInspection,
);

export default router;