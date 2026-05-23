import mongoose from "mongoose";

const mappingSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    teacher_id: { type: String, required: true, index: true },
  },
  { collection: "class_subject_teacher" },
);

export const Mapping = mongoose.model("Mapping", mappingSchema);
