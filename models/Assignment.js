import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true, unique: true, index: true },
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
  },
  { collection: "assignments" },
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
