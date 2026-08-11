import { prisma } from "../config/db.js";
import { hashPassword } from "../utils/bcrypt.js";
import { ROLE_LIST } from "../config/permissions.js";

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: SAFE_USER_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SAFE_USER_SELECT,
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};

export const createUser = async ({ email, name, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 409, message: "Email already registered" };
  }

  if (role && !ROLE_LIST.includes(role)) {
    throw { status: 400, message: `Invalid role. Allowed: ${ROLE_LIST.join(", ")}` };
  }

  const hashed = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: role || "farm_worker",
    },
    select: SAFE_USER_SELECT,
  });
};

export const updateUser = async (id, { name, email, role }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw { status: 409, message: "Email already registered" };
    }
  }

  if (role && !ROLE_LIST.includes(role)) {
    throw { status: 400, message: `Invalid role. Allowed: ${ROLE_LIST.join(", ")}` };
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;

  return prisma.user.update({
    where: { id },
    data,
    select: SAFE_USER_SELECT,
  });
};

export const updateUserRole = async (id, newRole) => {
  if (!ROLE_LIST.includes(newRole)) {
    throw { status: 400, message: `Invalid role. Allowed: ${ROLE_LIST.join(", ")}` };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return prisma.user.update({
    where: { id },
    data: { role: newRole },
    select: SAFE_USER_SELECT,
  });
};

export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  await prisma.user.delete({ where: { id } });
  return { message: "User deleted successfully" };
};

export const updateProfile = async (id, { name }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return prisma.user.update({
    where: { id },
    data: { name },
    select: SAFE_USER_SELECT,
  });
};

export const changePassword = async (id, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const { comparePassword } = await import("../utils/bcrypt.js");
  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    throw { status: 401, message: "Current password is incorrect" };
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id },
    data: { password: hashed },
  });

  return { message: "Password updated successfully" };
};

export const resetPassword = async (id, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id },
    data: { password: hashed },
  });

  return { message: "Password reset successfully" };
};

export const uploadAvatar = async (id, file) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const imageUrl = `/uploads/avatars/${file.filename}`;

  return prisma.user.update({
    where: { id },
    data: { image: imageUrl },
    select: SAFE_USER_SELECT,
  });
};
