import express from "express";
import { createAssessment, getAssessments, getAssessment, updateAssessment, deleteAssessment } from "./assessment.controller.js";

const router = express.Router();

router.post("/", createAssessment);

router.get("/", getAssessments);

router.get("/:id", getAssessment);

router.patch("/:id", updateAssessment);

router.delete("/:id", deleteAssessment);

export { router };