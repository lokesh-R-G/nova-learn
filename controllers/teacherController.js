import { ok } from "../utils/apiResponse.js";
import { listTeachers } from "../services/teacherService.js";

export async function getTeachers(req, res) {
  const teachers = await listTeachers();
  return ok(res, teachers);
}
