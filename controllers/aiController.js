import { Student } from "../models/Student.js";
import { retrieveContext } from "../services/retrievalService.js";
import { askOpenRouter } from "../services/aiService.js";
import { getServerEnv } from "../services/env.js";

let _config;
function getConfig() {
  if (!_config) _config = getServerEnv(process.env);
  return _config;
}

export async function chat(req, res) {
  const config = getConfig();
  const { student_id, subject, question } = req.body;
  if (!student_id || !subject || !question) {
    return res.status(400).json({ error: "student_id, subject, and question are required." });
  }

  const student = await Student.findOne({ student_id }, { _id: 0 }).lean();
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  const { contextText, sources } = retrieveContext({ subject, question, limit: 3 });
  const answer = await askOpenRouter({
    question,
    context: contextText,
    config,
  });

  return res.status(200).json({
    answer,
    sources,
  });
}
