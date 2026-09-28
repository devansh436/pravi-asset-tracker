import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";

export async function createInspection(assetId, inspectorId, conditionScore, notes) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const asset = (await client.query("SELECT id FROM assets WHERE id = $1 FOR UPDATE", [assetId])).rows[0];
    if (!asset) { const error = new Error("Asset not found"); error.statusCode = 404; throw error; }
    const inspection = await client.query(
      "INSERT INTO inspections (id, asset_id, inspector_id, condition_score, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [randomUUID(), assetId, inspectorId, conditionScore, notes || null],
    );
    await client.query("UPDATE assets SET condition_score = $1, updated_at = NOW() WHERE id = $2", [conditionScore, assetId]);
    await client.query("COMMIT");
    return inspection.rows[0];
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

export async function listInspections(assetId) {
  return (await pool.query("SELECT * FROM inspections WHERE asset_id = $1 ORDER BY inspection_date DESC", [assetId])).rows;
}