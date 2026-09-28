import { Router } from "express";
import { attachRole } from "../middleware/role.js";
import { dashboard } from "../controllers/dashboardController.js";

const router = Router();

router.get(
  "/dashboard",
  attachRole,
  dashboard,
);

export default router;