import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  listUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  changeUserRole,
  removeUser,
  updateProfileHandler,
  changePasswordHandler,
  resetPasswordHandler,
  uploadAvatarHandler,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createUserSchema, updateUserSchema, updateRoleSchema, resetPasswordSchema } from "../validations/userSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

const router: ReturnType<typeof Router> = Router();

// ── Profile routes (any authenticated user) ──

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update own profile
 *     description: Update name or image for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Not authenticated
 */
router.patch("/me", authenticate, updateProfileHandler);

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     tags: [Users]
 *     summary: Change own password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Incorrect current password
 */
router.patch("/me/password", authenticate, changePasswordHandler);

/**
 * @swagger
 * /api/users/me/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload avatar
 *     description: Upload profile image (JPEG, PNG, GIF, WebP, max 2MB).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 *       401:
 *         description: Not authenticated
 */
router.post("/me/avatar", authenticate, upload.single("image"), uploadAvatarHandler);

// ── Admin routes (Farm Manager only) ──
router.use(authenticate, authorize("users:manage"));

/**
 * @swagger
 * /api/users/:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     description: Admin only. Returns all users with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [farm_manager, farm_worker, technician] }
 *     responses:
 *       200:
 *         description: Users list
 *       403:
 *         description: Insufficient permissions
 */
router.get("/", listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", getUser);

/**
 * @swagger
 * /api/users/:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Admin only.
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
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [farm_manager, farm_worker, technician]
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already exists
 */
router.post("/", validate(createUserSchema), createUserHandler);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Change user role
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [farm_manager, farm_worker, technician]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/:id/role", validate(updateRoleSchema), changeUserRole);

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     tags: [Users]
 *     summary: Reset user password
 *     description: Admin only. Sets a new password for the specified user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 */
router.patch("/:id/password", validate(resetPasswordSchema), resetPasswordHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch("/:id", validate(updateUserSchema), updateUserHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id", removeUser);

export default router;
