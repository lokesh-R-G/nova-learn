import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    timetable_id: { type: String, required: true, unique: true, index: true },
    day: { type: String, required: true, index: true },
    period: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    class_id: { type: String, required: true, index: true },
    grade: { type: Number, required: false },
    section: { type: String, required: false },
    subject: { type: String, required: true },
    teacher_id: { type: String, required: true, index: true },
    teacher_name: { type: String, required: true },
    room: { type: String, required: true },
    status: { type: String, required: true, default: "scheduled" },
  },
  { collection: "timetable" },
);

export const Timetable = mongoose.model("Timetable", timetableSchema);
