const DEMO_USERS = {
  admin: { id: "00000000-0000-0000-0000-000000000001", name: "Demo Admin", email: "admin@example.com", role: "ADMIN" },
  inspector: { id: "00000000-0000-0000-0000-000000000002", name: "Demo Inspector", email: "inspector@example.com", role: "INSPECTOR" },
  maintenance: { id: "00000000-0000-0000-0000-000000000003", name: "Demo Maintenance", email: "maintenance@example.com", role: "MAINTENANCE" },
  viewer: { id: "00000000-0000-0000-0000-000000000004", name: "Demo Viewer", email: "viewer@example.com", role: "VIEWER" },
};

export function firebaseAuthRequired(req, _res, next) {
  req.user = DEMO_USERS[req.get("x-demo-user")?.toLowerCase()] || DEMO_USERS.admin;
  return next();
}
