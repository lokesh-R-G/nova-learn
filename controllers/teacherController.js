import { Teacher } from "../models/Teacher.js";

export async function getTeachers(req, res) {
  const teachers = await Teacher.find({}, { _id: 0 }).lean();
  res.status(200).json({ data: teachers });
}
