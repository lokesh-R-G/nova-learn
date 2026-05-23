import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    class_id: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
  },
  { collection: "attendance" },
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
