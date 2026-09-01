import type { Request, Response } from "express";
import {
	loginUser,
	logoutUser,
	refreshAccessToken,
} from "../services/authService.js";

const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/api/auth",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const login = async (req: Request, res: Response) => {
	try {
		const { user, accessToken, refreshToken } = await loginUser(req.body);

		res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
		res.status(200).json({
			success: true,
			message: "Login successful",
			data: { user, accessToken },
		});
	} catch {
		res.status(500).json({
			success: false,
			message: "Login failed",
		});
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies?.refreshToken;
		await logoutUser(refreshToken);

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/api/auth",
		});

		res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch {
		res.status(500).json({
			success: false,
			message: "Logout failed",
		});
	}
};

export const getCurrentUser = async (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		data: { user: req.user },
	});
};

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const token = req.cookies?.refreshToken;
		const { accessToken, refreshToken: newRefreshToken } =
			await refreshAccessToken(token);

		res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
		res.status(200).json({
			success: true,
			data: { accessToken },
		});
	} catch {
		res.status(500).json({
			success: false,
			message: "Token refresh failed",
		});
	}
};
