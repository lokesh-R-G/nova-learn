import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createPayment } from "../controllers/feesController.js";

const router = express.Router();

router.use(requireAuth);
router.post("/", requireRole(["admin", "accounts"]), asyncHandler(createPayment));

export default router;
