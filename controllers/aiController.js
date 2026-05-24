import { Student } from "../models/Student.js";
import { retrieveContext } from "../services/retrievalService.js";
import { askOpenRouter } from "../services/aiService.js";
import { getServerEnv } from "../services/env.js";
import { AppError } from "../utils/appError.js";
import { ok } from "../utils/apiResponse.js";
import { requireFields } from "../utils/validators.js";

let _config;
function getConfig() {
  if (!_config) _config = getServerEnv(process.env);
  return _config;
}

export async function chat(req, res) {
  const config = getConfig();
  const { student_id, subject, question } = req.body;
  requireFields(req.body, ["student_id", "subject", "question"], "ai chat");

  const student = await Student.findOne({ student_id }, { _id: 0 }).lean();
  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  const { contextText, sources } = retrieveContext({ subject, question, limit: 3 });
  const answer = await askOpenRouter({
    question,
    context: contextText,
    config,
  });

  return ok(res, {
    answer,
    sources,
  });
}
