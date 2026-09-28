export const required = (body, fields) =>
  fields.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );

export const validEnum = (value, values) => values.includes(value);

export const actorId = (req) =>
  req.header("x-user-id") || req.body.changedBy || req.body.inspectorId;

export function validateAsset(body, assetTypes) {
  const missing = required(body, [
    "assetCode",
    "name",
    "type",
    "locationLat",
    "locationLng",
  ]);
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (!validEnum(body.type, assetTypes)) return "Invalid asset type";
  if (
    Number.isNaN(Number(body.locationLat)) ||
    Number.isNaN(Number(body.locationLng))
  )
    return "Location coordinates must be numbers";
  if (
    body.criticality !== undefined &&
    (Number(body.criticality) < 1 || Number(body.criticality) > 5)
  )
    return "Criticality must be between 1 and 5";
  if (
    body.conditionScore !== undefined &&
    (Number(body.conditionScore) < 0 || Number(body.conditionScore) > 100)
  )
    return "Condition score must be between 0 and 100";
  return null;
}

export function httpError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}