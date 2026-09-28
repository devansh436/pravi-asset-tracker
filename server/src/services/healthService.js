import { pool } from "../db/pool.js";

export async function getHealth() {
  await pool.query("SELECT 1");
  return { status: "ok", database: "ok" };
}