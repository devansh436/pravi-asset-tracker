import { Router } from "express";
import {
  attachRole,
  requireRole,
} from "../middleware/role.js";

import {
  getDefects,
  patchDefect,
  postDefect,
} from "../controllers/defectController.js";

const router = Router();

// GET → any role
router.get(
  "/assets/:id/defects",
  attachRole,
  getDefects,
);

// POST → ADMIN, INSPECTOR, MAINTENANCE
router.post(
  "/assets/:id/defects",
  attachRole,
  requireRole("ADMIN", "INSPECTOR", "MAINTENANCE"),
  postDefect,
);

// PATCH → ADMIN, INSPECTOR, MAINTENANCE
router.patch(
  "/defects/:id",
  attachRole,
  requireRole("ADMIN", "INSPECTOR", "MAINTENANCE"),
  patchDefect,
);

export default router;