import bcrypt from "bcryptjs";
import "dotenv";
import { ROLES } from "../../src/config/permissions.ts";

const USERS = [
	{
		email: "admin@farm.com",
		password: "Admin@!23456",
		name: "Farm Manager",
		role: ROLES.FARM_MANAGER,
	},
	{
		email: "worker@farm.com",
		password: "Worker@!23456",
		name: "Farm Worker",
		role: ROLES.FARM_WORKER,
	},
	{
		email: "technician@farm.com",
		password: "Tech@!23456",
		name: "Technician",
		role: ROLES.TECHNICIAN,
	},
];

async function seedUsers(prisma: any) {
	console.log("Seeding users...");

	for (const userData of USERS) {
		const existing = await prisma.user.findUnique({
			where: { email: userData.email },
		});

		if (existing) {
			console.log(`User already exists: ${userData.email}`);
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
