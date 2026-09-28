import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";

export async function createDefect(assetId, input) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const asset = (await client.query("SELECT id FROM assets WHERE id = $1", [assetId])).rows[0];
    if (!asset) { const error = new Error("Asset not found"); error.statusCode = 404; throw error; }
    const inspection = (await client.query("SELECT id FROM inspections WHERE id = $1 AND asset_id = $2", [input.inspection_id, assetId])).rows[0];
    if (!inspection) { const error = new Error("Inspection not found for asset"); error.statusCode = 404; throw error; }
    const defect = await client.query(
      "INSERT INTO defects (id, asset_id, inspection_id, type, severity, description, status, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [randomUUID(), assetId, input.inspection_id, input.type, input.severity, input.description || null, input.status || "OPEN", input.photo_url || null],
    );
    await client.query("COMMIT");
    return defect.rows[0];
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

export async function listDefects(assetId) {
  return (await pool.query("SELECT * FROM defects WHERE asset_id = $1 ORDER BY created_at DESC", [assetId])).rows;
}

export async function updateDefect(id, input) {
  const fields = ["type", "severity", "description", "status", "photo_url"];
  const entries = fields.filter((field) => input[field] !== undefined);
  if (!entries.length) return null;
  const values = entries.map((field) => input[field]);
  const result = await pool.query(`UPDATE defects SET ${entries.map((field, index) => `${field} = $${index + 1}`).join(", ")} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return result.rows[0];
}