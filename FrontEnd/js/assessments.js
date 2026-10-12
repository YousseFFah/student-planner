
let assessments = [];
let courses = [];

let editingAssessmentId = null;
let deletingAssessment = null;
let currentFilter = "All";

const translate = (key) =>
  typeof window.t === "function" ? window.t(key) : key;

const escapeHtml = (value) => {
  const element = document.createElement("div");
  element.textContent = value ?? "";
  return element.innerHTML;
};

const getItemId = (item) => item?._id || item?.id || "";

const getCourses = async () => {
  const data = await api.get("/courses");
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.courses) ? data.courses : [];
};

const getAssessments = async () => {
  const data = await api.get("/assessments");
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.assessments) ? data.assessments : [];
};

const getCourseId = (assessment) => {
  if (!assessment?.course) return "";
  return typeof assessment.course === "string"
    ? assessment.course
    : getItemId(assessment.course);
};

const getCourseName = (assessment) => {
  if (!assessment?.course) return translate("noCourse");

  if (typeof assessment.course !== "string") {
    return (
      assessment.course.name ||
      assessment.course.code ||
      translate("noCourse")
    );
  }

  const course = courses.find(
    (item) => String(getItemId(item)) === String(assessment.course)
  );

  return course
    ? `${course.name}${course.code ? ` (${course.code})` : ""}`
    : translate("noCourse");
};

const getLocale = () =>
  window.getLanguage?.() === "ar" ? "ar-EG" : "en-US";

const formatDate = (value) => {
  if (!value) return translate("noDeadline");

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return translate("invalidDate");

  return date.toLocaleDateString(getLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(getLocale(), {
    hour: "numeric",
    minute: "2-digit",
  });
};

const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;

  const date = new Date(deadline);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
};

const getDeadlineState = (deadline, status) => {
  if (!deadline || status === "Completed") return "";

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "";

  if (isDeadlinePassed(deadline)) return "overdue";

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return isToday ? "today" : "";
};

const getDeadlineText = (assessment) => {
  const date = formatDate(assessment.deadline);
  const time = formatTime(assessment.deadline);
  return time ? `${date} · ${time}` : date;
};

const getStatusClass = (status) => {
  if (status === "Completed") return "completed";
  if (status === "In Progress") return "in-progress";
  return "";
};

const getStatusLabel = (status) => {
  const keys = {
    Pending: "pending",
    "In Progress": "inProgress",
    Completed: "completedStatus",
  };

  return translate(keys[status] || "other");
};

const getAssessmentTypeLabel = (type) => {
  const keys = {
    Quiz: "assessmentTypeQuiz",
    Assignment: "assessmentTypeAssignment",
    Lab: "assessmentTypeLab",
    Midterm: "assessmentTypeMidterm",
    Final: "assessmentTypeFinal",
    Project: "assessmentTypeProject",
    Other: "assessmentTypeOther",
  };

  return translate(keys[type] || "assessmentTypeOther");
};

const getPercentage = (obtainedMarks, totalMarks) => {
  const total = Number(totalMarks);
  const obtained = Number(obtainedMarks);

  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(obtained) || obtained < 0) return 0;

  return Math.round((obtained / total) * 100);
};

const populateCourses = () => {
  const select = document.getElementById("assessmentCourse");
  if (!select) return;

  const selectedValue = select.value;
  select.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = translate("selectCourse");
  select.appendChild(placeholder);

  courses.forEach((course) => {
    const id = getItemId(course);
    if (!id) return;

    const option = document.createElement("option");
    option.value = id;
    option.textContent = course.code
      ? `${course.name} (${course.code})`
      : course.name;

    select.appendChild(option);
  });

  if (selectedValue) select.value = selectedValue;
};

const updateAssessmentFilters = () => {
  const keys = {
    All: "all",
    Pending: "pending",
    "In Progress": "inProgress",
    Completed: "completedStatus",
  };

  document.querySelectorAll(".filter-btn").forEach((button) => {
    const key = keys[button.dataset.filter || "All"];
    if (key) button.textContent = translate(key);
  });
};

