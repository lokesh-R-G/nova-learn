import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createTimetable, getTimetable } from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", asyncHandler(getTimetable));
router.post("/", asyncHandler(createTimetable));

export default router;