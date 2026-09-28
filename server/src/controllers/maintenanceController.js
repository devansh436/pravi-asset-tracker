import { MAINTENANCE_PRIORITIES, MAINTENANCE_STATUSES } from "../constants.js";
import { failure, success } from "../middleware/response.js";
import { validationFailure } from "../utils/validate.js";
import { createMaintenance, getMaintenance, listMaintenance, updateMaintenance } from "../services/maintenanceService.js";

function validateMaintenance(body, partial = false) {
  const details = {};
  if (!partial && !body.asset_id) details.asset_id = "is required";
  if (!partial && !body.title) details.title = "is required";
  if (!partial && !body.priority) details.priority = "is required";
  if (body.priority !== undefined && !MAINTENANCE_PRIORITIES.includes(body.priority)) details.priority = "is invalid";
  if (body.status !== undefined && !MAINTENANCE_STATUSES.includes(body.status)) details.status = "is invalid";
  return Object.keys(details).length ? details : null;
}

export async function getMaintenanceList(req, res, next) {
  try { return success(res, await listMaintenance(req.query)); } catch (error) { return next(error); }
}

export async function getMaintenanceById(req, res, next) {
  try {
    const maintenance = await getMaintenance(req.params.id);
    return maintenance ? success(res, maintenance) : failure(res, 404, "Maintenance not found");
  } catch (error) { return next(error); }
}

export async function postMaintenance(req, res, next) {
  try {
    const details = validateMaintenance(req.body);
    if (details) return validationFailure(res, details);
    return success(res, await createMaintenance(req.body), 201);
  } catch (error) { return next(error); }
}

export async function patchMaintenance(req, res, next) {
  try {
    const details = validateMaintenance(req.body, true);
    if (details) return validationFailure(res, details);
    return success(res, await updateMaintenance(req.params.id, req.body, req.user));
  } catch (error) { return next(error); }
}