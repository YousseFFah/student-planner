import express from "express";
import { getProgress } from "./progress.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProgress);

export { router };