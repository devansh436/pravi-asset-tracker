import { Router } from "express";
import { firebaseAuthRequired } from "../middleware/firebaseAuth.js";
import { getAsset, getAssets, getLifecycle, patchAsset, postAsset, postTransition } from "../controllers/assetController.js";

const router = Router();
router.use(firebaseAuthRequired);
router.get("/", getAssets);
router.get("/:id", getAsset);
router.post("/", postAsset);
router.patch("/:id", patchAsset);
router.post("/:id/transition", postTransition);
router.get("/:id/lifecycle", getLifecycle);

export default router;