import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import { findAssetById } from "../models/assetModel.js";
import { insertLifecycleEvent } from "../utils/lifecycle.js";

export async function listAssets(filters) {
  const conditions = [];
  const values = [];
  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(asset_code ILIKE $${values.length} OR name ILIKE $${values.length})`);
  }
  if (filters.type) { values.push(filters.type); conditions.push(`type = $${values.length}`); }
  if (filters.status) { values.push(filters.status); conditions.push(`status = $${values.length}`); }
  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  return (await pool.query(`SELECT * FROM assets${where} ORDER BY created_at DESC`, values)).rows;
}

export async function createAsset(input, userId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const assetId = randomUUID();
    const asset = await client.query(
      `INSERT INTO assets (id, asset_code, name, type, status, parent_asset_id, location_lat, location_lng, address, owner, installation_date, expected_eol, condition_score, criticality, description, details)
       VALUES ($1, $2, $3, $4, 'PLANNED', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [assetId, input.asset_code, input.name, input.type, input.parent_asset_id || null, input.location_lat, input.location_lng, input.address || null, input.owner || null, input.installation_date || null, input.expected_eol || null, input.condition_score ?? null, input.criticality ?? null, input.description || null, input.details || {}],
    );
    await insertLifecycleEvent(client, { assetId, fromStatus: null, toStatus: "PLANNED", changedBy: userId, reason: input.note });
    await client.query("COMMIT");
    return asset.rows[0];
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

export async function updateAsset(id, input) {
  const allowed = ["asset_code", "name", "type", "parent_asset_id", "location_lat", "location_lng", "address", "owner", "installation_date", "expected_eol", "condition_score", "criticality", "description", "details"];
  const entries = allowed.filter((field) => input[field] !== undefined);
  if (!entries.length) return null;
  const values = entries.map((field) => input[field]);
  const assignments = entries.map((field, index) => `${field} = $${index + 1}`);
  const result = await pool.query(`UPDATE assets SET ${assignments.join(", ")}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return result.rows[0];
}

export async function transitionAsset(id, toStatus, note, userId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const asset = await findAssetById(client, id, true);
    if (!asset) { const error = new Error("Asset not found"); error.statusCode = 404; throw error; }
    const updated = await client.query("UPDATE assets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [toStatus, id]);
    await insertLifecycleEvent(client, { assetId: id, fromStatus: asset.status, toStatus, changedBy: userId, reason: note });
    await client.query("COMMIT");
    return updated.rows[0];
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}