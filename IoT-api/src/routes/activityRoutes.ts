import { Router } from "express";
import { createLogHandler, getLogsHandler } from "../controllers/activityController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router: ReturnType<typeof Router> = Router();

// All activity routes require authentication
router.use(authenticate);

router.post("/", authorize("activity:write"), createLogHandler);
router.get("/", getLogsHandler);

export default router;
