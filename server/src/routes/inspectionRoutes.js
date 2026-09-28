import { Router } from "express";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";
import { requireRole } from "../middleware/rbac.js";
import { getInspections, postInspection } from "../controllers/inspectionController.js";

const router = Router({ mergeParams: true });
router.use(firebaseAuthRequired);
router.get("/", getInspections);
router.post("/", requireRole("ADMIN", "INSPECTOR"), postInspection);

export default router;