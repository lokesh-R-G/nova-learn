import dotenv from "dotenv";
import { getServerEnv } from "../services/env.js";
import { connectDatabase } from "../services/db.js";
import { createApp } from "./app.js";

dotenv.config();

const config = getServerEnv(process.env);
const app = createApp();

async function start() {
  try {
    const connection = await connectDatabase({
      mongoUri: config.mongoUri,
      dbName: config.dbName,
    });
    console.log("MongoDB connection established.");
    console.log(`Database: ${connection.name}`);

    app.listen(config.port, () => {
      console.log(`API server running on port ${config.port} (${config.nodeEnv}).`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error);
    process.exit(1);
  }
}

start();
