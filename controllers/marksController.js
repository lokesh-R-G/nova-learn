import { Marks } from "../models/Marks.js";

export async function getMarksByStudent(req, res) {
  const records = await Marks.find({ student_id: req.params.studentId }, { _id: 0 })
    .sort({ subject: 1, exam: 1 })
    .lean();
  res.status(200).json({ data: records });
}

export async function createMarks(req, res) {
  const { student_id, subject, exam, marks, max_marks } = req.body;
  if (!student_id || !subject || !exam || marks == null || max_marks == null) {
    return res.status(400).json({ error: "student_id, subject, exam, marks, max_marks are required." });
  }

  const record = await Marks.create({
    student_id,
    subject,
    exam,
    marks: Number(marks),
    max_marks: Number(max_marks),
  });

  return res.status(201).json({ data: { ...record.toObject(), _id: undefined } });
}
