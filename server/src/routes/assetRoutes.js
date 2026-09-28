import { Router } from "express";
import {
  attachRole,
  requireRole,
  requireAssetTransitionRole,
} from "../middleware/role.js";

import {
  getAsset,
  getAssets,
  getLifecycle,
  patchAsset,
  postAsset,
  postTransition,
} from "../controllers/assetController.js";

const router = Router();

router.use(attachRole);

// GET → all roles
router.get("/", getAssets);
router.get("/:id", getAsset);
router.get("/:id/lifecycle", getLifecycle);

// CREATE/EDIT → ADMIN, INSPECTOR
router.post("/", requireRole("ADMIN", "INSPECTOR"), postAsset);
router.patch("/:id", requireRole("ADMIN", "INSPECTOR"), patchAsset);

// Lifecycle transition:
// ADMIN/INSPECTOR normally
// RETIRED → ADMIN only
router.post(
  "/:id/transition",
  requireAssetTransitionRole,
  postTransition,
);

export default router;