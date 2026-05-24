import { ok } from "../utils/apiResponse.js";
import { listNotificationsForStudent } from "../services/notificationService.js";

export async function getNotificationsForStudent(req, res) {
  const studentId = req.params.studentId;
  const notifications = await listNotificationsForStudent(studentId);
  return ok(res, notifications);
}