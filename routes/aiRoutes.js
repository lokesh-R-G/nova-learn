import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { chat } from "../controllers/aiController.js";

const router = express.Router();

router.use(requireAuth);
router.post("/chat", requireRole(["student", "teacher", "admin"]), asyncHandler(chat));

export default router;
