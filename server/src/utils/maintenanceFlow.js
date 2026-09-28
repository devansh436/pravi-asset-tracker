export const MAINTENANCE_TRANSITIONS = {
  OPEN: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
};

export function isAllowedMaintenanceTransition(fromStatus, toStatus) {
  return MAINTENANCE_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
}