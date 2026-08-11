import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/db.js";
import { hasPermission } from "../config/permissions.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

/**
 * authorize(...permissions) — requires authenticate middleware first.
 * Checks if req.user.role has ALL of the required permissions.
 * Usage: router.get("/admin", authenticate, authorize("users:manage"), handler)
 */
export const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const missing = permissions.filter((p) => !hasPermission(req.user.role, p));

    if (missing.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions.",
        required: permissions,
        missing,
      });
    }

    next();
  };
};
