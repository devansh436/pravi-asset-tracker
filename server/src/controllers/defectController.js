import { pool } from "../db/pool.js";
import { DEFECT_SEVERITIES, DEFECT_STATUSES } from "../constants.js";
import { failure, success } from "../middleware/response.js";
import { validationFailure } from "../utils/validate.js";
import { createDefect, listDefects, updateDefect } from "../services/defectService.js";

function validateDefect(body, partial = false) {
  const details = {};
  if (!partial && !body.inspection_id) details.inspection_id = "is required";
  if (!partial && !body.type) details.type = "is required";
  if (body.severity !== undefined && !DEFECT_SEVERITIES.includes(body.severity)) details.severity = "is invalid";
  if (body.status !== undefined && !DEFECT_STATUSES.includes(body.status)) details.status = "is invalid";
  return Object.keys(details).length ? details : null;
}

export async function postDefect(req, res, next) {
  try {
    const details = validateDefect(req.body);
    if (details) return validationFailure(res, details);
    return success(res, await createDefect(req.params.id, req.body), 201);
  } catch (error) { return next(error); }
}

export async function getDefects(req, res, next) {
  try {
    const asset = await pool.query("SELECT id FROM assets WHERE id = $1", [req.params.id]);
    if (!asset.rowCount) return failure(res, 404, "Asset not found");
    return success(res, await listDefects(req.params.id));
  } catch (error) { return next(error); }
}

export async function patchDefect(req, res, next) {
  try {
    const details = validateDefect(req.body, true);
    if (details) return validationFailure(res, details);
    const defect = await updateDefect(req.params.id, req.body);
    if (defect === null) return failure(res, 400, "No editable fields supplied");
    return defect ? success(res, defect) : failure(res, 404, "Defect not found");
  } catch (error) { return next(error); }
}