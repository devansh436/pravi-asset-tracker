import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import { isAllowedTransition, insertLifecycleEvent } from "../utils/lifecycle.js";
import { isAllowedMaintenanceTransition } from "../utils/maintenanceFlow.js";

function serviceError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

export async function listMaintenance(filters) {
  const conditions = [];
  const values = [];
  for (const field of ["status", "asset_id", "assigned_to"]) {
    if (filters[field] !== undefined) {
      values.push(filters[field]);
      conditions.push(`${field} = $${values.length}`);
    }
  }
  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  return (await pool.query(`SELECT * FROM maintenance${where} ORDER BY created_at DESC`, values)).rows;
}

export async function getMaintenance(id) {
  const result = await pool.query("SELECT * FROM maintenance WHERE id = $1", [id]);
  return result.rows[0];
}

export async function createMaintenance(input) {
  const asset = (await pool.query("SELECT id FROM assets WHERE id = $1", [input.asset_id])).rows[0];
  if (!asset) throw serviceError("Asset not found", 404);
  if (input.defect_id) {
    const defect = (await pool.query("SELECT id FROM defects WHERE id = $1 AND asset_id = $2", [input.defect_id, input.asset_id])).rows[0];
    if (!defect) throw serviceError("Defect not found for asset", 404);
  }
  const result = await pool.query(
    "INSERT INTO maintenance (id, asset_id, defect_id, title, description, priority, status, assigned_to, estimated_cost, scheduled_date) VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', $7, $8, $9) RETURNING *",
    [randomUUID(), input.asset_id, input.defect_id || null, input.title, input.description || null, input.priority, input.assigned_to || null, input.estimated_cost ?? null, input.scheduled_date || null],
  );
  return result.rows[0];
}

export async function updateMaintenance(id, input, user) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const maintenance = (await client.query("SELECT * FROM maintenance WHERE id = $1 FOR UPDATE", [id])).rows[0];
    if (!maintenance) throw serviceError("Maintenance not found", 404);
    if (user.role !== "ADMIN" && !(user.role === "MAINTENANCE" && maintenance.assigned_to === user.id)) throw serviceError("Insufficient permissions", 403);

    const nextStatus = input.status ?? maintenance.status;
    if (nextStatus !== maintenance.status && !isAllowedMaintenanceTransition(maintenance.status, nextStatus)) throw serviceError(`Cannot transition from ${maintenance.status} to ${nextStatus}`, 409);

    const fields = ["title", "description", "priority", "assigned_to", "estimated_cost", "actual_cost", "scheduled_date"];
    const entries = fields.filter((field) => input[field] !== undefined);
    if (input.status !== undefined) entries.push("status");
    if (nextStatus === "COMPLETED") entries.push("completed_date");
    if (!entries.length) throw serviceError("No editable fields supplied", 400);

    const values = entries.map((field) => field === "completed_date" ? new Date() : input[field]);
    if (input.status !== undefined) values[entries.indexOf("status")] = nextStatus;
    const assignments = entries.map((field, index) => `${field} = $${index + 1}`);
    const updated = await client.query(`UPDATE maintenance SET ${assignments.join(", ")} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);

    const asset = (await client.query("SELECT * FROM assets WHERE id = $1 FOR UPDATE", [maintenance.asset_id])).rows[0];
    if (nextStatus === "IN_PROGRESS" && maintenance.status !== "IN_PROGRESS" && asset.status !== "MAINTENANCE") {
      if (!isAllowedTransition(asset.status, "MAINTENANCE")) throw serviceError(`Cannot transition asset from ${asset.status} to MAINTENANCE`, 409);
      await client.query("UPDATE assets SET status = 'MAINTENANCE', updated_at = NOW() WHERE id = $1", [asset.id]);
      await insertLifecycleEvent(client, { assetId: asset.id, fromStatus: asset.status, toStatus: "MAINTENANCE", changedBy: user.id, reason: "Maintenance started" });
    }
    if (nextStatus === "COMPLETED" && maintenance.status !== "COMPLETED") {
      if (asset.status !== "OPERATIONAL") {
        if (!isAllowedTransition(asset.status, "OPERATIONAL")) throw serviceError(`Cannot transition asset from ${asset.status} to OPERATIONAL`, 409);
        await client.query("UPDATE assets SET status = 'OPERATIONAL', updated_at = NOW() WHERE id = $1", [asset.id]);
        await insertLifecycleEvent(client, { assetId: asset.id, fromStatus: asset.status, toStatus: "OPERATIONAL", changedBy: user.id, reason: "Maintenance completed" });
      }
      if (maintenance.defect_id) await client.query("UPDATE defects SET status = 'RESOLVED', resolved_at = NOW() WHERE id = $1", [maintenance.defect_id]);
    }
    await client.query("COMMIT");
    return updated.rows[0];
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}