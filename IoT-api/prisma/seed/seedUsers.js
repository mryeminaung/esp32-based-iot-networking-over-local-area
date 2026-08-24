import bcrypt from "bcryptjs";
import "dotenv/config";
import { ROLES } from "../../src/config/permissions.js";

const USERS = [
  {
    email: process.env.ADMIN_EMAIL || "admin@farm.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: "Farm Manager",
    role: ROLES.FARM_MANAGER,
  },
  {
    email: "worker@farm.com",
    password: "worker123",
    name: "Farm Worker",
    role: ROLES.FARM_WORKER,
  },
  {
    email: "technician@farm.com",
    password: "tech123",
    name: "Technician",
    role: ROLES.TECHNICIAN,
  },
];

async function seedUsers(prisma) {
  console.log("Seeding users...");

  for (const userData of USERS) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existing) {
      console.log(`  User already exists: ${userData.email}`);
    } else {
      const hashed = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashed,
          role: userData.role,
        },
      });
      console.log(`  Created: ${user.email} (role: ${user.role})`);
    }
  }
}

export default seedUsers;
