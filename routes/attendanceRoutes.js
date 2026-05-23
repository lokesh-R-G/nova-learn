import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createAttendance, getAttendanceByStudent } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getAttendanceByStudent));
router.post("/", asyncHandler(createAttendance));

export default router;

