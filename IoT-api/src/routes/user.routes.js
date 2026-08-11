import { Router } from "express";
import {
  listUsers,
  getUser,
  createUserHandler,
  changeUserRole,
  removeUser,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, updateRoleSchema } from "../validations/user.schema.js";

const router = Router();

// All routes require authentication + users:manage permission (Farm Manager only)
router.use(authenticate, authorize("users:manage"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", validate(createUserSchema), createUserHandler);
router.patch("/:id/role", validate(updateRoleSchema), changeUserRole);
router.delete("/:id", removeUser);

export default router;
