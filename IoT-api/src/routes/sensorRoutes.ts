import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  recordReadingHandler,
  getReadingsHandler,
  getAnalyticsHandler,
  getLatestReadingHandler,
} from "../controllers/sensorController.js";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate);

router.post("/readings", recordReadingHandler);
router.get("/readings", getReadingsHandler);
router.get("/analytics", getAnalyticsHandler);
router.get("/latest", getLatestReadingHandler);

export default router;
