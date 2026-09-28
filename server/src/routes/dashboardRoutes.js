import { Router } from "express";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";
import { dashboard } from "../controllers/dashboardController.js";

const router = Router();
router.get("/dashboard", firebaseAuthRequired, dashboard);

export default router;