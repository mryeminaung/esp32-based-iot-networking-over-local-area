import { AppError } from "../utils/appError.js";
import { prisma } from "../config/db.js";
import { comparePassword } from "../utils/bcrypt.js";
import {
	generateAccessToken,
	generateRefreshToken,
	getRefreshTokenExpiry,
	verifyRefreshToken,
} from "../utils/jwt.js";

const SAFE_USER_SELECT = {
	id: true,
	email: true,
	name: true,
	image: true,
	role: true,
	createdAt: true,
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new AppError(401, "Invalid email or password");
	}

	const valid = await comparePassword(password, user.password);
	if (!valid) {
		throw new AppError(401, "Invalid email or password");
	}

	const safeUser = await prisma.user.findUnique({
		where: { id: user.id },
		select: SAFE_USER_SELECT,
	});

	if (!safeUser) {
		throw new AppError(401, "User not found");
	}

	const accessToken = generateAccessToken(safeUser);
	const refreshToken = generateRefreshToken(safeUser);

	await prisma.refreshToken.create({
		data: {
			token: refreshToken,
			userId: safeUser.id,
			expiresAt: getRefreshTokenExpiry(),
		},
	});

	return { user: safeUser, accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string) => {
	if (!refreshToken) return;

	await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

export const refreshAccessToken = async (refreshToken: string) => {
	if (!refreshToken) {
		throw new AppError(401, "No refresh token provided");
	}

	let decoded: { id: number };
	try {
		decoded = verifyRefreshToken(refreshToken);
	} catch {
		throw new AppError(401, "Invalid or expired refresh token");
	}

	const stored = await prisma.refreshToken.findUnique({
		where: { token: refreshToken },
	});

	if (!stored) {
		throw new AppError(401, "Refresh token not found (possible reuse)");
	}

	if (new Date() > stored.expiresAt) {
		await prisma.refreshToken.delete({ where: { id: stored.id } });
		throw new AppError(401, "Refresh token expired");
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.id },
		select: SAFE_USER_SELECT,
	});

	if (!user) {
		throw new AppError(401, "User not found");
	}

	await prisma.refreshToken.delete({ where: { id: stored.id } });

	const newAccessToken = generateAccessToken(user);
	const newRefreshToken = generateRefreshToken(user);

	await prisma.refreshToken.create({
		data: {
			token: newRefreshToken,
			userId: user.id,
			expiresAt: getRefreshTokenExpiry(),
		},
	});

	return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
