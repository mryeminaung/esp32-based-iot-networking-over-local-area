import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { controlDeviceSchema } from "../validations/device.schema.js";
import {
  getDeviceStateHandler,
  controlDeviceHandler,
} from "../controllers/device.controller.js";

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
