const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const maintenanceUserId = "00000000-0000-0000-0000-000000000003";

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
  const createdAsset = await request("/api/assets", "admin", { method: "POST", body: JSON.stringify({ asset_code: `PHASE3-${Date.now()}`, name: "Phase 3 Smoke Asset", type: "ROAD", location_lat: 28.61, location_lng: 77.20 }) });
  assert(createdAsset.response.status === 201, "asset creation failed");
  const assetId = createdAsset.body.data.id;
  for (const toStatus of ["UNDER_CONSTRUCTION", "OPERATIONAL"]) {
    assert((await request(`/api/assets/${assetId}/transition`, "admin", { method: "POST", body: JSON.stringify({ toStatus }) })).response.status === 200, `asset transition to ${toStatus} failed`);
  }
  const inspection = await request(`/api/assets/${assetId}/inspections`, "inspector", { method: "POST", body: JSON.stringify({ condition_score: 72.5, notes: "Phase 3 inspection" }) });
  assert(inspection.response.status === 201, "inspection creation failed");
  assert((await request(`/api/assets/${assetId}/inspections`, "inspector")).body.data[0].condition_score === "72.5", "inspection score was not persisted");
  assert((await request(`/api/assets/${assetId}/inspections`, "viewer", { method: "POST", body: JSON.stringify({ condition_score: 50 }) })).response.status === 403, "viewer inspection should return 403");
  assert((await request("/api/assets/00000000-0000-0000-0000-000000000000/inspections", "inspector")).response.status === 404, "missing inspection asset should return 404");

  const defect = await request(`/api/assets/${assetId}/defects`, "inspector", { method: "POST", body: JSON.stringify({ inspection_id: inspection.body.data.id, type: "SURFACE", severity: "HIGH", description: "Crack" }) });
  assert(defect.response.status === 201, "defect creation failed");
  const defectId = defect.body.data.id;
  assert((await request(`/api/defects/${defectId}`, "inspector", { method: "PATCH", body: JSON.stringify({ status: "IN_PROGRESS" }) })).response.status === 200, "defect patch failed");
  assert((await request("/api/defects/00000000-0000-0000-0000-000000000000", "inspector", { method: "PATCH", body: JSON.stringify({ status: "OPEN" }) })).response.status === 404, "missing defect should return 404");

  const maintenance = await request("/api/maintenance", "inspector", { method: "POST", body: JSON.stringify({ asset_id: assetId, defect_id: defectId, title: "Repair crack", priority: "HIGH", assigned_to: maintenanceUserId }) });
  assert(maintenance.response.status === 201, "maintenance creation failed");
  const maintenanceId = maintenance.body.data.id;
  assert((await request(`/api/maintenance/${maintenanceId}`, "admin", { method: "PATCH", body: JSON.stringify({ status: "COMPLETED" }) })).response.status === 409, "OPEN to COMPLETED should return 409");
  assert((await request(`/api/maintenance/${maintenanceId}`, "admin", { method: "PATCH", body: JSON.stringify({ status: "ASSIGNED" }) })).response.status === 200, "OPEN to ASSIGNED failed");
  assert((await request(`/api/maintenance/${maintenanceId}`, "viewer", { method: "PATCH", body: JSON.stringify({ description: "forbidden" }) })).response.status === 403, "viewer maintenance should return 403");
  assert((await request(`/api/maintenance/${maintenanceId}`, "maintenance", { method: "PATCH", body: JSON.stringify({ status: "IN_PROGRESS" }) })).response.status === 200, "ASSIGNED to IN_PROGRESS failed");
  assert((await request(`/api/assets/${assetId}`, "admin")).body.data.status === "MAINTENANCE", "asset did not enter MAINTENANCE");
  assert((await request(`/api/maintenance/${maintenanceId}`, "maintenance", { method: "PATCH", body: JSON.stringify({ status: "COMPLETED", actual_cost: 100 }) })).response.status === 200, "IN_PROGRESS to COMPLETED failed");
  assert((await request(`/api/assets/${assetId}`, "admin")).body.data.status === "OPERATIONAL", "asset did not return to OPERATIONAL");
  const defects = await request(`/api/assets/${assetId}/defects`, "inspector");
  assert(defects.body.data.find((item) => item.id === defectId).status === "RESOLVED", "linked defect was not resolved");
  const lifecycle = await request(`/api/assets/${assetId}/lifecycle`, "admin");
  assert(lifecycle.body.data.some((event) => event.to_status === "MAINTENANCE") && lifecycle.body.data.some((event) => event.to_status === "OPERATIONAL"), "maintenance lifecycle events missing");
  console.log("PASS smoke-phase3");
}

run().catch((error) => {
  console.error(`FAIL smoke-phase3: ${error.message}`);
  process.exitCode = 1;
});