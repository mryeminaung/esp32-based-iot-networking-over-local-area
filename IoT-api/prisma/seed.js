import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { ROLES } from "../src/config/permissions.js";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
	console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
	process.exit(1);
}

async function main() {
	console.log("Seeding database...");

	// Create Farm Manager (admin)
	const existing = await prisma.user.findUnique({
		where: { email: ADMIN_EMAIL },
	});

	if (existing) {
		console.log(`Farm Manager already exists: ${ADMIN_EMAIL}`);
	} else {
		const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
		const admin = await prisma.user.create({
			data: {
				email: ADMIN_EMAIL,
				name: "Farm Manager",
				password: hashed,
				role: ROLES.FARM_MANAGER,
			},
		});
		console.log(`Farm Manager created: ${admin.email} (role: ${admin.role})`);
	}

	console.log("Seed completed!");
}

main()
	.catch((e) => {
		console.error("Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
