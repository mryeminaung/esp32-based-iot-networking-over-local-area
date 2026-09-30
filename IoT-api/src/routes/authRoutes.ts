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

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticate with email and password. Returns access token and sets refresh token cookie.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@farm.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Invalidate refresh token and clear cookie.
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Use refresh token from HTTP-only cookie to get a new access token.
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     description: Returns the authenticated user's profile.
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get("/me", authenticate, getCurrentUser);

export default router;
