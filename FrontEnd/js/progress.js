
let progressData = null;

const escapeHtml = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

const translate = (key) => {
  return typeof window.t === "function" ? window.t(key) : key;
};

const getProgressData = async () => {
  const data = await api.get("/progress");
  return data.progress || data;
};

const getPercentage = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, number));
};

const formatMarks = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (Number.isInteger(number)) {
    return String(number);
  }

  return number.toFixed(2).replace(/\.?0+$/, "");
};

const getCourseName = (course) => {
  if (!course) {
    return translate("unknownCourse");
  }

  if (typeof course === "string") {
    return course;
  }

  return course.name || course.code || translate("unknownCourse");
};

const getCourseCode = (course) => {
  if (!course || typeof course === "string") {
    return "";
  }

  return course.code || "";
};

const getCourses = (data) => {
  if (Array.isArray(data?.courses)) {
    return data.courses;
  }

  if (Array.isArray(data?.courseProgress)) {
    return data.courseProgress;
  }

  return [];
};

const updateOverview = (data) => {
  const overallPercentage = getPercentage(data.overallPercentage ?? 0);
  const totalMarks = Number(data.totalMarks ?? 0);
  const obtainedMarks = Number(data.obtainedMarks ?? 0);

  const completedAssessments = Number(
    data.completedAssessments ?? data.assessmentsCount ?? 0
  );

  const courses = getCourses(data);

  const percentageElement = document.getElementById("overallPercentage");
  const labelElement = document.getElementById("overallLabel");
  const progressBar = document.getElementById("overallProgressBar");
  const totalMarksElement = document.getElementById("totalMarks");
  const obtainedMarksElement = document.getElementById("obtainedMarks");
  const completedElement = document.getElementById("completedAssessments");
  const coursesElement = document.getElementById("coursesTracked");

  percentageElement.textContent = `${overallPercentage.toFixed(2)}%`;
  totalMarksElement.textContent = formatMarks(totalMarks);
  obtainedMarksElement.textContent = formatMarks(obtainedMarks);
  completedElement.textContent = completedAssessments;
  coursesElement.textContent = courses.length;

  progressBar.style.width = `${overallPercentage}%`;

  if (completedAssessments === 0) {
    labelElement.textContent = translate("noCompletedAssessments");
  } else {
    const count = completedAssessments;

    labelElement.textContent =
      `${count} ${translate("completedAssessmentCount")}`;
  }
};

const renderCourseProgress = (data) => {
  const container = document.getElementById("courseProgressList");
  const emptySection = document.getElementById("progressEmpty");

  if (!container) {
    return;
  }

  let courses = getCourses(data);

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="progress-list-empty">
        ${escapeHtml(translate("completeAssessmentForCourseProgress"))}
      </div>
    `;

    if (emptySection) {
      emptySection.classList.remove("hidden");
    }

    return;
  }

  if (emptySection) {
    emptySection.classList.add("hidden");
  }

  courses = courses
    .map((course) => ({
      ...course,
      percentage: getPercentage(
        course.percentage ??
        course.progress ??
        course.averagePercentage ??
        0
      ),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  container.innerHTML = courses
    .map((course) => {
      const courseObject = course.course || course;
      const name = getCourseName(courseObject);
      const code = getCourseCode(courseObject);

      const obtained = course.obtainedMarks ?? course.totalObtained ?? 0;
      const total = course.totalMarks ?? 0;

      const assessmentCount =
        course.assessmentsCount ??
        course.completedAssessments ??
        course.count ??
        0;

      const assessmentLabel =
        Number(assessmentCount) === 1
          ? translate("completedAssessmentCount")
          : translate("completedAssessmentsCount");

      return `
        <article class="course-progress-card">
          <div class="course-progress-top">
            <div class="course-progress-info">
              <p class="course-progress-name">
                ${escapeHtml(name)}
              </p>

              ${
                code
                  ? `
                    <p class="course-progress-code">
                      ${escapeHtml(code)}
                    </p>
                  `
                  : ""
              }
            </div>

            <strong class="course-progress-percentage">
              ${course.percentage.toFixed(2)}%
            </strong>
          </div>

          <div class="course-progress-track">
            <div
              class="course-progress-fill"
              style="width: ${course.percentage}%"
            ></div>
          </div>

          <div class="course-progress-bottom">
            <span class="course-progress-marks">
              ${escapeHtml(formatMarks(obtained))}
              /
              ${escapeHtml(formatMarks(total))}
              ${escapeHtml(translate("marks"))}
            </span>

            <span class="course-progress-assessments">
              ${escapeHtml(assessmentCount)}
              ${escapeHtml(assessmentLabel)}
            </span>
          </div>
        </article>
      `;
    })
    .join("");
};

const showProgressError = (message) => {
  const container = document.getElementById("courseProgressList");
  const emptySection = document.getElementById("progressEmpty");

  if (emptySection) {
    emptySection.classList.add("hidden");
  }

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="progress-list-empty">
      ${escapeHtml(message || translate("unableToLoadProgress"))}
    </div>
  `;

  const percentage = document.getElementById("overallPercentage");
  const label = document.getElementById("overallLabel");

  if (percentage) {
    percentage.textContent = "—";
  }

  if (label) {
    label.textContent = translate("unableToLoadProgress");
  }
};

const loadProgress = async () => {
  try {
    const data = await getProgressData();

    progressData = data;
    updateOverview(data);
    renderCourseProgress(data);
  } catch (error) {
    console.error("Progress loading error:", error);
    showProgressError(error.message);
  }
};

const refreshProgressLanguage = () => {
  if (!progressData) {
    return;
  }

  updateOverview(progressData);
  renderCourseProgress(progressData);
};

document.addEventListener("languageChanged", refreshProgressLanguage);
document.addEventListener("DOMContentLoaded", loadProgress);