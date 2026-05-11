import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import sequelize from "../DB/Db.js";
import initModels from "../models/init.model.js";

const signAccessToken = (user) =>
  jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { user_id: user.user_id, jti: randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

const persistRefreshToken = async (RefreshToken, token, user_id) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ token, user_id, expires_at: expiresAt });
};

const sendAuthResponse = async (res, user, statusCode, message, RefreshToken) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await persistRefreshToken(RefreshToken, refreshToken, user.user_id);

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return res.status(statusCode).json({
    message,
    accessToken,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

export const signup = async (req, res) => {
  const { User, RefreshToken } = initModels(sequelize);
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ username, email, password, role });
    return sendAuthResponse(res, user, 201, "Account created successfully", RefreshToken);
  } catch (error) {
    res.status(500).json({ message: "Error creating account", error: error.message });
  }
};

export const login = async (req, res) => {
  const { User, RefreshToken } = initModels(sequelize);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return sendAuthResponse(res, user, 200, "Login successful", RefreshToken);
  } catch (error) {
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

export const refresh = async (req, res) => {
  const { User, RefreshToken } = initModels(sequelize);
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const stored = await RefreshToken.findOne({ where: { token } });
    if (!stored) {
      return res.status(401).json({ message: "Refresh token has been revoked" });
    }

    if (new Date() > new Date(stored.expires_at)) {
      await stored.destroy();
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const user = await User.findByPk(payload.user_id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    await stored.destroy();
    return sendAuthResponse(res, user, 200, "Token refreshed", RefreshToken);
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error: error.message });
  }
};

export const logout = async (req, res) => {
  const { RefreshToken } = initModels(sequelize);
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await RefreshToken.destroy({ where: { token } });
    }

    res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error: error.message });
  }
};

export const getMe = async (req, res) => {
  const { User } = initModels(sequelize);
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
