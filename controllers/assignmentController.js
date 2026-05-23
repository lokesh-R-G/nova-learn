import { Assignment } from "../models/Assignment.js";

function generateAssignmentId() {
  const stamp = Date.now().toString().slice(-6);
  return `A${stamp}`;
}

export async function getAssignmentsByClass(req, res) {
  const records = await Assignment.find({ class_id: req.params.classId }, { _id: 0 }).lean();
  res.status(200).json({ data: records });
}

export async function createAssignment(req, res) {
  const { assignment_id, class_id, subject, title } = req.body;
  if (!class_id || !subject || !title) {
    return res.status(400).json({ error: "class_id, subject, and title are required." });
  }

  const record = await Assignment.create({
    assignment_id: assignment_id || generateAssignmentId(),
    class_id,
    subject,
    title,
  });

  return res.status(201).json({ data: { ...record.toObject(), _id: undefined } });
}
