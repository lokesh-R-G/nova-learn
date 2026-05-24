import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getTimetable } from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", asyncHandler(getTimetable));

export default router;