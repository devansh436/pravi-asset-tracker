import { Router } from "express";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";
import { requireRole } from "../middleware/rbac.js";
import { getDefects, patchDefect, postDefect } from "../controllers/defectController.js";

const router = Router();
router.get("/assets/:id/defects", firebaseAuthRequired, getDefects);
router.post("/assets/:id/defects", firebaseAuthRequired, requireRole("ADMIN", "INSPECTOR"), postDefect);
router.patch("/defects/:id", firebaseAuthRequired, requireRole("ADMIN", "INSPECTOR"), patchDefect);

export default router;