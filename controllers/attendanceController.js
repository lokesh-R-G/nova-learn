import { Attendance } from "../models/Attendance.js";

export async function getAttendanceByStudent(req, res) {
  const records = await Attendance.find({ student_id: req.params.studentId }, { _id: 0 })
    .sort({ date: -1 })
    .lean();
  res.status(200).json({ data: records });
}

export async function createAttendance(req, res) {
  const { student_id, class_id, date, status } = req.body;
  if (!student_id || !class_id || !date || !status) {
    return res.status(400).json({ error: "student_id, class_id, date, and status are required." });
  }

  const record = await Attendance.create({
    student_id,
    class_id,
    date: new Date(date),
    status,
  });

  return res.status(201).json({ data: { ...record.toObject(), _id: undefined } });
}
