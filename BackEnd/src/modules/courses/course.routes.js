import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";

import {
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createCourse);

router.get("/", authMiddleware, getCourses);

router.get("/:code", authMiddleware, getCourse);

router.patch("/:code", authMiddleware, updateCourse);

router.delete("/:code", authMiddleware, deleteCourse);

export { router };