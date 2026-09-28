import { useRole } from "../context/RoleContext";

const ACTION_ROLES = {
  view: ["admin", "inspector", "maintenance", "viewer"],
  "asset.create": ["admin", "inspector"],
  "asset.edit": ["admin", "inspector"],
  "asset.retire": ["admin"],
  "asset.transition": ["admin", "inspector"],
  "inspection.create": ["admin", "inspector"],
  "defect.create": ["admin", "inspector", "maintenance"],
  "defect.update": ["admin", "inspector", "maintenance"],
  "maintenance.create": ["admin", "inspector", "maintenance"],
  "maintenance.assign": ["admin", "maintenance"],
  "maintenance.updateStatus": ["admin", "maintenance"],
  "maintenance.recordCost": ["admin", "maintenance"],
  "maintenance.close": ["admin", "inspector", "maintenance"],
};

export function can(role, action) {
  return ACTION_ROLES[action]?.includes(role) || false;
}

export function usePermission(action) {
  const { role } = useRole();
  return can(role, action);
}