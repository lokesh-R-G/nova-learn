import { Attendance } from "../models/Attendance.js";
import { Assignment } from "../models/Assignment.js";
import { Mapping } from "../models/Mapping.js";
import { Marks } from "../models/Marks.js";
import { Student } from "../models/Student.js";

export async function getClassAnalytics(req, res) {
  const classId = req.params.classId;
  const [students, attendance, marks, assignments, mappings] = await Promise.all([
    Student.find({ class_id: classId }, { _id: 0 }).lean(),
    Attendance.find({ class_id: classId }, { _id: 0 }).lean(),
    Marks.aggregate([
      { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student" } },
      { $unwind: "$student" },
      { $match: { "student.class_id": classId } },
      { $group: { _id: "$subject", totalMarks: { $sum: "$marks" }, totalMax: { $sum: "$max_marks" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Assignment.find({ class_id: classId }, { _id: 0 }).lean(),
    Mapping.find({ class_id: classId }, { _id: 0 }).lean(),
  ]);

  const attendanceRate = attendance.length
    ? Math.round((attendance.filter((entry) => entry.status === "present").length / attendance.length) * 100)
    : 0;

  const subjectScores = marks.map((item) => ({
    subject: item._id,
    averageScore: item.totalMax ? Math.round((item.totalMarks / item.totalMax) * 100) : 0,
    entries: item.count,
  }));

  const averageScore = subjectScores.length
    ? Math.round(subjectScores.reduce((sum, item) => sum + item.averageScore, 0) / subjectScores.length)
    : 0;

  const response = {
    class_id: classId,
    student_count: students.length,
    attendance_rate: attendanceRate,
    average_score: averageScore,
    assignments_count: assignments.length,
    teacher_assignments: mappings.length,
    subject_scores: subjectScores,
  };

  console.log(`[api] analytics/class/${classId}: 1 record(s)`);
  return res.status(200).json({ data: response });
}