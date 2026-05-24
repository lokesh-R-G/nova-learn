import { AppError } from "../utils/appError.js";
import { created, ok } from "../utils/apiResponse.js";
import { requireFields } from "../utils/validators.js";
import {
  createAssignment as createAssignmentService,
  getAssignmentsByClass as getAssignmentsByClassService,
  getAssignmentsForStudent,
} from "../services/assignmentService.js";

export async function getAssignmentsByClass(req, res) {
  const records = await getAssignmentsByClassService(req.params.classId);
  return ok(res, records);
}

export async function getAssignmentsByStudent(req, res) {
  const records = await getAssignmentsForStudent(req.params.studentId);
  if (!records) {
    throw new AppError("Student not found.", 404);
  }
  return ok(res, records);
}

export async function createAssignment(req, res) {
  requireFields(req.body, ["class_id", "subject", "title"], "assignment");
  const record = await createAssignmentService(req.body);
  return created(res, { ...record, _id: undefined });
}
