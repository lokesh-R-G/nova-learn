import { Teacher } from "../models/Teacher.js";

export async function listTeachers() {
  return Teacher.find({}, { _id: 0 }).sort({ name: 1 }).lean();
}
