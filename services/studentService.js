import { Student } from "../models/Student.js";

export async function listStudents({ skip, limit, classId, q }) {
  const filter = {};
  if (classId) {
    filter.class_id = classId;
  }
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [{ student_id: regex }, { name: regex }, { class_id: regex }];
  }

  const [rows, total] = await Promise.all([
    Student.find(filter, { _id: 0 }).skip(skip).limit(limit).lean(),
    Student.countDocuments(filter),
  ]);

  return { rows, total };
}

export async function getStudentById(studentId) {
  return Student.findOne({ student_id: studentId }, { _id: 0 }).lean();
}

export async function getStudentsByClass(classId) {
  return Student.find({ class_id: classId }, { _id: 0 }).lean();
}
