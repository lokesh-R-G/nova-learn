import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getFeesByStudent } from "../controllers/feesController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getFeesByStudent));

export default router;

