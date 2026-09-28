import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

const port = env.port;

try {
  await pool.query("SELECT 1");
  app.listen(port, () => console.log(`Server listening on port ${port}`));
} catch (error) {
  console.error("Database initialization failed:", error.message);
  process.exit(1);
}