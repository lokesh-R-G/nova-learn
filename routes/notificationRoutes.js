import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getNotificationsForStudent } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getNotificationsForStudent));

export default router;