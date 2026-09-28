import { failure, success } from "../middleware/response.js";

export function getCurrentUser(req, res) {
  return req.user ? success(res, req.user) : failure(res, 401, "Firebase authentication required");
}