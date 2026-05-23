import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createAssignment, getAssignmentsByClass } from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/:classId", asyncHandler(getAssignmentsByClass));
router.post("/", asyncHandler(createAssignment));

export default router;

