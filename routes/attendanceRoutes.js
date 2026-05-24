import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createAttendance, getAttendanceByClass, getAttendanceByStudent } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getAttendanceByStudent));
router.get("/class/:classId", asyncHandler(getAttendanceByClass));
router.post("/", asyncHandler(createAttendance));

export default router;

