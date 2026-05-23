import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Parent } from "../models/Parent.js";

const ROLE_MODELS = {
  student: Student,
  teacher: Teacher,
  parent: Parent,
};

export async function findUserByRole(role, identifier) {
  const Model = ROLE_MODELS[role];
  if (!Model) return null;

  const fieldMap = {
    student: "student_id",
    teacher: "teacher_id",
    parent: "parent_id",
  };

  const field = fieldMap[role];
  return Model.findOne({ [field]: identifier }, { _id: 0 }).lean();
}

export function isAdminRole(role) {
  return role === "admin" || role === "accounts";
}
