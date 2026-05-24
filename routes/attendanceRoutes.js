import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
	createAttendance,
	getAttendanceByClass,
	getAttendanceByStudent,
	getAttendanceSummaryByStudent,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/class/:classId", asyncHandler(getAttendanceByClass));
router.get("/student/:studentId/summary", asyncHandler(getAttendanceSummaryByStudent));
router.get("/:studentId", asyncHandler(getAttendanceByStudent));
router.post("/", asyncHandler(createAttendance));

export default router;

