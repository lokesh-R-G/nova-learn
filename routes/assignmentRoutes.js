import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createAssignment, getAssignmentsByClass } from "../controllers/assignmentController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/:classId", requireRole(["admin", "teacher", "student", "parent"]), asyncHandler(getAssignmentsByClass));
router.post("/", requireRole(["admin", "teacher"]), asyncHandler(createAssignment));

export default router;
