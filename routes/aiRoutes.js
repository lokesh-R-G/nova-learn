import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { chat } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", asyncHandler(chat));

export default router;

