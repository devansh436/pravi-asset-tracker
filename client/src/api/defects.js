import { request } from "./client";

export const getDefects = (assetId) => request(`/assets/${assetId}/defects`);
export const createDefect = (assetId, body) => request(`/assets/${assetId}/defects`, { method: "POST", body: JSON.stringify(body) });
export const updateDefect = (id, body) => request(`/defects/${id}`, { method: "PATCH", body: JSON.stringify(body) });