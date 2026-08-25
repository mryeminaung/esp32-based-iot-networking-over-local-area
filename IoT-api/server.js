import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";
import sensorRoutes from "./src/routes/sensor.routes.js";
import automationRoutes from "./src/routes/automation.routes.js";
import deviceRoutes from "./src/routes/device.routes.js";
import { startCollector } from "./src/services/collector.service.js";

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
app.use("/api/automation", automationRoutes);
app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => {
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
