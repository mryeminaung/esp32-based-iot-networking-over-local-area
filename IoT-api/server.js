import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB, { prisma } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", async (req, res) => {
	const users = await prisma.user.findMany({
		select: { id: true, email: true, name: true, role: true, createdAt: true },
	});
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
