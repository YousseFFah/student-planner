
let editingCourseCode = null;
let deletingCourse = null;
let currentCourses = [];

const courseModal = document.getElementById("courseModal");
const deleteModal = document.getElementById("deleteModal");

const courseForm = document.getElementById("courseForm");
const courseFormError = document.getElementById("courseFormError");
const modalTitle = document.getElementById("modalTitle");

const courseNameInput = document.getElementById("courseName");
const courseCodeInput = document.getElementById("courseCode");
const instructorInput = document.getElementById("instructor");
const creditHoursInput = document.getElementById("creditHours");

const coursesGrid = document.getElementById("coursesGrid");
const courseCount = document.getElementById("courseCount");

const addCourseBtn = document.getElementById("addCourseBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelCourseBtn = document.getElementById("cancelCourseBtn");
const saveCourseBtn = document.getElementById("saveCourseBtn");

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteCourseName = document.getElementById("deleteCourseName");

const translateKey = (key) => {
  return typeof window.t === "function" ? window.t(key) : key;
};

const translate = (key, values = {}) => {
  let result = translateKey(key);

  Object.entries(values).forEach(([name, value]) => {
    result = result.replaceAll(`{${name}}`, String(value));
  });

  return result;
};

const translateError = (error, fallbackKey) => {
  const message = String(error?.message || "");
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("course already exists") ||
    normalizedMessage.includes("course with this code already exists") ||
    normalizedMessage.includes("duplicate key") ||
    normalizedMessage.includes("e11000")
  ) {
    return translateKey("courseAlreadyExists");
  }

  return message || translateKey(fallbackKey);
};

const escapeHtml = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

const getCourses = async () => {
  const data = await api.get("/courses");

  if (Array.isArray(data)) {
    return data;
  }

  return data.courses || [];
};

const updateCourseModalTexts = () => {
  modalTitle.textContent = translateKey(
    editingCourseCode ? "editCourse" : "addCourse"
  );

  if (!saveCourseBtn.disabled) {
    saveCourseBtn.textContent = translateKey(
      editingCourseCode ? "saveChanges" : "saveCourse"
    );
  }
};

const updateDeleteButtonText = () => {
  if (!confirmDeleteBtn.disabled) {
    confirmDeleteBtn.textContent = translateKey("deleteCourse");
  }
};

const openCourseModal = (course = null) => {
  courseForm.reset();

  courseFormError.textContent = "";
  courseFormError.classList.remove("visible");

  if (course) {
    editingCourseCode = course.code;

    courseNameInput.value = course.name || "";
    courseCodeInput.value = course.code || "";
    instructorInput.value = course.instructor || "";
    creditHoursInput.value = course.creditHours ?? "";

    courseCodeInput.disabled = true;
  } else {
    editingCourseCode = null;
    courseCodeInput.disabled = false;
  }

  updateCourseModalTexts();

  courseModal.classList.remove("hidden");
  courseModal.setAttribute("aria-hidden", "false");

  setTimeout(() => courseNameInput.focus(), 50);
};

const closeCourseModal = () => {
  courseModal.classList.add("hidden");
  courseModal.setAttribute("aria-hidden", "true");

  editingCourseCode = null;
  courseForm.reset();
  courseCodeInput.disabled = false;

  courseFormError.textContent = "";
  courseFormError.classList.remove("visible");
};

const showCourseError = (message) => {
  courseFormError.textContent = message;
  courseFormError.classList.add("visible");
};

