import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getClassAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/class/:classId", asyncHandler(getClassAnalytics));

export default router;