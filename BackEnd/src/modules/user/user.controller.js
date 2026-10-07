import bcrypt from "bcryptjs";
import { User } from "../../../db/models/user.model.js";
import AppError from "../../utilities/appError.js";
import crypto from "crypto";
import sendEmail from "../../utilities/sendEmail.js";
import jwt from "jsonwebtoken";

// User register
const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationTokenExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
  });

  const verificationUrl = `http://127.0.0.1:5500/frontend/verify-email.html?token=${verificationToken}`;

  await sendEmail(
    email,
    "Verify your Student Planner account",
    `
      <h2>Welcome to Student Planner!</h2>

      <p>
        Thanks for creating your Student Planner account.
      </p>

      <p>
        Please click the button below to verify your email address.
      </p>

      <p>
        <a href="${verificationUrl}">
          Verify Email
        </a>
      </p>

      <p>
        This verification link will expire in 24 hours.
      </p>
    `
  );

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
    },
  });
};

// Email verification
const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  const existingUser = await User.findOne({
    verificationToken: token,
  });

  if (!existingUser) {
    return next(new AppError("Invalid verification token", 400));
  }

  if (
    !existingUser.verificationTokenExpires ||
    existingUser.verificationTokenExpires < new Date()
  ) {
    return next(new AppError("Verification token expired", 400));
  }

  existingUser.isVerified = true;
  existingUser.verificationToken = undefined;
  existingUser.verificationTokenExpires = undefined;

  await existingUser.save();

  res.status(200).json({
    message: "Email verified successfully",
  });
};

// User login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!existingUser.isVerified) {
    return next(new AppError("Please verify your email first", 403));
  }

  const token = jwt.sign(
    {
      userId: existingUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    },
  });
};

// Current user
const getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user.userId).select(
    "-password -verificationToken -verificationTokenExpires"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    message: "User fetched successfully",
    user,
  });
};

export {
  register,
  verifyEmail,
  login,
  getCurrentUser,
};