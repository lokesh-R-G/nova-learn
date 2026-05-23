import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getStudentById, getStudents, getStudentsByClass } from "../controllers/studentController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requireRole(["admin", "teacher", "accounts"]), asyncHandler(getStudents));
router.get("/class/:classId", requireRole(["admin", "teacher", "accounts"]), asyncHandler(getStudentsByClass));
router.get("/:id", requireRole(["admin", "teacher", "student", "parent", "accounts"]), asyncHandler(getStudentById));

export default router;
