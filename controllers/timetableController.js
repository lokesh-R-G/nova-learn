import { created, ok } from "../utils/apiResponse.js";
import { requireFields } from "../utils/validators.js";
import { createTimetableEntry, listTimetable } from "../services/timetableService.js";

export async function getTimetable(req, res) {
  const timetable = await listTimetable();
  return ok(res, timetable);
}

export async function createTimetable(req, res) {
  requireFields(
    req.body,
    ["day", "period", "start_time", "end_time", "class_id", "subject", "teacher_id", "teacher_name", "room"],
    "timetable",
  );

  const entry = await createTimetableEntry(req.body);
  return created(res, entry);
}