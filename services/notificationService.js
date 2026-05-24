import { Attendance } from "../models/Attendance.js";
import { Assignment } from "../models/Assignment.js";
import { Fees } from "../models/Fees.js";
import { Marks } from "../models/Marks.js";
import { Student } from "../models/Student.js";

export async function listNotificationsForStudent(studentId) {
  const student = await Student.findOne({ student_id: studentId }, { _id: 0 }).lean();
  if (!student) return [];

  const [attendance, assignments, fees, marks] = await Promise.all([
    Attendance.find({ student_id: studentId }, { _id: 0 }).sort({ date: -1 }).limit(5).lean(),
    Assignment.find({ class_id: student.class_id }, { _id: 0 }).sort({ class_id: 1, subject: 1 }).limit(5).lean(),
    Fees.findOne({ student_id: studentId }, { _id: 0 }).lean(),
    Marks.find({ student_id: studentId }, { _id: 0 }).sort({ exam: -1, subject: 1 }).limit(5).lean(),
  ]);

  const notifications = [];

  const absent = attendance.find((entry) => entry.status === "absent");
  if (absent) {
    notifications.push({
      notification_id: `att-${absent.student_id}-${String(absent.date).slice(0, 10)}`,
      type: "attendance",
      title: "Absent record logged",
      message: `Attendance recorded as absent on ${new Date(absent.date).toLocaleDateString()}`,
      severity: "warning",
      date: absent.date,
      read: false,
    });
  }

  if (marks.length) {
    const latestMark = marks[0];
    notifications.push({
      notification_id: `mark-${latestMark.student_id}-${latestMark.subject}-${latestMark.exam}`,
      type: "result",
      title: `${latestMark.subject} result available`,
      message: `${latestMark.exam}: ${latestMark.marks}/${latestMark.max_marks}`,
      severity: "success",
      date: new Date(),
      read: false,
    });
  }

  if (fees && fees.balance > 0) {
    notifications.push({
      notification_id: `fee-${fees.student_id}`,
      type: "fees",
      title: "Tuition balance due",
      message: `Outstanding balance is ${fees.balance.toLocaleString()}`,
      severity: "danger",
      date: new Date(),
      read: false,
    });
  }

  if (assignments.length) {
    const latestAssignment = assignments[0];
    notifications.push({
      notification_id: `assignment-${latestAssignment.assignment_id}`,
      type: "assignment",
      title: "New assignment assigned",
      message: `${latestAssignment.title} for ${latestAssignment.subject}`,
      severity: "brand",
      date: new Date(),
      read: false,
    });
  }

  return notifications;
}
