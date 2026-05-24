import { Assignment } from "../models/Assignment.js";
import { Student } from "../models/Student.js";
import { Submission } from "../models/Submission.js";

function generateAssignmentId() {
  const stamp = Date.now().toString().slice(-6);
  return `A${stamp}`;
}

function withSyntheticDueDate(assignment, index = 0) {
  const due = new Date();
  due.setDate(due.getDate() + (index % 10) + 1);
  return {
    ...assignment,
    due_date: due.toISOString(),
  };
}

export async function getAssignmentsByClass(classId) {
  const [assignments, submissions] = await Promise.all([
    Assignment.find({ class_id: classId }, { _id: 0 }).lean(),
    Submission.aggregate([
      { $lookup: { from: "assignments", localField: "assignment_id", foreignField: "assignment_id", as: "assignment" } },
      { $unwind: "$assignment" },
      { $match: { "assignment.class_id": classId } },
      { $group: { _id: "$assignment_id", submissions_count: { $sum: 1 }, average_marks: { $avg: "$marks" } } },
    ]),
  ]);

  const submissionMap = new Map(submissions.map((item) => [item._id, item]));
  return assignments.map((assignment, index) => {
    const merged = submissionMap.get(assignment.assignment_id);
    return {
      ...withSyntheticDueDate(assignment, index),
      submissions_count: merged?.submissions_count ?? 0,
      average_marks: merged?.average_marks ? Math.round(merged.average_marks) : null,
    };
  });
}

export async function createAssignment(payload) {
  const assignment = await Assignment.create({
    assignment_id: payload.assignment_id || generateAssignmentId(),
    class_id: payload.class_id,
    subject: payload.subject,
    title: payload.title,
  });

  return assignment.toObject();
}

export async function getAssignmentsForStudent(studentId) {
  const student = await Student.findOne({ student_id: studentId }, { _id: 0 }).lean();
  if (!student) return null;

  const [assignments, submissions] = await Promise.all([
    Assignment.find({ class_id: student.class_id }, { _id: 0 }).lean(),
    Submission.find({ student_id: studentId }, { _id: 0 }).lean(),
  ]);

  const submissionMap = new Map(submissions.map((submission) => [submission.assignment_id, submission]));

  return assignments.map((assignment, index) => {
    const submission = submissionMap.get(assignment.assignment_id);
    return {
      ...withSyntheticDueDate(assignment, index),
      status: submission ? "submitted" : "pending",
      submission_marks: submission?.marks ?? null,
    };
  });
}
