import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createAttendance, getAttendanceByStudent } from "../controllers/attendanceController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/:studentId", requireRole(["admin", "teacher", "student", "parent"]), asyncHandler(getAttendanceByStudent));
router.post("/", requireRole(["admin", "teacher"]), asyncHandler(createAttendance));

export default router;
