import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import seedSensorData from "./seedSensorData";
import seedUsers from "./seedUsers";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function seed() {
	console.log("Starting database seeding...\n");

	try {
		// Seed users (farm manager, farm worker, technician)
		await seedUsers(prisma);
		console.log("");

		// Seed sensor data
		await seedSensorData(prisma);

		console.log("\nAll seeding completed successfully!");
	} catch (error) {
		console.error("Seeding failed:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
