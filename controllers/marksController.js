import { Marks } from "../models/Marks.js";
import { created, ok } from "../utils/apiResponse.js";
import { positiveNumber, requireFields } from "../utils/validators.js";

export async function getMarksByStudent(req, res) {
  const records = await Marks.find({ student_id: req.params.studentId }, { _id: 0 })
    .sort({ subject: 1, exam: 1 })
    .lean();
  return ok(res, records);
}

export async function createMarks(req, res) {
  const { student_id, subject, exam, marks, max_marks } = req.body;
  requireFields(req.body, ["student_id", "subject", "exam", "marks", "max_marks"], "marks");

  const record = await Marks.create({
    student_id,
    subject,
    exam,
    marks: positiveNumber(marks, "marks"),
    max_marks: positiveNumber(max_marks, "max_marks"),
  });

  return created(res, { ...record.toObject(), _id: undefined });
}
