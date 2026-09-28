import { success } from "../middleware/response.js";
import { getDashboard } from "../services/dashboardService.js";

export async function dashboard(req, res, next) {
  try { return success(res, await getDashboard()); } catch (error) { return next(error); }
}