import "dotenv/config";

// Realistic sensor value ranges for a greenhouse
const RANGES = {
	temperature: { base: 26, variance: 4, dailySwing: 3 }, // 22-30°C
	humidity: { base: 65, variance: 10, dailySwing: 8 }, // 55-75%
	soilMoisture: { base: 45, variance: 12, dailySwing: 5 }, // 30-60%
	light: { base: 500, variance: 200, dailySwing: 150 }, // 150-850 lux
	airQuality: { base: 40, variance: 15, dailySwing: 5 }, // 25-60 AQI
	waterLevel: { base: 60, variance: 10, dailySwing: 8 }, // 45-75%
};

function generateValue(field: keyof typeof RANGES, hourOfDay: number) {
	const r = RANGES[field];
	// Daily sine wave (peaks at noon, dips at night)
	const dailyOffset =
		Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2) * r.dailySwing;
	// Random noise
	const noise = (Math.random() - 0.5) * r.variance;
	const value = r.base + dailyOffset + noise;
	return Math.round(value * 100) / 100;
}

function generateReadings() {
	const readings = [];
	const now = new Date();
	const startDate = new Date(now);
	startDate.setDate(startDate.getDate() - 7);

	// Generate one reading per minute for 7 days
	const totalMinutes = 7 * 24 * 60;
	let current = new Date(startDate);

	for (let i = 0; i < totalMinutes; i++) {
		const hour = current.getHours() + current.getMinutes() / 60;

		readings.push({
			deviceId: 1,
			temperature: generateValue("temperature", hour),
			humidity: generateValue("humidity", hour),
			soilMoisture: generateValue("soilMoisture", hour),
			light: generateValue("light", hour),
			airQuality: generateValue("airQuality", hour),
			waterLevel: generateValue("waterLevel", hour),
			createdAt: new Date(current),
		});

		current = new Date(current.getTime() + 60000); // +1 minute
	}

	return readings;
}

async function seedSensorData(prisma: { sensorReading: { deleteMany: () => Promise<unknown>; createMany: (args: { data: unknown[] }) => Promise<unknown> } }) {
	console.log("Clearing existing sensor readings...");
	await prisma.sensorReading.deleteMany();

	console.log("Generating 7 days of sensor readings (1 per minute)...");
	const readings = generateReadings();
	console.log(`Inserting ${readings.length} readings...`);

	// Batch insert in chunks of 1000
	const CHUNK = 1000;
	for (let i = 0; i < readings.length; i += CHUNK) {
		const chunk = readings.slice(i, i + CHUNK);
		await prisma.sensorReading.createMany({ data: chunk });
		process.stdout.write(
			`  ${Math.min(i + CHUNK, readings.length)}/${readings.length}\r`,
		);
	}

	console.log(`\nDone! Inserted ${readings.length} sensor readings.`);
}

export default seedSensorData;
