import { Assessment } from "../../../db/models/assessment.model.js";
import { Course } from "../../../db/models/course.model.js";
import AppError from "../../utilities/appError.js";

// add new course
const createAssessment = async (req, res, next) => {
  const { title, type, totalMarks, deadline, course } = req.body;

  const userId = req.user.userId;

  const existingCourse = await Course.findOne({
    _id: course,
    user: req.user.userId,
  });

  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  const newAssessment = await Assessment.create({
    title,
    type,
    totalMarks,
    deadline,
    course,
    user: userId,
  });

  res.status(201).json({
    message: "Assessment created successfully",
    assessment: newAssessment,
  });
};

// get one assessment
const getAssessment = async (req, res, next) => {
  const existingAssessment = await Assessment.findOne({
    _id: req.params.id,
    user: req.user.userId,
  }).populate("course");

  if (!existingAssessment) {
    return next(new AppError("Assessment not found", 404));
  }

  res.status(200).json({
    message: "Assessment fetched successfully",
    assessment: existingAssessment,
  });
};

// get all assessment
const getAssessments = async (req, res) => {
  const assessments = await Assessment.find({
    user: req.user.userId,
  }).populate("course");

  res.status(200).json({
    message: "Assessments fetched successfully",
    assessments,
  });
};

// update assessment
const updateAssessment = async (req, res, next) => {
  const existingAssessment = await Assessment.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!existingAssessment) {
    return next(new AppError("Assessment not found", 404));
  }

  const { title, type, totalMarks, obtainedMarks, deadline, status } = req.body;

  if (title !== undefined) {
    existingAssessment.title = title;
  }

  if (type !== undefined) {
    existingAssessment.type = type;
  }

  if (totalMarks !== undefined) {
    existingAssessment.totalMarks = totalMarks;
  }

  if (obtainedMarks !== undefined) {
    existingAssessment.obtainedMarks = obtainedMarks;
  }

  if (deadline !== undefined) {
    existingAssessment.deadline = deadline;
  }

  if (status !== undefined) {
    existingAssessment.status = status;
  }

  await existingAssessment.save();

  await existingAssessment.populate("course");

  res.status(200).json({
    message: "Assessment updated successfully",
    assessment: existingAssessment,
  });
};

// delete assessment
const deleteAssessment = async (req, res, next) => {
  const existingAssessment = await Assessment.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!existingAssessment) {
    return next(new AppError("Assessment not found", 404));
  }

  await Assessment.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  res.status(200).json({
    message: "Assessment deleted successfully",
  });
};

export {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
};
