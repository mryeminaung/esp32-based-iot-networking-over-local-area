import {
	loginUser,
	logoutUser,
	refreshAccessToken,
} from "../services/auth.service.js";

const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/api/auth",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const login = async (req, res) => {
	try {
		const { user, accessToken, refreshToken } = await loginUser(req.body);

		res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
		res.status(200).json({
			success: true,
			message: "Login successful",
			data: { user, accessToken },
		});
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({
			success: false,
			message: error.message || "Login failed",
		});
	}
};

export const logout = async (req, res) => {
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
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Logout failed",
		});
	}
};

export const getCurrentUser = async (req, res) => {
	res.status(200).json({
		success: true,
		data: { user: req.user },
	});
};

export const refreshToken = async (req, res) => {
	try {
		const token = req.cookies?.refreshToken;
		const { accessToken, refreshToken: newRefreshToken } =
			await refreshAccessToken(token);

		res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
		res.status(200).json({
			success: true,
			data: { accessToken },
		});
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({
			success: false,
			message: error.message || "Token refresh failed",
		});
	}
};
