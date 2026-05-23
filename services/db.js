import mongoose from "mongoose";

export async function connectDatabase({ mongoUri, dbName }) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, { dbName });
  return mongoose.connection;
}
