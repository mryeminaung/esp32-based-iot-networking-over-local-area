import { prisma } from "../config/db.js";
import { hashPassword } from "../utils/bcrypt.js";
import { ROLE_LIST } from "../config/permissions.js";

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
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
