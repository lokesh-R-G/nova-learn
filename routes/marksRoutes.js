import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createMarks, getMarksByStudent } from "../controllers/marksController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/:studentId", requireRole(["admin", "teacher", "student", "parent"]), asyncHandler(getMarksByStudent));
router.post("/", requireRole(["admin", "teacher"]), asyncHandler(createMarks));

export default router;
