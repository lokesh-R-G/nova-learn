import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true, index: true },
    class_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
  },
  { collection: "students" },
);

export const Student = mongoose.model("Student", studentSchema);
