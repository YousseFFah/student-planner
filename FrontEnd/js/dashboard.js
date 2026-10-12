
const getDashboardData = async () => {
  const data = await api.get("/dashboard");
  return data.dashboard || data;
};

const getText = (english, arabic) =>
  getLanguage() === "ar" ? arabic : english;

const formatDate = (dateValue) => {
  if (!dateValue) {
    return getText("No deadline", "بدون موعد نهائي");
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return getText("Invalid date", "تاريخ غير صالح");
  }

  return date.toLocaleDateString(
    getLanguage() === "ar" ? "ar-EG" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
};

const getDateState = (dateValue) => {
  if (!dateValue) return "";

  const deadline = new Date(dateValue);
  const now = new Date();

  if (Number.isNaN(deadline.getTime())) return "";
  if (deadline < now) return "overdue";

  const today = new Date();

  const sameDay =
    deadline.getFullYear() === today.getFullYear() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getDate() === today.getDate();

  return sameDay ? "today" : "";
};

const getCourseName = (item) => {
  if (!item.course) {
    return getText("No course", "بدون مقرر");
  }

  if (typeof item.course === "string") {
    return item.course;
  }

  return (
    item.course.name ||
    item.course.code ||
    getText("No course", "بدون مقرر")
  );
};

function updateGreeting() {
  const greetingElement = document.getElementById("greeting");
  if (!greetingElement) return;

  const hour = new Date().getHours();

  let greetingKey;

  if (hour < 12) {
    greetingKey = "goodMorning";
  } else if (hour < 17) {
    greetingKey = "goodAfternoon";
  } else if (hour < 21) {
    greetingKey = "goodEvening";
  } else {
    greetingKey = "goodNight";
  }

  greetingElement.textContent = t(greetingKey);
}

const renderTasks = (tasks) => {
  const container = document.getElementById("upcomingTasks");
  if (!container) return;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        ${getText(
          "No upcoming tasks. You're all caught up!",
          "مفيش مهام قادمة. أنت خلصت كل مهامك الحالية!",
        )}
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
  if (!container) return;

  if (!Array.isArray(assessments) || assessments.length === 0) {
    container.innerHTML = `
      <div class="dashboard-empty">
        ${getText("No upcoming assessments.", "مفيش تقييمات قادمة.")}
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
                  assessment.type || getText("Assessment", "تقييم")
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

  if (!title || !text) return;

  const tasks = Array.isArray(dashboard.upcomingTasks)
    ? dashboard.upcomingTasks
    : [];

  const assessments = Array.isArray(dashboard.upcomingAssessments)
    ? dashboard.upcomingAssessments
    : [];

  if (tasks.length === 0 && assessments.length === 0) {
    title.textContent = getText(
      "You're all caught up!",
      "أنت خلصت كل اللي عليك!",
    );

    text.textContent = getText(
      "There are no upcoming tasks or assessments. Keep up the good work.",
      "مفيش مهام أو تقييمات قادمة. استمر بنفس الأداء!",
    );
    return;
  }

  const nextTask = tasks[0];
  const nextAssessment = assessments[0];

  if (!nextTask && nextAssessment) {
    title.textContent = getText(
      `Your next assessment is "${nextAssessment.title}".`,
      `التقييم القادم هو "${nextAssessment.title}".`,
    );

    text.textContent = getText(
      `It is due on ${formatDate(nextAssessment.deadline)}.`,
      `موعد التقييم ${formatDate(nextAssessment.deadline)}.`,
    );
    return;
  }

  if (nextTask && !nextAssessment) {
    title.textContent = getText(
      `Your next task is "${nextTask.title}".`,
      `المهمة القادمة هي "${nextTask.title}".`,
    );

    text.textContent = getText(
      `It is due on ${formatDate(nextTask.deadline)}.`,
      `موعد تسليم المهمة ${formatDate(nextTask.deadline)}.`,
    );
    return;
  }

  const taskDate = new Date(nextTask.deadline);
  const assessmentDate = new Date(nextAssessment.deadline);

  if (taskDate <= assessmentDate) {
    title.textContent = getText(
      `Focus on "${nextTask.title}" first.`,
      `ركّز على "${nextTask.title}" الأول.`,
    );

    text.textContent = getText(
      `Your next task is due on ${formatDate(nextTask.deadline)}.`,
      `موعد تسليم المهمة القادمة ${formatDate(nextTask.deadline)}.`,
    );
  } else {
    title.textContent = getText(
      `Focus on "${nextAssessment.title}" first.`,
      `ركّز على "${nextAssessment.title}" الأول.`,
    );

    text.textContent = getText(
      `Your next assessment is due on ${formatDate(
        nextAssessment.deadline,
      )}.`,
      `موعد التقييم القادم ${formatDate(nextAssessment.deadline)}.`,
    );
  }
};

const escapeHtml = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

let dashboardData = null;
let dashboardError = null;

const renderDashboard = () => {
  updateGreeting();

  if (dashboardError) {
    const tasksContainer = document.getElementById("upcomingTasks");
    const assessmentsContainer = document.getElementById(
      "upcomingAssessments",
    );
    const focusTitle = document.getElementById("focusTitle");
    const focusText = document.getElementById("focusText");

    if (tasksContainer) {
      tasksContainer.innerHTML = `
        <div class="dashboard-empty">
          ${escapeHtml(dashboardError.message)}
        </div>
      `;
    }

    if (assessmentsContainer) {
      assessmentsContainer.innerHTML = `
        <div class="dashboard-empty">
          ${getText(
            "Unable to load assessments.",
            "تعذّر تحميل التقييمات.",
          )}
        </div>
      `;
    }

    if (focusTitle) {
      focusTitle.textContent = getText(
        "Unable to load your priorities.",
        "تعذّر تحميل أولوياتك.",
      );
    }

    if (focusText) {
      focusText.textContent = getText(
        "Please make sure the backend server is running.",
        "تأكد من أن الخادم يعمل بشكل صحيح.",
      );
    }

    return;
  }

  if (!dashboardData) return;

  updateStats(dashboardData);
  renderTasks(dashboardData.upcomingTasks || []);
  renderAssessments(dashboardData.upcomingAssessments || []);
  updateFocus(dashboardData);
};

const loadDashboard = async () => {
  try {
    dashboardData = await getDashboardData();
    dashboardError = null;
  } catch (error) {
    console.error("Dashboard error:", error);
    dashboardError = error;
  }

  renderDashboard();
};

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  loadDashboard();
});

document.addEventListener("languageChanged", () => {
  renderDashboard();
});