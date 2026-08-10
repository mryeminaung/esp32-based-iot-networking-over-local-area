import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB, { prisma } from "./src/config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
	const users = await prisma.user.findMany();
	res.json({
		success: true,
		message: "Smart Agriculture API is running",
		data: users,
	});
});

const PORT = process.env.PORT || 5000;

const start = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`Smart Agriculture API is running on http://localhost:${PORT}`);
	});
};

start();
