import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createPayment } from "../controllers/feesController.js";

const router = express.Router();

router.post("/", asyncHandler(createPayment));

export default router;

