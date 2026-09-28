import { pool } from "../db/pool.js";
import { ASSET_STATUSES, LIFECYCLE_TRANSITIONS } from "../constants.js";
import { failure, success } from "../middleware/response.js";
import { validateAsset, validationFailure } from "../utils/validate.js";
import {
  createAsset,
  listAssets,
  transitionAsset,
  updateAsset,
} from "../services/assetService.js";

export async function getAssets(req, res, next) {
  try {
    return success(res, await listAssets(req.query));
  } catch (error) {
    return next(error);
  }
}

export async function getAsset(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM assets WHERE id = $1", [
      req.params.id,
    ]);
    return result.rows[0]
      ? success(res, result.rows[0])
      : failure(res, 404, "Asset not found");
  } catch (error) {
    return next(error);
  }
}

export async function postAsset(req, res, next) {
  try {
    const details = validateAsset(req.body);
    if (details) return validationFailure(res, details);
    if (req.body.parent_asset_id) {
      const parent = await pool.query("SELECT id FROM assets WHERE id = $1", [
        req.body.parent_asset_id,
      ]);
      if (!parent.rowCount)
        return validationFailure(res, { parent_asset_id: "does not exist" });
    }
    return success(res, await createAsset(req.body, req.userId), 201);
  } catch (error) {
    return next(error);
  }
}

export async function patchAsset(req, res, next) {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, "status"))
      return failure(
        res,
        400,
        "Status must be changed through the transition endpoint",
      );
    const details = validateAsset(req.body, { partial: true });
    if (details) return validationFailure(res, details);
    if (req.body.parent_asset_id) {
      const parent = await pool.query("SELECT id FROM assets WHERE id = $1", [
        req.body.parent_asset_id,
      ]);
      if (!parent.rowCount)
        return validationFailure(res, { parent_asset_id: "does not exist" });
    }
    const asset = await updateAsset(req.params.id, req.body);
    if (asset === null) return failure(res, 400, "No editable fields supplied");
    return asset ? success(res, asset) : failure(res, 404, "Asset not found");
  } catch (error) {
    return next(error);
  }
}

export async function postTransition(req, res, next) {
  try {
    if (!ASSET_STATUSES.includes(req.body.toStatus))
      return failure(res, 409, "Invalid lifecycle transition");
    const current = await pool.query(
      "SELECT status FROM assets WHERE id = $1",
      [req.params.id],
    );
    if (!current.rowCount) return failure(res, 404, "Asset not found");
    if (
      !LIFECYCLE_TRANSITIONS[current.rows[0].status].includes(req.body.toStatus)
    )
      return failure(
        res,
        409,
        `Cannot transition from ${current.rows[0].status} to ${req.body.toStatus}`,
      );
    return success(
      res,
      await transitionAsset(
        req.params.id,
        req.body.toStatus,
        req.body.note,
        req.userId,
      ),
    );
  } catch (error) {
    return next(error);
  }
}

export async function getLifecycle(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM lifecycle_events WHERE asset_id = $1 ORDER BY event_time ASC",
      [req.params.id],
    );
    return success(res, result.rows);
  } catch (error) {
    return next(error);
  }
}
