import { Course } from "../../../db/models/course.model.js";
import { Assessment } from "../../../db/models/assessment.model.js";
import { Task } from "../../../db/models/task.model.js";

const getDashboard = async (req, res) => {
  const userId = req.user.userId;

  const totalCourses = await Course.countDocuments({
    user: userId,
  });

  const totalAssessments = await Assessment.countDocuments({
    user: userId,
  });

  const completedAssessments = await Assessment.countDocuments({
    user: userId,
    status: "Completed",
  });

  const totalTasks = await Task.countDocuments({
    user: userId,
  });

  const completedTasks = await Task.countDocuments({
    user: userId,
    status: "Completed",
  });

  const pendingTasks = await Task.countDocuments({
    user: userId,
    status: "Pending",
  });

  const upcomingTasks = await Task.find({
    user: userId,
    status: { $ne: "Completed" },
    deadline: { $gte: new Date() },
  })
    .sort({ deadline: 1 })
    .limit(5)
    .populate("course");

  const upcomingAssessments = await Assessment.find({
    user: userId,
    status: { $ne: "Completed" },
    deadline: { $gte: new Date() },
  })
    .sort({ deadline: 1 })
    .limit(5)
    .populate("course");

  res.status(200).json({
    message: "Dashboard fetched successfully",
    dashboard: {
      totalCourses,
      totalAssessments,
      completedAssessments,
      totalTasks,
      completedTasks,
      pendingTasks,
      upcomingTasks,
      upcomingAssessments,
    },
  });
};

export { getDashboard };