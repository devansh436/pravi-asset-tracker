import { failure } from "./response.js";

export function notFound(_req, res) {
  return failure(res, 404, "Route not found");
}