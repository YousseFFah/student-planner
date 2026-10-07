const getDashboardData = async () => {
  const data = await api.get("/dashboard");

  return data.dashboard || data;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "No deadline";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDateState = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const deadline = new Date(dateValue);
  const now = new Date();

  if (Number.isNaN(deadline.getTime())) {
    return "";
  }

  if (deadline < now) {
    return "overdue";
  }

  const today = new Date();

  const sameDay =
    deadline.getFullYear() === today.getFullYear() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getDate() === today.getDate();

  return sameDay ? "today" : "";
};

const getCourseName = (item) => {
  if (!item.course) {
    return "No course";
  }

  if (typeof item.course === "string") {
    return item.course;
  }

  return item.course.name || item.course.code || "No course";
};

const renderTasks = (tasks) => {
  const container = document.getElementById("upcomingTasks");

  if (!container) {
    return;
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        No upcoming tasks. You're all caught up!
      </div>
    `;

    return;
  }

  container.innerHTML = tasks
    .map((task) => {
      const dateState = getDateState(task.deadline);

      return `
        <div class="dashboard-item">
          <div class="dashboard-item-marker"></div>

          <div class="dashboard-item-content">
            <p class="dashboard-item-title">
              ${escapeHtml(task.title)}
            </p>

            <p class="dashboard-item-course">
              ${escapeHtml(getCourseName(task))}
            </p>
          </div>

          <div class="dashboard-item-date ${dateState}">
            ${formatDate(task.deadline)}
          </div>
        </div>
      `;
    })
    .join("");
};

const renderAssessments = (assessments) => {
  const container = document.getElementById("upcomingAssessments");

  if (!container) {
    return;
  }

  if (!Array.isArray(assessments) || assessments.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        No upcoming assessments.
      </div>
    `;

    return;
  }

  container.innerHTML = assessments
    .map((assessment) => {
      const dateState = getDateState(assessment.deadline);

      return `
        <div class="dashboard-item">
          <div class="dashboard-item-marker assessment"></div>

          <div class="dashboard-item-content">
            <p class="dashboard-item-title">
              ${escapeHtml(assessment.title)}
            </p>

            <p class="dashboard-item-course">
              ${escapeHtml(
                `${getCourseName(assessment)} · ${
                  assessment.type || "Assessment"
                }`,
              )}
            </p>
          </div>

          <div class="dashboard-item-date ${dateState}">
            ${formatDate(assessment.deadline)}
          </div>
        </div>
      `;
    })
    .join("");
};

const updateStats = (dashboard) => {
  const totalCourses = dashboard.totalCourses ?? 0;

  const totalAssessments = dashboard.totalAssessments ?? 0;
  const completedAssessments = dashboard.completedAssessments ?? 0;

  const completedTasks = dashboard.completedTasks ?? 0;

  const pendingTasks = dashboard.pendingTasks ?? 0;

  const pendingAssessments = Math.max(
    totalAssessments - completedAssessments,
    0,
  );

  const completedWork = completedTasks + completedAssessments;

  document.getElementById("totalCourses").textContent = totalCourses;

  document.getElementById("pendingTasks").textContent = pendingTasks;

  document.getElementById("pendingAssessments").textContent =
    pendingAssessments;

  document.getElementById("completedWork").textContent = completedWork;
};

const updateFocus = (dashboard) => {
  const title = document.getElementById("focusTitle");
  const text = document.getElementById("focusText");

  const tasks = Array.isArray(dashboard.upcomingTasks)
    ? dashboard.upcomingTasks
    : [];

  const assessments = Array.isArray(dashboard.upcomingAssessments)
    ? dashboard.upcomingAssessments
    : [];

  if (tasks.length === 0 && assessments.length === 0) {
    title.textContent = "You're all caught up!";

    text.textContent =
      "There are no upcoming tasks or assessments. Keep up the good work.";

    return;
  }

  const nextTask = tasks[0];
  const nextAssessment = assessments[0];

  if (!nextTask && nextAssessment) {
    title.textContent = `Your next assessment is "${nextAssessment.title}".`;

    text.textContent =
      `It is due on ${formatDate(nextAssessment.deadline)}.`;

    return;
  }

  if (nextTask && !nextAssessment) {
    title.textContent = `Your next task is "${nextTask.title}".`;

    text.textContent =
      `It is due on ${formatDate(nextTask.deadline)}.`;

    return;
  }

  const taskDate = new Date(nextTask.deadline);
  const assessmentDate = new Date(nextAssessment.deadline);

  if (taskDate <= assessmentDate) {
    title.textContent = `Focus on "${nextTask.title}" first.`;

    text.textContent =
      `Your next task is due on ${formatDate(nextTask.deadline)}.`;
  } else {
    title.textContent = `Focus on "${nextAssessment.title}" first.`;

    text.textContent =
      `Your next assessment is due on ${formatDate(
        nextAssessment.deadline,
      )}.`;
  }
};

const escapeHtml = (value) => {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
};

const loadDashboard = async () => {
  try {
    const dashboard = await getDashboardData();

    updateStats(dashboard);

    renderTasks(dashboard.upcomingTasks || []);

    renderAssessments(dashboard.upcomingAssessments || []);

    updateFocus(dashboard);
  } catch (error) {
    console.error("Dashboard error:", error);

    document.getElementById("upcomingTasks").innerHTML = `
      <div class="dashboard-empty">
        ${escapeHtml(error.message)}
      </div>
    `;

    document.getElementById("upcomingAssessments").innerHTML = `
      <div class="dashboard-empty">
        Unable to load assessments.
      </div>
    `;

    document.getElementById("focusTitle").textContent =
      "Unable to load your priorities.";

    document.getElementById("focusText").textContent =
      "Please make sure the backend server is running.";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});