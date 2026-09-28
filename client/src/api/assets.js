import { request } from "./client";

export const getAssets = (filters = {}) => {
  const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  return request(`/assets${params.toString() ? `?${params}` : ""}`);
};
export const getAsset = (id) => request(`/assets/${id}`);
export const getLifecycle = (id) => request(`/assets/${id}/lifecycle`);
export const createAsset = (body) => request("/assets", { method: "POST", body: JSON.stringify(body) });
export const transitionAsset = (id, body) => request(`/assets/${id}/transition`, { method: "POST", body: JSON.stringify(body) });