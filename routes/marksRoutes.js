import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createMarks, getMarksByStudent } from "../controllers/marksController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getMarksByStudent));
router.post("/", asyncHandler(createMarks));

export default router;

