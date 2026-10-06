import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "./task.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTask);

router.patch("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware,deleteTask);

export { router };
