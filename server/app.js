import express from "express";
import cors from "cors";

import studentRoutes from "../routes/studentRoutes.js";
import teacherRoutes from "../routes/teacherRoutes.js";
import attendanceRoutes from "../routes/attendanceRoutes.js";
import marksRoutes from "../routes/marksRoutes.js";
import assignmentRoutes from "../routes/assignmentRoutes.js";
import feesRoutes from "../routes/feesRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";
import { requestLogger } from "../middlewares/requestLogger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/students", studentRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/marks", marksRoutes);
  app.use("/api/assignments", assignmentRoutes);
  app.use("/api/fees", feesRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(errorHandler);

  return app;
}

