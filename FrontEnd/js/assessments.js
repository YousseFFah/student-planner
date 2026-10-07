let assessments = [];
let courses = [];

let editingAssessmentId = null;
let deletingAssessment = null;
let currentFilter = "All";

const escapeHtml = (value) => {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
};

const getItemId = (item) => {
  if (!item) {
    return "";
  }

  return item._id || item.id || "";
};

const getCourses = async () => {
  const data = await api.get("/courses");

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.courses)
    ? data.courses
    : [];
};

const getAssessments = async () => {
  const data = await api.get("/assessments");

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.assessments)
    ? data.assessments
    : [];
};

const getCourseName = (assessment) => {
  if (!assessment?.course) {
    return "No course";
  }

  if (typeof assessment.course === "string") {
    const course = courses.find(
      (item) =>
        String(getItemId(item)) ===
        String(assessment.course)
    );

    return course
      ? `${course.name} (${course.code})`
      : "No course";
  }

  return (
    assessment.course.name ||
    assessment.course.code ||
    "No course"
  );
};

const getCourseId = (assessment) => {
  if (!assessment?.course) {
    return "";
  }

  if (typeof assessment.course === "string") {
    return assessment.course;
  }

  return getItemId(assessment.course);
};

const formatDate = (value) => {
  if (!value) {
    return "No deadline";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getDeadlineState = (deadline, status) => {
  if (!deadline || status === "Completed") {
    return "";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  if (date < new Date()) {
    return "overdue";
  }

  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return isToday ? "today" : "";
};

const getDeadlineText = (assessment) => {
  const date = formatDate(
    assessment.deadline
  );

  const time = formatTime(
    assessment.deadline
  );

  return time
    ? `${date} · ${time}`
    : date;
};

const getStatusClass = (status) => {
  if (status === "Completed") {
    return "completed";
  }

  if (status === "In Progress") {
    return "in-progress";
  }

  return "";
};

const getPercentage = (
  obtainedMarks,
  totalMarks
) => {
  const total = Number(totalMarks);
  const obtained = Number(obtainedMarks);

  if (!total || total <= 0) {
    return 0;
  }

  return Math.round(
    (obtained / total) * 100
  );
};

const populateCourses = () => {
  const courseSelect =
    document.getElementById(
      "assessmentCourse"
    );

  if (!courseSelect) {
    return;
  }

  courseSelect.innerHTML = `
    <option value="">Select course</option>
  `;

  courses.forEach((course) => {
    const id = getItemId(course);

    if (!id) {
      return;
    }

    const option =
      document.createElement("option");

    option.value = id;

    option.textContent =
      `${course.name} (${course.code})`;

    courseSelect.appendChild(option);
  });
};

const renderAssessments = () => {
  const list =
    document.getElementById(
      "assessmentsList"
    );

  const count =
    document.getElementById(
      "assessmentCount"
    );

  if (!list) {
    return;
  }

  let visibleAssessments = [
    ...assessments,
  ];

  if (currentFilter !== "All") {
    visibleAssessments =
      visibleAssessments.filter(
        (assessment) =>
          assessment.status ===
          currentFilter
      );
  }

  visibleAssessments.sort((a, b) => {
    return (
      new Date(a.deadline).getTime() -
      new Date(b.deadline).getTime()
    );
  });

  if (count) {
    count.textContent =
      assessments.length === 1
        ? "1 Assessment"
        : `${assessments.length} Assessments`;
  }

  if (visibleAssessments.length === 0) {
    list.innerHTML = `
      <div class="assessments-empty">

        <strong>
          ${
            currentFilter === "All"
              ? "No assessments yet"
              : `No ${currentFilter.toLowerCase()} assessments`
          }
        </strong>

        <span>
          ${
            currentFilter === "All"
              ? "Add your first assessment to start tracking your grades."
              : "There are no assessments in this category."
          }
        </span>

      </div>
    `;

    return;
  }

  list.innerHTML =
    visibleAssessments
      .map((assessment) => {
        const id =
          getItemId(assessment);

        const statusClass =
          getStatusClass(
            assessment.status
          );

        const deadlineState =
          getDeadlineState(
            assessment.deadline,
            assessment.status
          );

        const percentage =
          getPercentage(
            assessment.obtainedMarks,
            assessment.totalMarks
          );

        return `
          <article
            class="assessment-item ${statusClass}"
            data-assessment-id="${escapeHtml(id)}"
          >

            <div
              class="assessment-status-dot ${statusClass}"
            ></div>

            <div class="assessment-main">

              <div class="assessment-title-row">

                <p class="assessment-title">
                  ${escapeHtml(
                    assessment.title
                  )}
                </p>

                <span class="assessment-type">
                  ${escapeHtml(
                    assessment.type
                  )}
                </span>

              </div>

              <div class="assessment-meta">

                <span>
                  ${escapeHtml(
                    getCourseName(
                      assessment
                    )
                  )}
                </span>

                <span class="assessment-meta-separator">
                  •
                </span>

                <span>
                  ${escapeHtml(
                    assessment.status
                  )}
                </span>

              </div>

            </div>

            <div class="assessment-score">

              <strong>
                ${escapeHtml(
                  String(
                    assessment.obtainedMarks ?? 0
                  )
                )}
                /
                ${escapeHtml(
                  String(
                    assessment.totalMarks ?? 0
                  )
                )}
              </strong>

              <span>
                Marks
              </span>

            </div>

            <div class="assessment-percentage">
              ${percentage.toFixed(2)}%
            </div>

            <div
              class="assessment-deadline ${deadlineState}"
            >
              ${escapeHtml(
                getDeadlineText(
                  assessment
                )
              )}
            </div>

            <div class="assessment-actions">

              <button
                type="button"
                class="assessment-action-btn edit"
                data-action="edit"
                data-assessment-id="${escapeHtml(id)}"
              >
                Edit
              </button>

              <button
                type="button"
                class="assessment-action-btn delete"
                data-action="delete"
                data-assessment-id="${escapeHtml(id)}"
              >
                Delete
              </button>

            </div>

          </article>
        `;
      })
      .join("");
};

const openAssessmentModal = (
  assessment = null
) => {
  const modal =
    document.getElementById(
      "assessmentModal"
    );

  const titleInput =
    document.getElementById(
      "assessmentTitle"
    );

  const typeInput =
    document.getElementById(
      "assessmentType"
    );

  const courseInput =
    document.getElementById(
      "assessmentCourse"
    );

  const totalMarksInput =
    document.getElementById(
      "totalMarks"
    );

  const obtainedMarksInput =
    document.getElementById(
      "obtainedMarks"
    );

  const obtainedMarksGroup =
    document.getElementById(
      "obtainedMarksGroup"
    );

  const deadlineInput =
    document.getElementById(
      "assessmentDeadline"
    );

  const statusInput =
    document.getElementById(
      "assessmentStatus"
    );

  const statusGroup =
    document.getElementById(
      "assessmentStatusGroup"
    );

  const modalTitle =
    document.getElementById(
      "modalTitle"
    );

  const saveButton =
    document.getElementById(
      "saveAssessmentBtn"
    );

  const errorBox =
    document.getElementById(
      "assessmentFormError"
    );

  populateCourses();

  titleInput.value = "";
  typeInput.value = "";
  courseInput.value = "";
  totalMarksInput.value = "";
  obtainedMarksInput.value = "";
  deadlineInput.value = "";
  statusInput.value = "Pending";

  errorBox.textContent = "";
  errorBox.classList.remove("visible");

  /*
   * ADD ASSESSMENT
   */
  if (!assessment) {
    editingAssessmentId = null;

    modalTitle.textContent =
      "Add Assessment";

    saveButton.textContent =
      "Save Assessment";

    /*
     * Hide fields that only make sense
     * after the assessment is graded.
     */
    obtainedMarksGroup.classList.add(
      "hidden"
    );

    statusGroup.classList.add(
      "hidden"
    );

    obtainedMarksInput.required = false;
    statusInput.required = false;

    /*
     * Defaults for a new assessment.
     */
    obtainedMarksInput.value = "0";
    statusInput.value = "Pending";
  }

  /*
   * EDIT ASSESSMENT
   */
  else {
    editingAssessmentId =
      getItemId(assessment);

    modalTitle.textContent =
      "Edit Assessment";

    saveButton.textContent =
      "Save Changes";

    /*
     * Show fields only in Edit.
     */
    obtainedMarksGroup.classList.remove(
      "hidden"
    );

    statusGroup.classList.remove(
      "hidden"
    );

    obtainedMarksInput.required = true;
    statusInput.required = true;

    titleInput.value =
      assessment.title || "";

    typeInput.value =
      assessment.type || "";

    courseInput.value =
      getCourseId(assessment);

    totalMarksInput.value =
      assessment.totalMarks ?? "";

    obtainedMarksInput.value =
      assessment.obtainedMarks ?? 0;

    statusInput.value =
      assessment.status || "Pending";

    if (assessment.deadline) {
      const date =
        new Date(
          assessment.deadline
        );

      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        const localDate =
          new Date(
            date.getTime() -
              date.getTimezoneOffset() *
                60000
          );

        deadlineInput.value =
          localDate
            .toISOString()
            .slice(0, 16);
      }
    }
  }

  modal.classList.remove(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  setTimeout(() => {
    titleInput.focus();
  }, 50);
};

const closeAssessmentModal = () => {
  const modal =
    document.getElementById(
      "assessmentModal"
    );

  if (!modal) {
    return;
  }

  modal.classList.add(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  editingAssessmentId = null;
};

const getFormData = () => {
  const title =
    document
      .getElementById(
        "assessmentTitle"
      )
      .value
      .trim();

  const type =
    document.getElementById(
      "assessmentType"
    ).value;

  const course =
    document.getElementById(
      "assessmentCourse"
    ).value;

  const totalMarksValue =
    document.getElementById(
      "totalMarks"
    ).value;

  const obtainedMarksInput =
    document.getElementById(
      "obtainedMarks"
    );

  const statusInput =
    document.getElementById(
      "assessmentStatus"
    );

  const deadline =
    document.getElementById(
      "assessmentDeadline"
    ).value;

  if (!title) {
    throw new Error(
      "Please enter an assessment title."
    );
  }

  if (!type) {
    throw new Error(
      "Please select an assessment type."
    );
  }

  if (!course) {
    throw new Error(
      "Please select a course."
    );
  }

  if (
    totalMarksValue === "" ||
    Number(totalMarksValue) <= 0
  ) {
    throw new Error(
      "Total marks must be greater than 0."
    );
  }

  if (!deadline) {
    throw new Error(
      "Please select a deadline."
    );
  }

  const date =
    new Date(deadline);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Please enter a valid deadline."
    );
  }

  const totalMarks =
    Number(totalMarksValue);

  /*
   * ADD
   */
  if (!editingAssessmentId) {
    return {
      title,
      type,
      course,
      totalMarks,
      obtainedMarks: 0,
      deadline: date.toISOString(),
      status: "Pending",
    };
  }

  /*
   * EDIT
   */
  const obtainedMarks =
    Number(
      obtainedMarksInput.value
    );

  if (
    obtainedMarksInput.value === "" ||
    obtainedMarks < 0
  ) {
    throw new Error(
      "Obtained marks cannot be negative."
    );
  }

  if (obtainedMarks > totalMarks) {
    throw new Error(
      "Obtained marks cannot be greater than total marks."
    );
  }

  return {
    title,
    type,
    course,
    totalMarks,
    obtainedMarks,
    deadline: date.toISOString(),
    status: statusInput.value,
  };
};

const saveAssessment = async (
  event
) => {
  event.preventDefault();

  const saveButton =
    document.getElementById(
      "saveAssessmentBtn"
    );

  const errorBox =
    document.getElementById(
      "assessmentFormError"
    );

  if (!saveButton || !errorBox) {
    return;
  }

  const isEditing =
    Boolean(editingAssessmentId);

  try {
    const data =
      getFormData();

    errorBox.textContent = "";

    errorBox.classList.remove(
      "visible"
    );

    saveButton.disabled = true;

    if (isEditing) {
      saveButton.textContent =
        "Saving...";

      await api.patch(
        `/assessments/${encodeURIComponent(
          editingAssessmentId
        )}`,
        data
      );

    } else {
      saveButton.textContent =
        "Adding...";

      await api.post(
        "/assessments",
        data
      );
    }

    closeAssessmentModal();

    await loadData();

  } catch (error) {
    console.error(
      "Save assessment error:",
      error
    );

    errorBox.textContent =
      error.message ||
      "Unable to save assessment.";

    errorBox.classList.add(
      "visible"
    );

  } finally {
    saveButton.disabled = false;

    saveButton.textContent =
      isEditing
        ? "Save Changes"
        : "Save Assessment";
  }
};

const findAssessmentById = (
  id
) => {
  return assessments.find(
    (assessment) =>
      String(
        getItemId(assessment)
      ) === String(id)
  );
};

const openEditAssessment = (
  id
) => {
  const assessment =
    findAssessmentById(id);

  if (!assessment) {
    console.error(
      "Assessment not found:",
      id
    );

    return;
  }

  openAssessmentModal(
    assessment
  );
};

const openDeleteModal = (
  id
) => {
  const assessment =
    findAssessmentById(id);

  if (!assessment) {
    console.error(
      "Assessment not found:",
      id
    );

    return;
  }

  deletingAssessment =
    assessment;

  const modal =
    document.getElementById(
      "deleteModal"
    );

  const name =
    document.getElementById(
      "deleteAssessmentName"
    );

  if (!modal || !name) {
    console.error(
      "Delete modal elements are missing."
    );

    return;
  }

  name.textContent =
    assessment.title;

  modal.classList.remove(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
};

const closeDeleteModal = () => {
  const modal =
    document.getElementById(
      "deleteModal"
    );

  if (!modal) {
    return;
  }

  modal.classList.add(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  deletingAssessment = null;
};

const confirmDeleteAssessment =
  async () => {

    if (!deletingAssessment) {
      return;
    }

    const id =
      getItemId(
        deletingAssessment
      );

    if (!id) {
      alert(
        "Unable to identify this assessment."
      );

      return;
    }

    const button =
      document.getElementById(
        "confirmDeleteBtn"
      );

    if (!button) {
      return;
    }

    const originalText =
      button.textContent;

    try {
      button.disabled = true;

      button.textContent =
        "Deleting...";

      await api.delete(
        `/assessments/${encodeURIComponent(
          id
        )}`
      );

      closeDeleteModal();

      await loadData();

    } catch (error) {
      console.error(
        "Delete assessment error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete assessment."
      );

    } finally {
      button.disabled = false;

      button.textContent =
        originalText;
    }
  };

const loadData = async () => {
  const list =
    document.getElementById(
      "assessmentsList"
    );

  if (!list) {
    return;
  }

  list.innerHTML = `
    <div class="assessments-loading">
      Loading assessments...
    </div>
  `;

  try {
    const [
      loadedCourses,
      loadedAssessments,
    ] = await Promise.all([
      getCourses(),
      getAssessments(),
    ]);

    courses =
      loadedCourses;

    assessments =
      loadedAssessments;

    populateCourses();

    renderAssessments();

  } catch (error) {
    console.error(
      "Assessments loading error:",
      error
    );

    list.innerHTML = `
      <div class="assessments-empty">

        <strong>
          Unable to load assessments
        </strong>

        <span>
          ${escapeHtml(
            error.message ||
              "Please make sure the backend server is running."
          )}
        </span>

      </div>
    `;
  }
};

const initializeAssessments =
  () => {

    const addButton =
      document.getElementById(
        "addAssessmentBtn"
      );

    const closeButton =
      document.getElementById(
        "closeModalBtn"
      );

    const cancelButton =
      document.getElementById(
        "cancelAssessmentBtn"
      );

    const confirmDeleteButton =
      document.getElementById(
        "confirmDeleteBtn"
      );

    const cancelDeleteButton =
      document.getElementById(
        "cancelDeleteBtn"
      );

    const form =
      document.getElementById(
        "assessmentForm"
      );

    const list =
      document.getElementById(
        "assessmentsList"
      );

    const assessmentModal =
      document.getElementById(
        "assessmentModal"
      );

    const deleteModal =
      document.getElementById(
        "deleteModal"
      );

    if (
      !addButton ||
      !closeButton ||
      !cancelButton ||
      !confirmDeleteButton ||
      !cancelDeleteButton ||
      !form ||
      !list ||
      !assessmentModal ||
      !deleteModal
    ) {
      console.error(
        "Assessment page elements are missing."
      );

      return;
    }

    addButton.addEventListener(
      "click",
      () => {
        openAssessmentModal();
      }
    );

    closeButton.addEventListener(
      "click",
      closeAssessmentModal
    );

    cancelButton.addEventListener(
      "click",
      closeAssessmentModal
    );

    confirmDeleteButton.addEventListener(
      "click",
      confirmDeleteAssessment
    );

    cancelDeleteButton.addEventListener(
      "click",
      closeDeleteModal
    );

    form.addEventListener(
      "submit",
      saveAssessment
    );

    list.addEventListener(
      "click",
      (event) => {

        const button =
          event.target.closest(
            "[data-action][data-assessment-id]"
          );

        if (!button) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const action =
          button.dataset.action;

        const id =
          button.dataset.assessmentId;

        if (!id) {
          console.error(
            "Assessment button has no ID."
          );

          return;
        }

        if (action === "edit") {
          openEditAssessment(id);

          return;
        }

        if (action === "delete") {
          openDeleteModal(id);
        }
      }
    );

    document
      .querySelectorAll(
        ".filter-btn"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".filter-btn"
              )
              .forEach(
                (item) => {
                  item.classList.remove(
                    "active"
                  );
                }
              );

            button.classList.add(
              "active"
            );

            currentFilter =
              button.dataset.filter;

            renderAssessments();
          }
        );

      });

    assessmentModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          assessmentModal
        ) {
          closeAssessmentModal();
        }
      }
    );

    deleteModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          deleteModal
        ) {
          closeDeleteModal();
        }
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !== "Escape"
        ) {
          return;
        }

        closeAssessmentModal();
        closeDeleteModal();
      }
    );

    loadData();
  };

document.addEventListener(
  "DOMContentLoaded",
  initializeAssessments
);