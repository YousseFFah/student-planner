import express from "express";

import {
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";

const router = express.Router();

router.post("/", createCourse);

router.get("/", getCourses);

router.get("/:code", getCourse);

router.patch("/:code", updateCourse);

router.delete("/:code", deleteCourse);

export { router };