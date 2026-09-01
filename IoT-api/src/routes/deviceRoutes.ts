import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { controlDeviceSchema } from "../validations/deviceSchema.js";
import {
  getDeviceStateHandler,
  controlDeviceHandler,
} from "../controllers/deviceController.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("devices:read"), getDeviceStateHandler);
router.post(
  "/control",
  authorize("devices:control"),
  validate(controlDeviceSchema),
  controlDeviceHandler,
);

export default router;
