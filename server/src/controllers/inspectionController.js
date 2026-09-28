import { pool } from "../db/pool.js";
import { failure, success } from "../middleware/response.js";
import { validateConditionScore, validationFailure } from "../utils/validate.js";
import { createInspection, listInspections } from "../services/inspectionService.js";

export async function postInspection(req, res, next) {
  try {
    if (!validateConditionScore(req.body.condition_score)) return validationFailure(res, { condition_score: "must be between 0 and 100" });
    return success(res, await createInspection(req.params.id, req.user.id, req.body.condition_score, req.body.notes), 201);
  } catch (error) { return next(error); }
}

export async function getInspections(req, res, next) {
  try {
    const asset = await pool.query("SELECT id FROM assets WHERE id = $1", [req.params.id]);
    if (!asset.rowCount) return failure(res, 404, "Asset not found");
    return success(res, await listInspections(req.params.id));
  } catch (error) { return next(error); }
}