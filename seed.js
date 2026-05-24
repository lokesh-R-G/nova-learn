import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import csvParser from "csv-parser";
import { connectDatabase } from "./services/db.js";
import { Class } from "./models/Class.js";
import { Teacher } from "./models/Teacher.js";
import { Student } from "./models/Student.js";
import { Parent } from "./models/Parent.js";
import { Mapping } from "./models/Mapping.js";
import { Attendance } from "./models/Attendance.js";
import { Marks } from "./models/Marks.js";
import { Fees } from "./models/Fees.js";
import { Payment } from "./models/Payment.js";
import { Assignment } from "./models/Assignment.js";
import { Submission } from "./models/Submission.js";

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
    const connection = await connectDatabase({
      mongoUri: MONGODB_URI,
      dbName: DB_NAME,
    });
    console.log("MongoDB connection established.");
    console.log(`Connected database: ${connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error);
    throw error;
  }

  const seedSpecs = {
    classes_full: {
      model: Class,
      mapRow: (row) => ({
        class_id: trim(row.class_id),
        grade: toNumber(row.grade),
        section: trim(row.section),
      }),
    },
    teachers_full: {
      model: Teacher,
      mapRow: (row) => ({
        teacher_id: trim(row.teacher_id),
        name: trim(row.name),
        subject: trim(row.subject),
      }),
    },
    students_full: {
      model: Student,
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        class_id: trim(row.class_id),
        name: trim(row.name),
      }),
    },
    parents_full: {
      model: Parent,
      mapRow: (row) => ({
        parent_id: trim(row.parent_id),
        student_id: trim(row.student_id),
        name: trim(row.name),
      }),
    },
    mapping_full: {
      model: Mapping,
      mapRow: (row) => ({
        class_id: trim(row.class_id),
        subject: trim(row.subject),
        teacher_id: trim(row.teacher_id),
      }),
    },
    attendance_full: {
      model: Attendance,
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        class_id: trim(row.class_id),
        date: toDate(row.date),
        status: trim(row.status),
      }),
    },
    marks_full: {
      model: Marks,
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        subject: trim(row.subject),
        exam: trim(row.exam),
        marks: toNumber(row.marks),
        max_marks: toNumber(row.max_marks),
      }),
    },
    fees_full: {
      model: Fees,
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        total_fee: toNumber(row.total_fee),
        paid: toNumber(row.paid),
        balance: toNumber(row.balance),
      }),
    },
    payments_full: {
      model: Payment,
      mapRow: (row) => ({
        student_id: trim(row.student_id),
        amount: toNumber(row.amount),
        method: trim(row.method),
        date: toDate(row.date),
      }),
    },
    assignments_full: {
      model: Assignment,
      mapRow: (row) => ({
        assignment_id: trim(row.assignment_id),
        class_id: trim(row.class_id),
        subject: trim(row.subject),
        title: trim(row.title),
      }),
    },
    submissions_full: {
      model: Submission,
      mapRow: (row) => ({
        assignment_id: trim(row.assignment_id),
        student_id: trim(row.student_id),
        marks: toNumber(row.marks),
      }),
    },
  };

  const csvFiles = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.toLowerCase().endsWith(".csv"))
    .sort((left, right) => left.localeCompare(right));

  const summary = {
    discovered: csvFiles.length,
    seeded: 0,
    skipped: 0,
    inserted: 0,
    processed: 0,
  };

  for (const fileName of csvFiles) {
    const fileKey = path.parse(fileName).name;
    const spec = seedSpecs[fileKey];

    if (!spec) {
      summary.skipped += 1;
      console.log(`Skipping ${fileName}: no seed mapping defined.`);
      continue;
    }

    await maybeClear(spec.model);
    console.log(`Seeding ${spec.model.collection.name} from ${fileName}...`);
    const result = await seedCsv({ model: spec.model, fileName, mapRow: spec.mapRow });
    summary.seeded += 1;
    summary.inserted += result.inserted;
    summary.processed += result.processed;
    console.log(`Seeded ${spec.model.collection.name}: ${result.inserted} inserted (${result.processed} processed).`);
  }

  console.log(
    `Seeding complete: ${summary.seeded}/${summary.discovered} files seeded, ${summary.skipped} skipped, ${summary.inserted} inserted from ${summary.processed} rows.`,
  );

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  mongoose.disconnect().finally(() => {
    process.exit(1);
  });
});
