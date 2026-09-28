import { success } from "../middleware/response.js";
import { getHealth } from "../services/healthService.js";

export async function healthCheck(_req, res, next) {
  try {
    return success(res, await getHealth());
  } catch (error) {
    return next(error);
  }
}