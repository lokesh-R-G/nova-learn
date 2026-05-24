import { created, ok } from "../utils/apiResponse.js";
import { requireFields } from "../utils/validators.js";
import {
  createOrUpdateAttendance,
  getAttendanceByClass as getAttendanceByClassService,
  getAttendanceByStudent as getAttendanceByStudentService,
  getStudentAttendanceSummary,
} from "../services/attendanceService.js";

export async function getAttendanceByStudent(req, res) {
  const records = await getAttendanceByStudentService(req.params.studentId);
  return ok(res, records);
}

export async function getAttendanceByClass(req, res) {
  const records = await getAttendanceByClassService(req.params.classId);
  return ok(res, records);
}

export async function getAttendanceSummaryByStudent(req, res) {
  const summary = await getStudentAttendanceSummary(req.params.studentId);
  return ok(res, summary);
}

export async function createAttendance(req, res) {
  requireFields(req.body, ["student_id", "class_id", "date", "status"], "attendance");
  const record = await createOrUpdateAttendance(req.body);
  return created(res, { ...record, _id: undefined });
}
