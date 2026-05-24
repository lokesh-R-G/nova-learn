import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createPayment, getPayments } from "../controllers/feesController.js";

const router = express.Router();

router.get("/", asyncHandler(getPayments));
router.post("/", asyncHandler(createPayment));

export default router;

