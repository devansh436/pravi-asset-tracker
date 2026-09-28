export const ROLES = [
  "admin",
  "inspector",
  "maintenance",
  "viewer",
];

export const ROLE_DESCRIPTIONS = {
  admin:
    "Full operational access across assets, inspections, defects and maintenance.",

  inspector:
    "Inspect infrastructure, record conditions and manage defects.",

  maintenance:
    "Manage maintenance work, assignments, costs and completion.",

  viewer:
    "Read-only access to infrastructure data, maps and operational status.",
};

/*
 * Frontend visibility matrix.
 *
 * This controls whether an action is SHOWN in the UI.
 * Backend RBAC remains responsible for enforcement.
 */
export const PERMISSIONS = {
  // Viewing
  VIEW_DASHBOARD: [
    "admin",
    "inspector",
    "maintenance",
    "viewer",
  ],

  VIEW_ASSET_DETAILS: [
    "admin",
    "inspector",
    "maintenance",
    "viewer",
  ],

  // Assets
  CREATE_ASSET: [
    "admin",
    "inspector",
  ],

  EDIT_ASSET: [
    "admin",
    "inspector",
  ],

  RETIRE_ASSET: [
    "admin",
  ],

  CHANGE_ASSET_LIFECYCLE: [
    "admin",
    "inspector",
  ],

  // Inspections
  PERFORM_INSPECTION: [
    "admin",
    "inspector",
  ],

  UPDATE_CONDITION: [
    "admin",
    "inspector",
  ],

  // Defects
  REPORT_DEFECT: [
    "admin",
    "inspector",
    "maintenance",
  ],

  EDIT_DEFECT: [
    "admin",
    "inspector",
    "maintenance",
  ],

  UPLOAD_DEFECT_INSPECTION_PHOTO: [
    "admin",
    "inspector",
    "maintenance",
  ],

  // Maintenance
  CREATE_MAINTENANCE: [
    "admin",
    "inspector",
    "maintenance",
  ],

  ASSIGN_MAINTENANCE: [
    "admin",
    "maintenance",
  ],

  UPDATE_MAINTENANCE_STATUS: [
    "admin",
    "maintenance",
  ],

  RECORD_MAINTENANCE_COST: [
    "admin",
    "maintenance",
  ],

  CLOSE_VERIFY_MAINTENANCE: [
    "admin",
    "inspector",
    "maintenance",
  ],

  // User management
  VIEW_USERS: [
    "admin",
  ],

  MANAGE_USERS_ROLES: [
    "admin",
  ],
};

export function can(role, permission) {
  if (!role) return false;

  return (
    PERMISSIONS[permission]?.includes(
      role.toLowerCase(),
    ) ?? false
  );
}

import { useRole } from "../context/RoleContext";

export function usePermissions() {
  const { role } = useRole();
  return {
    role,
    can: (permission) => can(role, permission),
  };
}