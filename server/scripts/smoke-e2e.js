const baseUrl = process.env.BASE_URL || "http://localhost:3000";

async function request(path, user = "admin", options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "content-type": "application/json", "x-demo-user": user, ...(options.headers || {}) },
  });
  let body = null;
  try { body = await response.json(); } catch (_error) { /* no response body */ }
  return { response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  assert((await request("/api/health")).response.status === 200, "health failed");
  for (const role of ["admin", "inspector", "maintenance", "viewer"]) {
    const me = await request("/api/me", role);
    assert(me.response.status === 200 && me.body.data.role === role.toUpperCase(), `${role} login failed`);
  }

  const dashboard = await request("/api/dashboard", "viewer");
  assert(dashboard.response.status === 200, "dashboard failed");
  for (const field of ["totalAssets", "countsByType", "countsByStatus", "averageCondition", "lowConditionAssets", "openDefects", "activeMaintenance", "criticalAssets", "upcomingEol"]) assert(dashboard.body.data[field] !== null && dashboard.body.data[field] !== undefined, `dashboard field missing: ${field}`);

  const asset = await request("/api/assets", "admin", { method: "POST", body: JSON.stringify({ asset_code: `E2E-${Date.now()}`, name: "E2E Test Road", type: "ROAD", location_lat: 28.61, location_lng: 77.20, criticality: 5 }) });
  assert(asset.response.status === 201, "asset create failed");
  const assetId = asset.body.data.id;
  for (const status of ["UNDER_CONSTRUCTION", "OPERATIONAL"]) assert((await request(`/api/assets/${assetId}/transition`, "admin", { method: "POST", body: JSON.stringify({ toStatus: status }) })).response.status === 200, `transition ${status} failed`);

  assert((await request("/api/assets", "viewer")).response.status === 200, "asset list failed");
  assert((await request(`/api/assets/${assetId}`, "viewer")).response.status === 200, "asset detail failed");
  const inspection = await request(`/api/assets/${assetId}/inspections`, "inspector", { method: "POST", body: JSON.stringify({ condition_score: 36, notes: "E2E score update" }) });
  assert(inspection.response.status === 201, "inspection create failed");
  const detailAfterInspection = await request(`/api/assets/${assetId}`, "viewer");
  assert(detailAfterInspection.body.data.condition_score === "36", "inspection did not update condition");
  assert((await request(`/api/assets/${assetId}/inspections`, "viewer")).response.status === 200, "inspection list failed");

  const defect = await request(`/api/assets/${assetId}/defects`, "inspector", { method: "POST", body: JSON.stringify({ inspection_id: inspection.body.data.id, type: "SURFACE", severity: "HIGH", description: "E2E crack" }) });
  assert(defect.response.status === 201, "defect create failed");
  assert((await request(`/api/assets/${assetId}/defects`, "viewer")).response.status === 200, "defect list failed");
  assert((await request(`/api/defects/${defect.body.data.id}`, "inspector", { method: "PATCH", body: JSON.stringify({ status: "IN_PROGRESS" }) })).response.status === 200, "defect patch failed");

  const maintenance = await request("/api/maintenance", "inspector", { method: "POST", body: JSON.stringify({ asset_id: assetId, defect_id: defect.body.data.id, title: "E2E repair", priority: "HIGH", assigned_to: "00000000-0000-0000-0000-000000000003" }) });
  assert(maintenance.response.status === 201, "maintenance create failed");
  const maintenanceId = maintenance.body.data.id;
  assert((await request(`/api/maintenance/${maintenanceId}`, "admin", { method: "PATCH", body: JSON.stringify({ status: "COMPLETED" }) })).response.status === 409, "invalid OPEN to COMPLETED transition accepted");
  assert((await request(`/api/maintenance/${maintenanceId}`, "admin", { method: "PATCH", body: JSON.stringify({ status: "ASSIGNED" }) })).response.status === 200, "ASSIGNED transition failed");
  assert((await request(`/api/maintenance/${maintenanceId}`, "maintenance", { method: "PATCH", body: JSON.stringify({ status: "IN_PROGRESS" }) })).response.status === 200, "IN_PROGRESS transition failed");
  assert((await request(`/api/assets/${assetId}`, "viewer")).body.data.status === "MAINTENANCE", "maintenance asset status missing");
  assert((await request(`/api/maintenance/${maintenanceId}`, "maintenance", { method: "PATCH", body: JSON.stringify({ status: "COMPLETED" }) })).response.status === 200, "COMPLETED transition failed");
  assert((await request(`/api/assets/${assetId}`, "viewer")).body.data.status === "OPERATIONAL", "operational asset status missing");
  assert((await request(`/api/assets/${assetId}/lifecycle`, "viewer")).response.status === 200, "lifecycle list failed");
  assert((await request(`/api/maintenance/${maintenanceId}`, "viewer")).response.status === 200, "maintenance detail failed");
  assert((await request("/api/maintenance", "viewer")).response.status === 200, "maintenance list failed");
  assert((await request(`/api/assets/${assetId}/defects`, "viewer")).body.data.find((item) => item.id === defect.body.data.id).status === "RESOLVED", "defect was not resolved");

  console.log("PASS smoke-e2e");
}

run().catch((error) => {
  console.error(`FAIL smoke-e2e: ${error.message}`);
  process.exitCode = 1;
});