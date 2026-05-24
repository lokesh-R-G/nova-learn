import { ok } from "../utils/apiResponse.js";
import { getClassAnalytics as getClassAnalyticsService } from "../services/analyticsService.js";

export async function getClassAnalytics(req, res) {
  const classId = req.params.classId;
  const response = await getClassAnalyticsService(classId);
  return ok(res, response);
}