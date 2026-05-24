import { AppError } from "../utils/appError.js";
import { ok } from "../utils/apiResponse.js";
import { parsePagination } from "../utils/validators.js";
import { getStudentById as getStudentByIdService, getStudentsByClass as getStudentsByClassService, listStudents } from "../services/studentService.js";

export async function getStudents(req, res) {
  const { page, limit, skip } = parsePagination(req.query, { page: 1, limit: 20, maxLimit: 200 });
  const classId = req.query.class_id ? String(req.query.class_id) : undefined;
  const q = req.query.q ? String(req.query.q) : undefined;
  const { rows, total } = await listStudents({ skip, limit, classId, q });
  return ok(res, rows, {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    filters: { class_id: classId ?? null, q: q ?? null },
  });
}

export async function getStudentById(req, res) {
  const student = await getStudentByIdService(req.params.id);
  if (!student) {
    throw new AppError("Student not found.", 404);
  }
  return ok(res, student);
}

export async function getStudentsByClass(req, res) {
  const students = await getStudentsByClassService(req.params.classId);
  return ok(res, students);
}
