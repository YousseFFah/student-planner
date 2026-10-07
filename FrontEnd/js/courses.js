let editingCourseCode = null;
let deletingCourse = null;

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

const openCourseModal = (course = null) => {
  courseForm.reset();

  courseFormError.textContent = "";
  courseFormError.classList.remove("visible");

  if (course) {
    editingCourseCode = course.code;

    modalTitle.textContent = "Edit Course";
    saveCourseBtn.textContent = "Save Changes";

    courseNameInput.value = course.name || "";
    courseCodeInput.value = course.code || "";
    instructorInput.value = course.instructor || "";
    creditHoursInput.value = course.creditHours ?? "";

    courseCodeInput.disabled = true;
  } else {
    editingCourseCode = null;

    modalTitle.textContent = "Add Course";
    saveCourseBtn.textContent = "Save Course";

    courseCodeInput.disabled = false;
  }

  courseModal.classList.remove("hidden");
  courseModal.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    courseNameInput.focus();
  }, 50);
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
  if (!Array.isArray(courses) || courses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="courses-empty">
        <strong>No courses yet</strong>
        <span>Add your first course to start planning your semester.</span>
      </div>
    `;

    courseCount.textContent = "0 Courses";

    return;
  }

  courseCount.textContent =
    courses.length === 1
      ? "1 Course"
      : `${courses.length} Courses`;

  coursesGrid.innerHTML = courses
    .map((course) => {
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
                title="Edit course"
              >
                ✎
              </button>

              <button
                class="course-action-btn delete"
                type="button"
                data-action="delete"
                data-code="${escapeHtml(course.code)}"
                title="Delete course"
              >
                ×
              </button>

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
              <strong>${course.creditHours}</strong>
              ${
                Number(course.creditHours) === 1
                  ? "Credit Hour"
                  : "Credit Hours"
              }
            </span>

            <span class="course-open">
              Course
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
      Loading courses...
    </div>
  `;

  try {
    const courses = await getCourses();

    renderCourses(courses);
  } catch (error) {
    console.error("Courses error:", error);

    coursesGrid.innerHTML = `
      <div class="courses-empty">
        <strong>Unable to load courses</strong>
        <span>${escapeHtml(error.message)}</span>
      </div>
    `;
  }
};

const getFormData = () => {
  const name = courseNameInput.value.trim();
  const code = courseCodeInput.value.trim();
  const instructor = instructorInput.value.trim();
  const creditHours = Number(creditHoursInput.value);

  if (!name || !code || !instructor || !creditHours) {
    throw new Error("Please fill in all course fields.");
  }

  if (creditHours < 1 || creditHours > 20) {
    throw new Error("Credit hours must be between 1 and 20.");
  }

  return {
    name,
    code,
    instructor,
    creditHours,
  };
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

  const originalText = saveCourseBtn.textContent;

  saveCourseBtn.textContent = editingCourseCode
    ? "Saving..."
    : "Adding...";

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

    showCourseError(error.message);
  } finally {
    saveCourseBtn.disabled = false;
    saveCourseBtn.textContent = originalText;
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
      throw new Error("Course not found.");
    }

    openCourseModal(course);
  } catch (error) {
    console.error("Find course error:", error);

    alert(error.message);
  }
};

const openDeleteModal = async (code) => {
  try {
    const course = await findCourseByCode(code);

    if (!course) {
      throw new Error("Course not found.");
    }

    deletingCourse = course;

    deleteCourseName.textContent =
      `${course.name} (${course.code})`;

    deleteModal.classList.remove("hidden");
    deleteModal.setAttribute("aria-hidden", "false");
  } catch (error) {
    console.error("Delete course error:", error);

    alert(error.message);
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

  const originalText = confirmDeleteBtn.textContent;

  confirmDeleteBtn.textContent = "Deleting...";

  try {
    await api.delete(
      `/courses/${encodeURIComponent(deletingCourse.code)}`
    );

    closeDeleteModal();

    await loadCourses();
  } catch (error) {
    console.error("Delete course error:", error);

    alert(error.message);
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = originalText;
  }
};

coursesGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const code = button.dataset.code;

  if (action === "edit") {
    openEditCourse(code);
  }

  if (action === "delete") {
    openDeleteModal(code);
  }
});

addCourseBtn.addEventListener("click", () => {
  openCourseModal();
});

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

document.addEventListener("DOMContentLoaded", () => {
  loadCourses();
});