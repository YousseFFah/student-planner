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
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your Student Planner account</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #07111f;
      font-family: Arial, Helvetica, sans-serif;
      color: #edf3ff;
    ">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          background-color: #07111f;
          padding: 40px 20px;
        "
      >
        <tr>
          <td align="center">

            <!-- Main Card -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 560px;
                background-color: #0e1d32;
                border: 1px solid #263a55;
                border-radius: 18px;
                overflow: hidden;
              "
            >

              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="
                    padding: 34px 30px 24px;
                    border-bottom: 1px solid #1d3048;
                  "
                >

                  <!-- Logo -->
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                  >
                    <tr>
                      <td
                        align="center"
                        style="
                          width: 48px;
                          height: 48px;
                          background-color: #3f73ff;
                          border-radius: 13px;
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: bold;
                        "
                      >
                        SP
                      </td>
                    </tr>
                  </table>

                  <div style="
                    margin-top: 12px;
                    color: #edf3ff;
                    font-size: 16px;
                    font-weight: bold;
                  ">
                    Student Planner
                  </div>

                  <div style="
                    margin-top: 4px;
                    color: #657893;
                    font-size: 11px;
                  ">
                    Stay on track
                  </div>

                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td
                  style="
                    padding: 38px 34px;
                  "
                >

                  <div style="
                    color: #6e9fff;
                    font-size: 11px;
                    font-weight: bold;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                  ">
                    Email Verification
                  </div>

                  <h1 style="
                    margin: 0;
                    color: #f5f7ff;
                    font-size: 27px;
                    line-height: 1.3;
                    font-weight: 700;
                  ">
                    Welcome to Student Planner!
                  </h1>

                  <p style="
                    margin: 16px 0 0;
                    color: #9aaac0;
                    font-size: 14px;
                    line-height: 1.7;
                  ">
                    Thanks for creating your Student Planner account.
                    We're excited to help you stay organized and on track.
                  </p>

                  <p style="
                    margin: 18px 0 0;
                    color: #9aaac0;
                    font-size: 14px;
                    line-height: 1.7;
                  ">
                    Please verify your email address to activate your
                    account and start using Student Planner.
                  </p>

                  <!-- Button -->
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      margin: 30px auto;
                    "
                  >
                    <tr>
                      <td
                        align="center"
                        style="
                          background-color: #3f73ff;
                          border-radius: 10px;
                        "
                      >
                        <a
                          href="${verificationUrl}"
                          style="
                            display: inline-block;
                            padding: 14px 28px;
                            color: #ffffff;
                            text-decoration: none;
                            font-size: 14px;
                            font-weight: bold;
                          "
                        >
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiration -->
                  <div style="
                    padding: 14px 16px;
                    background-color: #09182b;
                    border: 1px solid #1f344f;
                    border-radius: 10px;
                    color: #71839d;
                    font-size: 12px;
                    line-height: 1.6;
                  ">
                    <strong style="color: #9aabc2;">
                      Important:
                    </strong>
                    This verification link will expire in 24 hours.
                  </div>

                  <p style="
                    margin: 24px 0 0;
                    color: #52657f;
                    font-size: 11px;
                    line-height: 1.6;
                  ">
                    If you didn't create a Student Planner account,
                    you can safely ignore this email.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    padding: 20px 30px;
                    border-top: 1px solid #1d3048;
                    background-color: #09182b;
                  "
                >

                  <div style="
                    color: #657893;
                    font-size: 11px;
                  ">
                    Student Planner
                  </div>

                  <div style="
                    margin-top: 5px;
                    color: #465b76;
                    font-size: 10px;
                  ">
                    Stay organized. Stay on track.
                  </div>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
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