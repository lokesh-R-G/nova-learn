import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacher_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { collection: "teachers" },
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
