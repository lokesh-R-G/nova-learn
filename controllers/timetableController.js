import { Class } from "../models/Class.js";
import { Mapping } from "../models/Mapping.js";
import { Teacher } from "../models/Teacher.js";

const SLOT_TIMES = [
  { start_time: "08:30", end_time: "09:15", period: 1 },
  { start_time: "09:20", end_time: "10:05", period: 2 },
  { start_time: "10:20", end_time: "11:05", period: 3 },
  { start_time: "11:10", end_time: "11:55", period: 4 },
  { start_time: "12:30", end_time: "13:15", period: 5 },
  { start_time: "13:20", end_time: "14:05", period: 6 },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export async function getTimetable(req, res) {
  const [classes, mappings, teachers] = await Promise.all([
    Class.find({}, { _id: 0 }).lean(),
    Mapping.find({}, { _id: 0 }).lean(),
    Teacher.find({}, { _id: 0 }).lean(),
  ]);

  const teacherMap = new Map(teachers.map((teacher) => [teacher.teacher_id, teacher]));
  const classMap = new Map(classes.map((item) => [item.class_id, item]));

  const timetable = mappings.map((entry, index) => {
    const teacher = teacherMap.get(entry.teacher_id);
    const classRecord = classMap.get(entry.class_id);
    const slot = SLOT_TIMES[index % SLOT_TIMES.length];
    const day = DAYS[Math.floor(index / SLOT_TIMES.length) % DAYS.length];
    return {
      timetable_id: `${entry.class_id}-${entry.subject}-${index + 1}`,
      day,
      ...slot,
      class_id: entry.class_id,
      grade: classRecord?.grade ?? null,
      section: classRecord?.section ?? null,
      subject: entry.subject,
      teacher_id: entry.teacher_id,
      teacher_name: teacher?.name ?? entry.teacher_id,
      room: `Room ${200 + (index % 10)}`,
      status: "scheduled",
    };
  });

  console.log(`[api] timetable: ${timetable.length} record(s)`);
  return res.status(200).json({ data: timetable });
}