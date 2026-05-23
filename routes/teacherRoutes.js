import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getTeachers } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", asyncHandler(getTeachers));

export default router;

