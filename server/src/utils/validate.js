import { ASSET_STATUSES, ASSET_TYPES } from "../constants.js";

const hasValue = (value) => value !== undefined && value !== null && value !== "";

export function validateAsset(body, { partial = false } = {}) {
  const details = {};
  const required = ["asset_code", "name", "type", "location_lat", "location_lng"];
  if (!partial) {
    for (const field of required) {
      if (!hasValue(body[field])) details[field] = "is required";
    }
  }
  if (hasValue(body.type) && !ASSET_TYPES.includes(body.type)) details.type = "is invalid";
  if (hasValue(body.status) && !ASSET_STATUSES.includes(body.status)) details.status = "is invalid";
  if (hasValue(body.location_lat) && (Number.isNaN(Number(body.location_lat)) || Number(body.location_lat) < -90 || Number(body.location_lat) > 90)) details.location_lat = "must be between -90 and 90";
  if (hasValue(body.location_lng) && (Number.isNaN(Number(body.location_lng)) || Number(body.location_lng) < -180 || Number(body.location_lng) > 180)) details.location_lng = "must be between -180 and 180";
  if (hasValue(body.condition_score) && (Number.isNaN(Number(body.condition_score)) || Number(body.condition_score) < 0 || Number(body.condition_score) > 100)) details.condition_score = "must be between 0 and 100";
  if (hasValue(body.criticality) && (!Number.isInteger(Number(body.criticality)) || Number(body.criticality) < 1 || Number(body.criticality) > 5)) details.criticality = "must be an integer between 1 and 5";
  return Object.keys(details).length ? details : null;
}

export function validationFailure(res, details) {
  return res.status(400).json({ success: false, data: null, error: { error: "Validation failed", details } });
}

export function validateConditionScore(value) {
  return value !== undefined && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100;
}