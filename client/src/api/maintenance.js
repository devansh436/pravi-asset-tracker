import { request } from "./client";

export const getMaintenance = (filters = {}) => {
  const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  return request(`/maintenance${params.toString() ? `?${params}` : ""}`);
};
export const getMaintenanceItem = (id) => request(`/maintenance/${id}`);
export const createMaintenance = (body) => request("/maintenance", { method: "POST", body: JSON.stringify(body) });
export const updateMaintenance = (id, body) => request(`/maintenance/${id}`, { method: "PATCH", body: JSON.stringify(body) });