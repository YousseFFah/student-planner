import express from "express";
import {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
} from "./assessment.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAssessment);

router.get("/", authMiddleware, getAssessments);

router.get("/:id", authMiddleware, getAssessment);

router.patch("/:id", authMiddleware, updateAssessment);

router.delete("/:id", authMiddleware, deleteAssessment);

export { router };
