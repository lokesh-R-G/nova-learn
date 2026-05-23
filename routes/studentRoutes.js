import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getStudentById, getStudents, getStudentsByClass } from "../controllers/studentController.js";

const router = express.Router();

router.get("/", asyncHandler(getStudents));
router.get("/class/:classId", asyncHandler(getStudentsByClass));
router.get("/:id", asyncHandler(getStudentById));

export default router;

