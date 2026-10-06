import express from "express";
import { register, verifyEmail, login, getCurrentUser } from "./user.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", login);

router.get("/me", authMiddleware, getCurrentUser);

export { router };