const renderCourses = (courses) => {
  currentCourses = Array.isArray(courses) ? courses : [];

  if (currentCourses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="courses-empty">
        <strong>${escapeHtml(translateKey("noCourses"))}</strong>
        <span>${escapeHtml(translateKey("noCoursesDescription"))}</span>
      </div>
    `;

    courseCount.textContent = translate("courseCount", { count: 0 });
    return;
  }

  const countKey =
    currentCourses.length === 1
      ? "courseCountSingular"
      : "courseCount";

  courseCount.textContent = translate(countKey, {
    count: currentCourses.length,
  });

  coursesGrid.innerHTML = currentCourses
    .map((course) => {
      const creditHoursLabel =
        Number(course.creditHours) === 1
          ? translateKey("creditHour")
          : translateKey("creditHoursPlural");

      return `
        <article class="course-card">
          <div class="course-card-top">
            <span class="course-code">
              ${escapeHtml(course.code)}
            </span>

            <div class="course-actions">
              <button
                class="course-action-btn edit"
                type="button"
                data-action="edit"
                data-code="${escapeHtml(course.code)}"
                title="${escapeHtml(translateKey("editCourseTitle"))}"
                aria-label="${escapeHtml(translateKey("editCourseTitle"))}"
              >✎</button>

              <button
                class="course-action-btn delete"
                type="button"
                data-action="delete"
                data-code="${escapeHtml(course.code)}"
                title="${escapeHtml(translateKey("deleteCourseTitleLabel"))}"
                aria-label="${escapeHtml(translateKey("deleteCourseTitleLabel"))}"
              >×</button>
            </div>
          </div>

          <h3 title="${escapeHtml(course.name)}">
            ${escapeHtml(course.name)}
          </h3>

          <p class="course-instructor">
            ${escapeHtml(course.instructor)}
          </p>

          <div class="course-card-footer">
            <span class="course-credit">
              <strong>${escapeHtml(course.creditHours)}</strong>
              ${escapeHtml(creditHoursLabel)}
            </span>

            <span class="course-open">
              ${escapeHtml(translateKey("course"))}
            </span>
          </div>
        </article>
      `;
    })
    .join("");
};

const loadCourses = async () => {
  coursesGrid.innerHTML = `
    <div class="courses-loading">
      ${escapeHtml(translateKey("loadingCourses"))}
    </div>
  `;

  try {
    const courses = await getCourses();
    renderCourses(courses);
  } catch (error) {
    console.error("Courses error:", error);

    coursesGrid.innerHTML = `
      <div class="courses-empty">
        <strong>${escapeHtml(translateKey("unableToLoadCourses"))}</strong>
        <span>${escapeHtml(
          error.message || translateKey("checkBackend")
        )}</span>
      </div>
    `;
  }
};

const getFormData = () => {
  const name = courseNameInput.value.trim();
  const code = courseCodeInput.value.trim();
  const instructor = instructorInput.value.trim();
  const creditHoursValue = creditHoursInput.value.trim();
  const creditHours = Number(creditHoursValue);

  if (!name || !code || !instructor || !creditHoursValue) {
    throw new Error(translateKey("fillCourseFields"));
  }

  if (
    !Number.isInteger(creditHours) ||
    creditHours < 1 ||
    creditHours > 20
  ) {
    throw new Error(translateKey("invalidCreditHours"));
  }

  return { name, code, instructor, creditHours };
};

const saveCourse = async (event) => {
  event.preventDefault();

  courseFormError.textContent = "";
  courseFormError.classList.remove("visible");

  let formData;

  try {
    formData = getFormData();
  } catch (error) {
    showCourseError(error.message);
    return;
  }

  saveCourseBtn.disabled = true;

  saveCourseBtn.textContent = translateKey(
    editingCourseCode ? "saving" : "adding"
  );

  try {
    if (editingCourseCode) {
      await api.patch(
        `/courses/${encodeURIComponent(editingCourseCode)}`,
        {
          name: formData.name,
          instructor: formData.instructor,
          creditHours: formData.creditHours,
        }
      );
    } else {
      await api.post("/courses", formData);
    }

    closeCourseModal();
    await loadCourses();
  } catch (error) {
    console.error("Save course error:", error);

    showCourseError(translateError(error, "saveCourseFailed"));
  } finally {
    saveCourseBtn.disabled = false;
    updateCourseModalTexts();
  }
};

const findCourseByCode = async (code) => {
  const courses = await getCourses();
  return courses.find((course) => course.code === code);
};

const openEditCourse = async (code) => {
  try {
    const course = await findCourseByCode(code);

    if (!course) {
      throw new Error(translateKey("courseNotFound"));
    }

    openCourseModal(course);
  } catch (error) {
    console.error("Find course error:", error);
    alert(error.message || translateKey("courseNotFound"));
  }
};

const openDeleteModal = async (code) => {
  try {
    const course = await findCourseByCode(code);

    if (!course) {
      throw new Error(translateKey("courseNotFound"));
    }

    deletingCourse = course;
    deleteCourseName.textContent = `${course.name} (${course.code})`;

    updateDeleteButtonText();

    deleteModal.classList.remove("hidden");
    deleteModal.setAttribute("aria-hidden", "false");
  } catch (error) {
    console.error("Delete course error:", error);
    alert(error.message || translateKey("courseNotFound"));
  }
};

const closeDeleteModal = () => {
  deleteModal.classList.add("hidden");
  deleteModal.setAttribute("aria-hidden", "true");
  deletingCourse = null;
};

const deleteCourse = async () => {
  if (!deletingCourse) {
    return;
  }

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = translateKey("deleting");

  try {
    await api.delete(
      `/courses/${encodeURIComponent(deletingCourse.code)}`
    );

    closeDeleteModal();
    await loadCourses();
  } catch (error) {
    console.error("Delete course error:", error);
    alert(translateError(error, "deleteCourseFailed"));
  } finally {
    confirmDeleteBtn.disabled = false;
    updateDeleteButtonText();
  }
};

coursesGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action, code } = button.dataset;

  if (action === "edit") {
    openEditCourse(code);
  }

  if (action === "delete") {
    openDeleteModal(code);
  }
});

addCourseBtn.addEventListener("click", () => openCourseModal());

closeModalBtn.addEventListener("click", closeCourseModal);
cancelCourseBtn.addEventListener("click", closeCourseModal);
cancelDeleteBtn.addEventListener("click", closeDeleteModal);
confirmDeleteBtn.addEventListener("click", deleteCourse);
courseForm.addEventListener("submit", saveCourse);

courseModal.addEventListener("click", (event) => {
  if (event.target === courseModal) {
    closeCourseModal();
  }
});

deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!courseModal.classList.contains("hidden")) {
    closeCourseModal();
  }

  if (!deleteModal.classList.contains("hidden")) {
    closeDeleteModal();
  }
});

document.addEventListener("languageChanged", () => {
  renderCourses(currentCourses);

  if (!courseModal.classList.contains("hidden")) {
    updateCourseModalTexts();
  }

  updateDeleteButtonText();

  if (deletingCourse) {
    deleteCourseName.textContent =
      `${deletingCourse.name} (${deletingCourse.code})`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadCourses();
});