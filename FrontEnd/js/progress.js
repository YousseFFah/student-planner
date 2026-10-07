let progressData = null;

const escapeHtml = (value) => {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
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
    return "Unknown Course";
  }

  if (typeof course === "string") {
    return course;
  }

  return (
    course.name ||
    course.code ||
    "Unknown Course"
  );
};

const getCourseCode = (course) => {
  if (!course || typeof course === "string") {
    return "";
  }

  return course.code || "";
};

const updateOverview = (data) => {
  const overallPercentage =
    getPercentage(
      data.overallPercentage ?? 0
    );

  const totalMarks =
    Number(data.totalMarks ?? 0);

  const obtainedMarks =
    Number(data.obtainedMarks ?? 0);

  const completedAssessments =
    Number(
      data.completedAssessments ??
      data.assessmentsCount ??
      0
    );

  const courseProgress =
    Array.isArray(data.courses)
      ? data.courses
      : Array.isArray(
          data.courseProgress
        )
        ? data.courseProgress
        : [];

  const percentageElement =
    document.getElementById(
      "overallPercentage"
    );

  const labelElement =
    document.getElementById(
      "overallLabel"
    );

  const progressBar =
    document.getElementById(
      "overallProgressBar"
    );

  const totalMarksElement =
    document.getElementById(
      "totalMarks"
    );

  const obtainedMarksElement =
    document.getElementById(
      "obtainedMarks"
    );

  const completedElement =
    document.getElementById(
      "completedAssessments"
    );

  const coursesElement =
    document.getElementById(
      "coursesTracked"
    );

  percentageElement.textContent =
    `${overallPercentage}%`;

  totalMarksElement.textContent =
    formatMarks(totalMarks);

  obtainedMarksElement.textContent =
    formatMarks(obtainedMarks);

  completedElement.textContent =
    completedAssessments;

  coursesElement.textContent =
    courseProgress.length;

  progressBar.style.width =
    `${overallPercentage}%`;

  if (completedAssessments === 0) {
    labelElement.textContent =
      "No completed assessments yet";
  } else {
    labelElement.textContent =
      `${completedAssessments} completed assessment${
        completedAssessments === 1
          ? ""
          : "s"
      }`;
  }
};

const renderCourseProgress = (data) => {
  const container =
    document.getElementById(
      "courseProgressList"
    );

  const emptySection =
    document.getElementById(
      "progressEmpty"
    );

  let courses =
    Array.isArray(data.courses)
      ? data.courses
      : Array.isArray(
          data.courseProgress
        )
        ? data.courseProgress
        : [];

  if (!container) {
    return;
  }

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="progress-list-empty">
        Complete an assessment to see your course progress here.
      </div>
    `;

    if (emptySection) {
      emptySection.classList.remove(
        "hidden"
      );
    }

    return;
  }

  if (emptySection) {
    emptySection.classList.add(
      "hidden"
    );
  }

  courses = courses.map((course) => {
    const percentage =
      getPercentage(
        course.percentage ??
        course.progress ??
        course.averagePercentage ??
        0
      );

    return {
      ...course,
      percentage,
    };
  });

  courses.sort(
    (a, b) =>
      b.percentage - a.percentage
  );

  container.innerHTML =
    courses
      .map((course) => {
        const courseObject =
          course.course || course;

        const name =
          getCourseName(
            courseObject
          );

        const code =
          getCourseCode(
            courseObject
          );

        const obtained =
          course.obtainedMarks ??
          course.totalObtained ??
          0;

        const total =
          course.totalMarks ??
          0;

        const assessmentCount =
          course.assessmentsCount ??
          course.completedAssessments ??
          course.count ??
          0;

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
                ${course.percentage}%
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
                ${escapeHtml(
                  formatMarks(obtained)
                )}
                /
                ${escapeHtml(
                  formatMarks(total)
                )}
                marks
              </span>

              <span class="course-progress-assessments">
                ${assessmentCount}
                completed assessment${
                  Number(
                    assessmentCount
                  ) === 1
                    ? ""
                    : "s"
                }
              </span>

            </div>

          </article>
        `;
      })
      .join("");
};

const showProgressError = (message) => {
  const container =
    document.getElementById(
      "courseProgressList"
    );

  const emptySection =
    document.getElementById(
      "progressEmpty"
    );

  if (emptySection) {
    emptySection.classList.add(
      "hidden"
    );
  }

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="progress-list-empty">
      ${escapeHtml(
        message ||
          "Unable to load your progress."
      )}
    </div>
  `;

  const percentage =
    document.getElementById(
      "overallPercentage"
    );

  const label =
    document.getElementById(
      "overallLabel"
    );

  if (percentage) {
    percentage.textContent = "—";
  }

  if (label) {
    label.textContent =
      "Unable to load progress";
  }
};

const loadProgress = async () => {
  try {
    const data =
      await getProgressData();

    progressData = data;

    updateOverview(data);

    renderCourseProgress(data);
  } catch (error) {
    console.error(
      "Progress loading error:",
      error
    );

    showProgressError(
      error.message
    );
  }
};

document.addEventListener(
  "DOMContentLoaded",
  loadProgress
);