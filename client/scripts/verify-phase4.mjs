const baseUrl = (process.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

async function check(path, expected = 200) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { "x-demo-user": "admin" } });
  if (response.status !== expected) throw new Error(`${path}: expected ${expected}, got ${response.status}`);
  const body = await response.json();
  if (!body.success) throw new Error(`${path}: API returned success=false`);
  return body.data;
}

const assets = await check("/assets");
const dashboard = await check("/dashboard");
await check("/maintenance");  
await check("/health");
if (!Array.isArray(assets)) throw new Error("assets response is not an array");
for (const field of ["totalAssets", "countsByType", "countsByStatus", "averageCondition", "lowConditionAssets", "openDefects", "activeMaintenance", "criticalAssets", "upcomingEol"]) {
  if (dashboard[field] === null || dashboard[field] === undefined) throw new Error(`dashboard field missing: ${field}`);
}
console.log("PASS verify-phase4");
