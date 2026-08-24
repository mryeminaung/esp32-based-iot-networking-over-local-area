import { prisma } from "../config/db.js";

export const createActivityLog = async (userId, device, action, value = null) => {
  return prisma.activityLog.create({
    data: {
      userId: userId || null,
      device,
      action,
      value,
    },
  });
};

export const getActivityLogs = async (filters = {}, requestingUser = null) => {
  const { userId, action, device, startDate, endDate, page = 1, limit = 20 } = filters;

  const where = {};

  // RBAC: Non-managers can only see their own logs
  if (requestingUser && requestingUser.role !== "farm_manager") {
    where.userId = requestingUser.id;
  } else if (userId) {
    where.userId = parseInt(userId, 10);
  }

  if (action) where.action = action;
  if (device) where.device = device;

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page: parseInt(page, 10),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};
