import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { updateDeviceSettingsSchema } from "../validations/deviceSettingsSchema.js";
import {
  getSettingsHandler,
  updateSettingsHandler,
} from "../controllers/deviceSettingsController.js";

const router = Router();

router.use(authenticate);

router.get("/", getSettingsHandler);
router.put(
  "/",
  authorize("devices:control"),
  validate(updateDeviceSettingsSchema),
  updateSettingsHandler,
);

export default router;
