import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import csvParser from "csv-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const ENV = validateEnv(process.env);
const MONGODB_URI = ENV.mongoUri;
const DB_NAME = ENV.dbName;
const BATCH_SIZE = ENV.batchSize;
const CLEAR_EXISTING = ENV.seedClear;
const NODE_ENV = ENV.nodeEnv;

const studentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true, index: true },
    class_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
  },
  { collection: "students" },
);

const teacherSchema = new mongoose.Schema(
  {
    teacher_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { collection: "teachers" },
);

const parentSchema = new mongoose.Schema(
  {
    parent_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
  },
  { collection: "parents" },
);

const classSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: true, unique: true, index: true },
    grade: { type: Number, required: true },
    section: { type: String, required: true },
  },
  { collection: "classes" },
);

const mappingSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    teacher_id: { type: String, required: true, index: true },
  },
  { collection: "class_subject_teacher" },
);

const attendanceSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    class_id: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
  },
  { collection: "attendance" },
);

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

const feesSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true, index: true },
    total_fee: { type: Number, required: true },
    paid: { type: Number, required: true },
    balance: { type: Number, required: true },
  },
  { collection: "fees" },
);

const paymentsSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { collection: "payments" },
);

const assignmentsSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true, unique: true, index: true },
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
  },
  { collection: "assignments" },
);

const submissionsSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true, index: true },
    student_id: { type: String, required: true, index: true },
    marks: { type: Number, required: true },
  },
  { collection: "submissions" },
);

