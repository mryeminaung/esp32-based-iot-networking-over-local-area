import { z } from "zod";
import { ROLE_LIST } from "../config/permissions.js";

const farmEmailRegex = /^[a-zA-Z0-9._%+-]+@farm\.com$/;

export const createUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(farmEmailRegex, "Email must be a @farm.com address"),
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

export const updateUserSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty").max(100).optional(),
    email: z
      .string()
      .email("Invalid email address")
      .regex(farmEmailRegex, "Email must be a @farm.com address")
      .optional(),
    role: z.enum(ROLE_LIST).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});
