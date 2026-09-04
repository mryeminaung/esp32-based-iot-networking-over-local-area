import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";
import sensorRoutes from "./src/routes/sensorRoutes.js";
import deviceRoutes from "./src/routes/deviceRoutes.js";
import deviceSettingsRoutes from "./src/routes/deviceSettingsRoutes.js";
import { startCollector } from "./src/services/collectorService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/device-settings", deviceSettingsRoutes);

app.get("/", (req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Smart Agriculture API is running",
	});
});

const PORT = process.env.PORT || 5000;

const start = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`Smart Agriculture API is running on http://localhost:${PORT}`);
		startCollector();
	});
};

start();
