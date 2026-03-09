import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (user) =>
  jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

export const signup = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if (!username?.trim() || !password?.trim()) {
    throw new ApiError(400, "Username and password are required");
  }

  const existedUser = await User.findOne({ username: username.trim() });
  if (existedUser) {
    throw new ApiError(409, "Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: username.trim(),
    passwordHash,
    role: role === "admin" ? "admin" : "user",
  });

  const token = signToken(user);

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username: username.trim() });
  if (!user) {
    throw new ApiError(401, "Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid username or password");
  }

  const token = signToken(user);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user",
    data: req.user,
  });
});