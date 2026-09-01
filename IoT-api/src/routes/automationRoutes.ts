import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createRuleSchema, updateRuleSchema } from "../validations/automationSchema.js";
import {
  listRulesHandler,
  getRuleHandler,
  createRuleHandler,
  updateRuleHandler,
  deleteRuleHandler,
} from "../controllers/automationController.js";

const router = Router();

router.use(authenticate, authorize("automation:configure"));

router.get("/rules", listRulesHandler);
router.get("/rules/:id", getRuleHandler);
router.post("/rules", validate(createRuleSchema), createRuleHandler);
router.patch("/rules/:id", validate(updateRuleSchema), updateRuleHandler);
router.delete("/rules/:id", deleteRuleHandler);

export default router;
