import { failure } from "./response.js";

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return failure(res, 403, "Insufficient permissions");
    return next();
  };
}