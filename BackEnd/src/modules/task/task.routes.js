import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "./task.controller.js";

const router = express.Router();

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export { router };
