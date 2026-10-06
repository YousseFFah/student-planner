import express from "express";
import { getDashboard } from "./dashboard.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboard);

export { router };