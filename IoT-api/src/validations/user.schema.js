import { z } from "zod";
import { ROLE_LIST } from "../config/permissions.js";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  role: z.enum(ROLE_LIST).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(ROLE_LIST, {
    message: `Invalid role. Allowed: ${ROLE_LIST.join(", ")}`,
  }),
});
