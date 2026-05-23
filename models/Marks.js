import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    exam: { type: String, required: true },
    marks: { type: Number, required: true },
    max_marks: { type: Number, required: true },
  },
  { collection: "marks" },
);

export const Marks = mongoose.model("Marks", marksSchema);
