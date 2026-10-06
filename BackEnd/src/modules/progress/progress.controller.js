import { Assessment } from "../../../db/models/assessment.model.js";

const getProgress = async (req, res) => {
  const userId = req.user.userId;

  const assessments = await Assessment.find({
    user: userId,
    status: "Completed",
  }).populate("course");

  let totalMarks = 0;
  let obtainedMarks = 0;

  const courseProgress = {};

  assessments.forEach((assessment) => {
    totalMarks += assessment.totalMarks;
    obtainedMarks += assessment.obtainedMarks;

    const courseId = assessment.course._id.toString();

    if (!courseProgress[courseId]) {
      courseProgress[courseId] = {
        course: assessment.course,
        totalMarks: 0,
        obtainedMarks: 0,
      };
    }

    courseProgress[courseId].totalMarks += assessment.totalMarks;
    courseProgress[courseId].obtainedMarks += assessment.obtainedMarks;
  });

  const overallPercentage =
    totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  const courses = Object.values(courseProgress).map((course) => ({
    course: course.course,
    totalMarks: course.totalMarks,
    obtainedMarks: course.obtainedMarks,
    percentage:
      course.totalMarks > 0
        ? (course.obtainedMarks / course.totalMarks) * 100
        : 0,
  }));

  res.status(200).json({
    message: "Progress fetched successfully",
    progress: {
      totalMarks,
      obtainedMarks,
      percentage: overallPercentage,
      courses,
    },
  });
};

export { getProgress };