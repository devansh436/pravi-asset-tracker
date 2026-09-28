import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const seedPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "db",
  "seed.sql",
);

try {
  await pool.query(await fs.readFile(seedPath, "utf8"));
  console.log("Database seed completed");
} catch (error) {
  console.error("Database seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}