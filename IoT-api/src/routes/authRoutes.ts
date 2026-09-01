import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  refreshToken,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { loginSchema } from "../validations/authSchema.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getCurrentUser);

export default router;
