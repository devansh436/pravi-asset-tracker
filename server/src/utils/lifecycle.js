import { randomUUID } from "node:crypto";
import { LIFECYCLE_ALLOWED_ROLES, LIFECYCLE_TRANSITIONS } from "../constants.js";

export { LIFECYCLE_TRANSITIONS };
export const allowedRolesForTransition = (fromStatus, toStatus) =>
  LIFECYCLE_ALLOWED_ROLES[fromStatus]?.[toStatus] || [];

export function isAllowedTransition(fromStatus, toStatus) {
  return LIFECYCLE_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
}

export async function insertLifecycleEvent(client, { assetId, fromStatus, toStatus, changedBy, reason }) {
  await client.query(
    "INSERT INTO lifecycle_events (id, asset_id, from_status, to_status, changed_by, reason) VALUES ($1, $2, $3, $4, $5, $6)",
    [randomUUID(), assetId, fromStatus, toStatus, changedBy, reason || null],
  );
}