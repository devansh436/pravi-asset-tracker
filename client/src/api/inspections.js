import { request } from "./client";

export const getInspections = (assetId) => request(`/assets/${assetId}/inspections`);
export const createInspection = (assetId, body) => request(`/assets/${assetId}/inspections`, { method: "POST", body: JSON.stringify(body) });