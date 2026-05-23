import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getFeesByStudent } from "../controllers/feesController.js";

const router = express.Router();

router.use(requireAuth);
router.get("/:studentId", requireRole(["admin", "accounts", "student", "parent"]), asyncHandler(getFeesByStudent));

export default router;
