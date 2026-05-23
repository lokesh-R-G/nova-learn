import { Student } from "../models/Student.js";

export async function getStudents(req, res) {
  const limit = Math.min(Number.parseInt(req.query.limit ?? "100", 10), 500);
  const skip = Number.parseInt(req.query.skip ?? "0", 10);
  const students = await Student.find({}, { _id: 0 }).skip(skip).limit(limit).lean();
  res.status(200).json({ data: students });
}

export async function getStudentById(req, res) {
  const student = await Student.findOne({ student_id: req.params.id }, { _id: 0 }).lean();
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }
  return res.status(200).json({ data: student });
}

export async function getStudentsByClass(req, res) {
  const students = await Student.find({ class_id: req.params.classId }, { _id: 0 }).lean();
  res.status(200).json({ data: students });
}
