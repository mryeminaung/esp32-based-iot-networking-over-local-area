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
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, updateUserSchema, updateRoleSchema, resetPasswordSchema } from "../validations/user.schema.js";

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

const router = Router();

// ── Profile routes (any authenticated user) ──
router.patch("/me", authenticate, updateProfileHandler);
router.patch("/me/password", authenticate, changePasswordHandler);
router.post("/me/avatar", authenticate, upload.single("image"), uploadAvatarHandler);

// ── Admin routes (Farm Manager only) ──
router.use(authenticate, authorize("users:manage"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", validate(createUserSchema), createUserHandler);
router.patch("/:id/role", validate(updateRoleSchema), changeUserRole);
router.patch("/:id/password", validate(resetPasswordSchema), resetPasswordHandler);
router.patch("/:id", validate(updateUserSchema), updateUserHandler);
router.delete("/:id", removeUser);

export default router;