const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Parent = mongoose.model("Parent", parentSchema);
const Class = mongoose.model("Class", classSchema);
const Mapping = mongoose.model("ClassSubjectTeacher", mappingSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Marks = mongoose.model("Marks", marksSchema);
const Fees = mongoose.model("Fees", feesSchema);
const Payments = mongoose.model("Payments", paymentsSchema);
const Assignments = mongoose.model("Assignments", assignmentsSchema);
const Submissions = mongoose.model("Submissions", submissionsSchema);

const toNumber = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toDate = (value) => {
  if (!value) return null;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const trim = (value) => (value == null ? "" : String(value).trim());

function isValidMongoUri(uri) {
  try {
    const parsed = new URL(uri);
    return parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:";
  } catch {
    return false;
  }
}

function parsePositiveInt(value, name, defaultValue, errors) {
  if (value == null || String(value).trim() === "") {
    return defaultValue;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    errors.push(`${name} must be a positive integer.`);
    return defaultValue;
  }
  return parsed;
}

function parseBoolean(value, name, defaultValue, errors) {
  if (value == null || String(value).trim() === "") {
    return defaultValue;
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  errors.push(`${name} must be 'true' or 'false'.`);
  return defaultValue;
}

function validateEnv(env) {
  const errors = [];
  const mongoUri = (env.MONGODB_URI ?? "").trim();
  const dbName = (env.MONGODB_DB ?? "").trim();
  const nodeEnv = (env.NODE_ENV ?? "development").trim() || "development";

  if (!mongoUri) {
    errors.push("MONGODB_URI is required.");
  } else if (!isValidMongoUri(mongoUri)) {
    errors.push("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
  }

  if (!dbName) {
    errors.push("MONGODB_DB is required.");
  }

  const batchSize = parsePositiveInt(env.SEED_BATCH_SIZE, "SEED_BATCH_SIZE", 1000, errors);
  const seedClear = parseBoolean(env.SEED_CLEAR, "SEED_CLEAR", false, errors);

  if (nodeEnv === "production" && seedClear) {
    errors.push("SEED_CLEAR=true is not allowed when NODE_ENV=production.");
  }

  if (errors.length) {
    const message = `Environment validation failed:\n- ${errors.join("\n- ")}`;
    throw new Error(message);
  }

  return {
    mongoUri,
    dbName,
    batchSize,
    seedClear,
    nodeEnv,
  };
}

async function insertBatch(model, batch) {
  if (!batch.length) return { inserted: 0, errors: 0 };
  try {
    const docs = await model.insertMany(batch, { ordered: false });
    return { inserted: docs.length, errors: 0 };
  } catch (error) {
    if (error && Array.isArray(error.writeErrors)) {
      const errorCount = error.writeErrors.length;
      const inserted = Math.max(0, batch.length - errorCount);
      console.warn(
        `Insert warnings for ${model.collection.name}: ${errorCount} errors (duplicates/validation).`,
      );
      return { inserted, errors: errorCount };
    }
    throw error;
  }
}

async function seedCsv({ model, fileName, mapRow }) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const batch = [];
  let processed = 0;
  let insertedTotal = 0;
  const stream = fs.createReadStream(filePath).pipe(csvParser());

  for await (const row of stream) {
    batch.push(mapRow(row));
    processed += 1;
    if (batch.length >= BATCH_SIZE) {
      const result = await insertBatch(model, batch);
      insertedTotal += result.inserted;
      console.log(
        `[${model.collection.name}] Inserted ${result.inserted} records (batch size ${batch.length}).`,
      );
      batch.length = 0;
    }
  }

  if (batch.length) {
    const result = await insertBatch(model, batch);
    insertedTotal += result.inserted;
    console.log(
      `[${model.collection.name}] Inserted ${result.inserted} records (batch size ${batch.length}).`,
    );
  }

  return { processed, inserted: insertedTotal };
}

async function maybeClear(model) {
  if (!CLEAR_EXISTING) return;
  await model.deleteMany({});
}

async function run() {
  console.log(`Starting seed (env: ${NODE_ENV}).`);
  console.log(`Database: ${DB_NAME}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  if (CLEAR_EXISTING) {
    console.log("SEED_CLEAR enabled: existing collections will be cleared.");
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("MongoDB connection established.");
    console.log(`Connected database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error);
    throw error;
  }

  const tasks = [
    {
      model: Class,
      fileName: "classes_full.csv",
      mapRow: (row) => ({
        class_id: trim(row.class_id),
        grade: toNumber(row.grade),
        section: trim(row.section),
      }),
    },
    {
      model: Teacher,
      fileName: "teachers_full.csv",
      mapRow: (row) => ({
        teacher_id: trim(row.teacher_id),
        name: trim(row.name),
        subject: trim(row.subject),
      }),
    },
    {
      model: Student,
      fileName: "students_full.csv",
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        class_id: trim(row.class_id),
        name: trim(row.name),
      }),
    },
    {
      model: Parent,
      fileName: "parents_full.csv",
      mapRow: (row) => ({
        parent_id: trim(row.parent_id),
        student_id: trim(row.student_id),
        name: trim(row.name),
      }),
    },
    {
      model: Mapping,
      fileName: "mapping_full.csv",
      mapRow: (row) => ({
        class_id: trim(row.class_id),
        subject: trim(row.subject),
        teacher_id: trim(row.teacher_id),
      }),
    },
    {
      model: Attendance,
      fileName: "attendance_full.csv",
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        class_id: trim(row.class_id),
        date: toDate(row.date),
        status: trim(row.status),
      }),
    },
    {
      model: Marks,
      fileName: "marks_full.csv",
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        subject: trim(row.subject),
        exam: trim(row.exam),
        marks: toNumber(row.marks),
        max_marks: toNumber(row.max_marks),
      }),
    },
    {
      model: Fees,
      fileName: "fees_full.csv",
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        total_fee: toNumber(row.total_fee),
        paid: toNumber(row.paid),
        balance: toNumber(row.balance),
      }),
    },
    {
      model: Payments,
      fileName: "payments_full.csv",
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        amount: toNumber(row.amount),
        method: trim(row.method),
        date: toDate(row.date),
      }),
    },
    {
      model: Assignments,
      fileName: "assignments_full.csv",
      mapRow: (row) => ({
        assignment_id: trim(row.assignment_id),
        class_id: trim(row.class_id),
        subject: trim(row.subject),
        title: trim(row.title),
      }),
    },
    {
      model: Submissions,
      fileName: "submissions_full.csv",
      mapRow: (row) => ({
        assignment_id: trim(row.assignment_id),
        student_id: trim(row.student_id),
        marks: toNumber(row.marks),
      }),
    },
  ];

  for (const task of tasks) {
    await maybeClear(task.model);
    console.log(`Seeding ${task.model.collection.name} from ${task.fileName}...`);
    const result = await seedCsv(task);
    console.log(
      `Seeded ${task.model.collection.name}: ${result.inserted} inserted (${result.processed} processed).`,
    );
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  mongoose.disconnect().finally(() => {
    process.exit(1);
  });
});
