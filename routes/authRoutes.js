import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";
import { login, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
