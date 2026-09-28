import { Router } from "express";
import { getCurrentUser } from "../controllers/userController.js";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";

const router = Router();
router.get("/me", firebaseAuthRequired, getCurrentUser);

export default router;