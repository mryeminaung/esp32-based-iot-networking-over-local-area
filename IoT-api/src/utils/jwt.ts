import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

interface TokenPayload {
  id: number;
  email?: string;
  role?: string;
}

export const generateAccessToken = (user: TokenPayload) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
};

export const generateRefreshToken = (user: TokenPayload) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};

export const getRefreshTokenExpiry = () => {
  const days = parseInt(REFRESH_EXPIRES) || 7;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};
