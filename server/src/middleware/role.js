import { pool } from "../db/pool.js";

const VALID_ROLES = [
  "ADMIN",
  "INSPECTOR",
  "MAINTENANCE",
  "VIEWER",
];

// Cache:
// role -> { userId, role, email }
const userCache = new Map();

/**
 * Resolve the first seeded user for a role.
 *
 * The lookup is cached in memory so we don't query
 * PostgreSQL on every request.
 */
async function resolveUser(role) {
  if (userCache.has(role)) {
    return userCache.get(role);
  }

  const result = await pool.query(
    `SELECT id, role, email
     FROM users
     WHERE role = $1
     ORDER BY id
     LIMIT 1`,
    [role],
  );

  if (!result.rows.length) {
    const error = new Error(
      `No seeded user found for role ${role}`,
    );

    error.statusCode = 500;

    throw error;
  }

  const row = result.rows[0];

  const user = {
    userId: row.id,
    role: row.role,
    email: row.email,
  };

  userCache.set(role, user);

  return user;
}

/**
 * Attach a user based on X-Role.
 *
 * Accepted:
 * ADMIN
 * INSPECTOR
 * MAINTENANCE
 * VIEWER
 *
 * Header is case-insensitive.
 *
 * Missing/invalid role -> VIEWER
 */
export async function attachRole(req, _res, next) {
  try {
    const headerRole = req
      .get("X-Role")
      ?.trim()
      .toUpperCase();

    const role = VALID_ROLES.includes(headerRole)
      ? headerRole
      : "VIEWER";

    req.user = await resolveUser(role);

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require one of the specified roles.
 *
 * Example:
 *
 * requireRole("ADMIN", "INSPECTOR")
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (
      !req.user ||
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        error: `Role ${
          req.user?.role || "VIEWER"
        } is not permitted for this action`,
      });
    }

    next();
  };
}

/**
 * Asset lifecycle transition RBAC.
 *
 * ADMIN:
 *   - all transitions including RETIRED
 *
 * INSPECTOR:
 *   - normal lifecycle transitions
 *   - cannot RETIRE
 */
export function requireAssetTransitionRole(
  req,
  res,
  next,
) {
  const role = req.user?.role;
  const toStatus = req.body?.toStatus;

  if (role === "ADMIN") {
    return next();
  }

  if (
    role === "INSPECTOR" &&
    toStatus !== "RETIRED"
  ) {
    return next();
  }

  return res.status(403).json({
    error:
      toStatus === "RETIRED"
        ? "Only ADMIN can retire an asset"
        : `Role ${
            role || "VIEWER"
          } is not permitted for this action`,
  });
}

/**
 * Maintenance PATCH RBAC.
 *
 * Normal maintenance updates:
 *   ADMIN
 *   MAINTENANCE
 *
 * COMPLETED / close / verify:
 *   ADMIN
 *   INSPECTOR
 *   MAINTENANCE
 *
 * Maintenance users do NOT need to be the assignee.
 */
export function requireMaintenancePatchRole(
  req,
  res,
  next,
) {
  const role = req.user?.role;
  const status = req.body?.status;

  if (status === "COMPLETED") {
    if (
      [
        "ADMIN",
        "INSPECTOR",
        "MAINTENANCE",
      ].includes(role)
    ) {
      return next();
    }
  } else if (
    ["ADMIN", "MAINTENANCE"].includes(role)
  ) {
    return next();
  }

  return res.status(403).json({
    error: `Role ${
      role || "VIEWER"
    } is not permitted for this action`,
  });
}