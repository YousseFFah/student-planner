import { Task } from "../../../db/models/task.model.js";
import { Course } from "../../../db/models/course.model.js";
import AppError from "../../utilities/appError.js";

const isDeadlinePassed = (deadline) => {
  return deadline && new Date(deadline).getTime() <= Date.now();
};

// Add new task
const createTask = async (req, res, next) => {
  const { title, type, description, deadline, course } = req.body;

  const existingCourse = await Course.findOne({
    _id: course,
    user: req.user.userId,
  });

  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  const newTask = await Task.create({
    title,
    type,
    description,
    deadline,
    course,
    user: req.user.userId,
  });

  res.status(201).json({
    message: "Task created successfully",
    task: newTask,
  });
};

// Get one task
const getTask = async (req, res, next) => {
  const existingTask = await Task.findOne({
    _id: req.params.id,
    user: req.user.userId,
  }).populate("course");

  if (!existingTask) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    message: "Task fetched successfully",
    task: existingTask,
  });
};

// Get all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find({
    user: req.user.userId,
  }).populate("course");

  res.status(200).json({
    message: "Tasks fetched successfully",
    tasks,
  });
};

// Update task
const updateTask = async (req, res, next) => {
  const existingTask = await Task.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!existingTask) {
    return next(new AppError("Task not found", 404));
  }

  // Prevent any changes after the original deadline.
  // Check the saved deadline before accepting a new one.
  if (isDeadlinePassed(existingTask.deadline)) {
    return next(
      new AppError(
        "This task deadline has passed. The task can no longer be changed.",
        403
      )
    );
  }

  const { title, type, description, deadline, status } = req.body;

  if (title !== undefined) {
    existingTask.title = title;
  }

  if (type !== undefined) {
    existingTask.type = type;
  }

  if (description !== undefined) {
    existingTask.description = description;
  }

  if (deadline !== undefined) {
    existingTask.deadline = deadline;
  }

  if (status !== undefined) {
    existingTask.status = status;
  }

  await existingTask.save();
  await existingTask.populate("course");

  res.status(200).json({
    message: "Task updated successfully",
    task: existingTask,
  });
};

// Delete task
const deleteTask = async (req, res, next) => {
  const existingTask = await Task.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!existingTask) {
    return next(new AppError("Task not found", 404));
  }

  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  res.status(200).json({
    message: "Task deleted successfully",
  });
};

export {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
};