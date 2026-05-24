import { Attendance } from "../models/Attendance.js";

function logCount(label, count) {
  console.log(`[api] ${label}: ${count} record(s)`);
}

export async function getAttendanceByStudent(req, res) {
  const records = await Attendance.find({ student_id: req.params.studentId }, { _id: 0 })
    .sort({ date: -1 })
    .lean();
  logCount(`attendance/student/${req.params.studentId}`, records.length);
  res.status(200).json({ data: records });
}

export async function getAttendanceByClass(req, res) {
  const records = await Attendance.find({ class_id: req.params.classId }, { _id: 0 })
    .sort({ date: -1, student_id: 1 })
    .lean();
  logCount(`attendance/class/${req.params.classId}`, records.length);
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

  console.log(`[api] attendance/create: 1 record`);

  return res.status(201).json({ data: { ...record.toObject(), _id: undefined } });
}
