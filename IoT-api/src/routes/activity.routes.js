import { Router } from "express";
import { createLogHandler, getLogsHandler } from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All activity routes require authentication
router.use(authenticate);

router.post("/", createLogHandler);
router.get("/", getLogsHandler);

export default router;
