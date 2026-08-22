import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  recordReadingHandler,
  getReadingsHandler,
  getAnalyticsHandler,
  getLatestReadingHandler,
} from "../controllers/sensor.controller.js";

const router = Router();

router.use(authenticate);

router.post("/readings", recordReadingHandler);
router.get("/readings", getReadingsHandler);
router.get("/analytics", getAnalyticsHandler);
router.get("/latest", getLatestReadingHandler);

export default router;
