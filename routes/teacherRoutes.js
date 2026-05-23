import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getTeachers } from "../controllers/teacherController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requireRole(["admin", "teacher", "accounts"]), asyncHandler(getTeachers));

export default router;
