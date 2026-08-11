import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validations/auth.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getCurrentUser);

export default router;
