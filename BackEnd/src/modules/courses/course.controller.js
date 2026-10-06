import { Course } from "../../../db/models/course.model.js";
import AppError from "../../utilities/appError.js";

// add new course
const createCourse = async (req, res, next) => {
  const { name, code, instructor, creditHours } = req.body;

  const userId = req.user.userId;

  const existingCourse = await Course.findOne({ code });

  if (existingCourse) {
    return next(new AppError("Course already exists", 400));
  }

  const newCourse = await Course.create({
    name,
    code,
    instructor,
    creditHours,
    user: userId,
  });

  res.status(201).json({
    message: "Course created successfully",
    course: newCourse,
  });
};

// get one course
const getCourse = async (req, res, next) => {
  const existingCourse = await Course.findOne({
    code: req.params.code,
    user: req.user.userId,
  });

  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  res.status(200).json({
    message: "Course fetched successfully",
    course: existingCourse,
  });
};

// get all courses
const getCourses = async (req, res) => {
  const courses = await Course.find({
    user: req.user.userId,
  });
  res.status(200).json({
    message: "Courses fetched successfully",
    courses,
  });
};

// Update course
const updateCourse = async (req, res, next) => {
  const existingCourse = await Course.findOne({
    code: req.params.code,
    user: req.user.userId,
  });

  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  const { name, instructor, creditHours } = req.body;

  if (name !== undefined) {
    existingCourse.name = name;
  }

  if (instructor !== undefined) {
    existingCourse.instructor = instructor;
  }

  if (creditHours !== undefined) {
    existingCourse.creditHours = creditHours;
  }

  await existingCourse.save();

  res.status(200).json({
    message: "Course updated successfully",
    course: existingCourse,
  });
};

// delete course
const deleteCourse = async (req, res, next) => {
  const existingCourse = await Course.findOne({
    code: req.params.code,
    user: req.user.userId,
  });

  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  await Course.findOneAndDelete({
    code: req.params.code,
    user: req.user.userId,
  });

  res.status(200).json({
    message: "Course deleted successfully",
  });
};

export { createCourse, getCourse, getCourses, updateCourse, deleteCourse };