const renderAssessments = () => {
  const list = document.getElementById("assessmentsList");
  const count = document.getElementById("assessmentCount");
  if (!list) return;

  let visible = [...assessments];

  if (currentFilter !== "All") {
    visible = visible.filter(
      (assessment) => assessment.status === currentFilter
    );
  }

  visible.sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return dateA - dateB;
  });

  if (count) {
    const key =
      assessments.length === 1
        ? "assessmentCountSingular"
        : "assessmentCount";

    count.textContent = translate(key).replace(
      "{count}",
      String(assessments.length)
    );
  }

  if (visible.length === 0) {
    const title =
      currentFilter === "All"
        ? translate("noAssessments")
        : translate("noAssessmentsInCategory").replace(
            "{status}",
            getStatusLabel(currentFilter)
          );

    const description =
      currentFilter === "All"
        ? translate("noAssessmentsDescription")
        : translate("noAssessmentsInCategoryDescription");

    list.innerHTML = `
      <div class="assessments-empty">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </div>
    `;
    return;
  }

  list.innerHTML = visible
    .map((assessment) => {
      const id = getItemId(assessment);
      const statusClass = getStatusClass(assessment.status);
      const deadlineState = getDeadlineState(
        assessment.deadline,
        assessment.status
      );
      const locked = isDeadlinePassed(assessment.deadline);
      const overdue = locked && assessment.status !== "Completed";
      const percentage = getPercentage(
        assessment.obtainedMarks,
        assessment.totalMarks
      );

      return `
        <article
          class="assessment-item ${statusClass} ${overdue ? "overdue" : ""} ${locked ? "locked" : ""}"
          data-assessment-id="${escapeHtml(id)}"
        >
          <div class="assessment-status-dot ${statusClass}"></div>

          <div class="assessment-main">
            <div class="assessment-title-row">
              <p class="assessment-title">${escapeHtml(assessment.title)}</p>
              <span class="assessment-type">
                ${escapeHtml(getAssessmentTypeLabel(assessment.type))}
              </span>
            </div>

            <div class="assessment-meta">
              <span>${escapeHtml(getCourseName(assessment))}</span>
              <span class="assessment-meta-separator">•</span>
              <span>${escapeHtml(getStatusLabel(assessment.status))}</span>
            </div>

            ${
              overdue
                ? `<p class="assessment-overdue-message">${escapeHtml(
                    translate("assessmentDeadlinePassedLocked")
                  )}</p>`
                : ""
            }
          </div>

          <div class="assessment-score">
            <strong>
              ${escapeHtml(String(assessment.obtainedMarks ?? 0))}
              /
              ${escapeHtml(String(assessment.totalMarks ?? 0))}
            </strong>
            <span>${escapeHtml(translate("marks"))}</span>
          </div>

          <div class="assessment-percentage">${percentage}%</div>

          <div class="assessment-deadline ${deadlineState}">
            ${escapeHtml(getDeadlineText(assessment))}
          </div>

          <div class="assessment-actions">
            <button
              type="button"
              class="assessment-action-btn edit"
              data-action="edit"
              data-assessment-id="${escapeHtml(id)}"
              ${locked ? "disabled" : ""}
              title="${escapeHtml(
                translate(locked ? "deadlinePassed" : "editAssessment")
              )}"
            >
              ${escapeHtml(translate(locked ? "locked" : "edit"))}
            </button>

            <button
              type="button"
              class="assessment-action-btn delete"
              data-action="delete"
              data-assessment-id="${escapeHtml(id)}"
            >
              ${escapeHtml(translate("delete"))}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
};

const showAssessmentFormError = (message) => {
  const box = document.getElementById("assessmentFormError");
  if (!box) return;

  box.textContent = message;
  box.classList.add("visible");
};

const clearAssessmentFormError = () => {
  const box = document.getElementById("assessmentFormError");
  if (!box) return;

  box.textContent = "";
  box.classList.remove("visible");
};

const findAssessmentById = (id) =>
  assessments.find(
    (assessment) => String(getItemId(assessment)) === String(id)
  );

const openAssessmentModal = (assessment = null) => {
  const modal = document.getElementById("assessmentModal");
  const titleInput = document.getElementById("assessmentTitle");
  const typeInput = document.getElementById("assessmentType");
  const courseInput = document.getElementById("assessmentCourse");
  const totalInput = document.getElementById("totalMarks");
  const obtainedInput = document.getElementById("obtainedMarks");
  const obtainedGroup = document.getElementById("obtainedMarksGroup");
  const deadlineInput = document.getElementById("assessmentDeadline");
  const statusInput = document.getElementById("assessmentStatus");
  const statusGroup = document.getElementById("assessmentStatusGroup");
  const modalTitle = document.getElementById("modalTitle");
  const saveButton = document.getElementById("saveAssessmentBtn");

  if (
    !modal || !titleInput || !typeInput || !courseInput || !totalInput ||
    !obtainedInput || !obtainedGroup || !deadlineInput || !statusInput ||
    !statusGroup || !modalTitle || !saveButton
  ) {
    console.error("Assessment modal elements are missing.");
    return;
  }

  if (assessment && isDeadlinePassed(assessment.deadline)) {
    alert(translate("assessmentDeadlinePassedLocked"));
    return;
  }

  populateCourses();

  titleInput.value = "";
  typeInput.value = "";
  courseInput.value = "";
  totalInput.value = "";
  obtainedInput.value = "0";
  deadlineInput.value = "";
  statusInput.value = "Pending";

  clearAssessmentFormError();

  if (!assessment) {
    editingAssessmentId = null;
    modalTitle.textContent = translate("addAssessment");
    saveButton.textContent = translate("saveAssessment");

    obtainedGroup.classList.add("hidden");
    statusGroup.classList.add("hidden");
    obtainedInput.required = false;
    statusInput.required = false;
  } else {
    editingAssessmentId = getItemId(assessment);
    modalTitle.textContent = translate("editAssessment");
    saveButton.textContent = translate("saveChanges");

    obtainedGroup.classList.remove("hidden");
    statusGroup.classList.remove("hidden");
    obtainedInput.required = true;
    statusInput.required = true;

    titleInput.value = assessment.title || "";
    typeInput.value = assessment.type || "";
    courseInput.value = getCourseId(assessment);
    totalInput.value = assessment.totalMarks ?? "";
    obtainedInput.value = assessment.obtainedMarks ?? 0;
    statusInput.value = assessment.status || "Pending";

    if (assessment.deadline) {
      const date = new Date(assessment.deadline);

      if (!Number.isNaN(date.getTime())) {
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        deadlineInput.value = localDate.toISOString().slice(0, 16);
      }
    }
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => titleInput.focus(), 50);
};

const closeAssessmentModal = () => {
  const modal = document.getElementById("assessmentModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  editingAssessmentId = null;
  clearAssessmentFormError();
};

const getFormData = () => {
  const title = document.getElementById("assessmentTitle").value.trim();
  const type = document.getElementById("assessmentType").value;
  const course = document.getElementById("assessmentCourse").value;
  const totalValue = document.getElementById("totalMarks").value;
  const obtainedInput = document.getElementById("obtainedMarks");
  const statusInput = document.getElementById("assessmentStatus");
  const deadline = document.getElementById("assessmentDeadline").value;

  if (!title) throw new Error(translate("enterAssessmentTitle"));
  if (!type) throw new Error(translate("selectAssessmentType"));
  if (!course) throw new Error(translate("selectAssessmentCourse"));

  if (
    totalValue === "" ||
    !Number.isFinite(Number(totalValue)) ||
    Number(totalValue) <= 0
  ) {
    throw new Error(translate("invalidTotalMarks"));
  }

  if (!deadline) throw new Error(translate("selectAssessmentDeadline"));

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    throw new Error(translate("invalidAssessmentDeadline"));
  }

  if (date.getTime() <= Date.now()) {
    throw new Error(translate("assessmentDeadlineError"));
  }

  const totalMarks = Number(totalValue);

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

  if (
    obtainedInput.value === "" ||
    !Number.isFinite(Number(obtainedInput.value))
  ) {
    throw new Error(translate("invalidObtainedMarks"));
  }

  const obtainedMarks = Number(obtainedInput.value);

  if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
    throw new Error(translate("invalidObtainedMarks"));
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

const saveAssessment = async (event) => {
  event.preventDefault();

  const saveButton = document.getElementById("saveAssessmentBtn");
  if (!saveButton) return;

  // Preserve this value because closing the modal clears editingAssessmentId.
  const isEditing = Boolean(editingAssessmentId);
  const assessmentId = editingAssessmentId;

  try {
    if (isEditing) {
      const current = findAssessmentById(assessmentId);

      if (!current || isDeadlinePassed(current.deadline)) {
        throw new Error(translate("assessmentDeadlinePassedLocked"));
      }
    }

    const data = getFormData();
    clearAssessmentFormError();

    saveButton.disabled = true;
    saveButton.textContent = translate(isEditing ? "saving" : "adding");

    if (isEditing) {
      await api.patch(
        `/assessments/${encodeURIComponent(assessmentId)}`,
        data
      );
    } else {
      await api.post("/assessments", data);
    }

    closeAssessmentModal();
    await loadData();
  } catch (error) {
    console.error("Save assessment error:", error);
    showAssessmentFormError(
      error.message || translate("saveAssessmentFailed")
    );
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = translate(
      isEditing ? "saveChanges" : "saveAssessment"
    );
  }
};

const openEditAssessment = (id) => {
  const assessment = findAssessmentById(id);

  if (!assessment) {
    console.error("Assessment not found:", id);
    return;
  }

  if (isDeadlinePassed(assessment.deadline)) {
    alert(translate("assessmentDeadlinePassedLocked"));
    return;
  }

  openAssessmentModal(assessment);
};

const openDeleteModal = (id) => {
  const assessment = findAssessmentById(id);

  if (!assessment) {
    console.error("Assessment not found:", id);
    return;
  }

  const modal = document.getElementById("deleteModal");
  const name = document.getElementById("deleteAssessmentName");

  if (!modal || !name) {
    console.error("Delete modal elements are missing.");
    return;
  }

  deletingAssessment = assessment;
  name.textContent = assessment.title || "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
};

const closeDeleteModal = () => {
  const modal = document.getElementById("deleteModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  deletingAssessment = null;
};

const confirmDeleteAssessment = async () => {
  if (!deletingAssessment) return;

  const id = getItemId(deletingAssessment);

  if (!id) {
    alert(translate("assessmentUnableToIdentify"));
    return;
  }

  const button = document.getElementById("confirmDeleteBtn");
  if (!button) return;

  try {
    button.disabled = true;
    button.textContent = translate("deleting");

    await api.delete(`/assessments/${encodeURIComponent(id)}`);

    closeDeleteModal();
    await loadData();
  } catch (error) {
    console.error("Delete assessment error:", error);
    alert(error.message || translate("deleteAssessmentFailed"));
  } finally {
    button.disabled = false;
    button.textContent = translate("deleteAssessment");
  }
};

const loadData = async () => {
  const list = document.getElementById("assessmentsList");
  if (!list) return;

  list.innerHTML = `
    <div class="assessments-loading">
      ${escapeHtml(translate("loadingAssessments"))}
    </div>
  `;

  try {
    const [loadedCourses, loadedAssessments] = await Promise.all([
      getCourses(),
      getAssessments(),
    ]);

    courses = loadedCourses;
    assessments = loadedAssessments;

    populateCourses();
    renderAssessments();
  } catch (error) {
    console.error("Assessments loading error:", error);

    list.innerHTML = `
      <div class="assessments-empty">
        <strong>${escapeHtml(translate("unableToLoadAssessments"))}</strong>
        <span>${escapeHtml(
          error.message || translate("checkBackend")
        )}</span>
      </div>
    `;
  }
};

const refreshAssessmentTranslations = () => {
  updateAssessmentFilters();
  populateCourses();
  renderAssessments();

  const modal = document.getElementById("assessmentModal");

  if (modal && !modal.classList.contains("hidden")) {
    const title = document.getElementById("modalTitle");
    const saveButton = document.getElementById("saveAssessmentBtn");

    if (title) {
      title.textContent = translate(
        editingAssessmentId ? "editAssessment" : "addAssessment"
      );
    }

    if (saveButton && !saveButton.disabled) {
      saveButton.textContent = translate(
        editingAssessmentId ? "saveChanges" : "saveAssessment"
      );
    }
  }

  const deleteButton = document.getElementById("confirmDeleteBtn");

  if (deleteButton && !deleteButton.disabled) {
    deleteButton.textContent = translate("deleteAssessment");
  }
};

const initializeAssessments = () => {
  const addButton = document.getElementById("addAssessmentBtn");
  const closeButton = document.getElementById("closeModalBtn");
  const cancelButton = document.getElementById("cancelAssessmentBtn");
  const confirmDeleteButton = document.getElementById("confirmDeleteBtn");
  const cancelDeleteButton = document.getElementById("cancelDeleteBtn");
  const form = document.getElementById("assessmentForm");
  const list = document.getElementById("assessmentsList");
  const assessmentModal = document.getElementById("assessmentModal");
  const deleteModal = document.getElementById("deleteModal");

  if (
    !addButton || !closeButton || !cancelButton ||
    !confirmDeleteButton || !cancelDeleteButton || !form ||
    !list || !assessmentModal || !deleteModal
  ) {
    console.error("Assessment page elements are missing.");
    return;
  }

  addButton.addEventListener("click", () => openAssessmentModal());
  closeButton.addEventListener("click", closeAssessmentModal);
  cancelButton.addEventListener("click", closeAssessmentModal);
  confirmDeleteButton.addEventListener("click", confirmDeleteAssessment);
  cancelDeleteButton.addEventListener("click", closeDeleteModal);
  form.addEventListener("submit", saveAssessment);

  list.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-action][data-assessment-id]"
    );

    if (!button || button.disabled) return;

    const { action, assessmentId: id } = button.dataset;
    if (!id) return;

    if (action === "edit") openEditAssessment(id);
    if (action === "delete") openDeleteModal(id);
  });

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      currentFilter = button.dataset.filter || "All";
      renderAssessments();
    });
  });

  assessmentModal.addEventListener("click", (event) => {
    if (event.target === assessmentModal) closeAssessmentModal();
  });

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) closeDeleteModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAssessmentModal();
      closeDeleteModal();
    }
  });

  document.addEventListener(
    "languageChanged",
    refreshAssessmentTranslations
  );

  updateAssessmentFilters();
  loadData();
};

document.addEventListener("DOMContentLoaded", initializeAssessments);