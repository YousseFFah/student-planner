
let tasks = [];
let courses = [];
let editingTaskId = null;
let deletingTask = null;
let currentFilter = "All";

const taskText = (key) =>
  typeof window.t === "function" ? window.t(key) : key;

const taskTranslate = (key, values = {}) => {
  let result = taskText(key);

  Object.entries(values).forEach(([name, value]) => {
    result = result.replaceAll(`{${name}}`, String(value));
  });

  return result;
};

const translateTaskError = (error, fallbackKey) => {
  const message = String(error?.message || "");
  const normalized = message.toLowerCase();

  if (
    normalized.includes("task not found") ||
    normalized.includes("no task found")
  ) {
    return taskText("taskNotFound");
  }

  if (
    normalized.includes("deadline") &&
    (normalized.includes("passed") ||
      normalized.includes("future") ||
      normalized.includes("expired"))
  ) {
    return taskText("taskDeadlineError");
  }

  return message || taskText(fallbackKey);
};

const escapeHtml = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

const getItemId = (item) => {
  if (!item) return "";
  return item._id || item.id || "";
};

const getCourses = async () => {
  const data = await api.get("/courses");

  if (Array.isArray(data)) return data;
  return Array.isArray(data.courses) ? data.courses : [];
};

const getTasks = async () => {
  const data = await api.get("/tasks");

  if (Array.isArray(data)) return data;
  return Array.isArray(data.tasks) ? data.tasks : [];
};

const getCourseName = (task) => {
  if (!task?.course) return taskText("noCourse");

  if (typeof task.course === "string") {
    const course = courses.find(
      (item) => String(getItemId(item)) === String(task.course)
    );

    return course
      ? `${course.name} (${course.code})`
      : taskText("noCourse");
  }

  return task.course.name || task.course.code || taskText("noCourse");
};

const getCourseId = (task) => {
  if (!task?.course) return "";
  if (typeof task.course === "string") return task.course;
  return getItemId(task.course);
};

const translateTaskStatus = (status) => {
  const statusKeys = {
    Pending: "pending",
    "In Progress": "inProgress",
    Completed: "completed",
  };

  return taskText(statusKeys[status] || status);
};

const translateTaskType = (type) => {
  const typeKeys = {
    Assignment: "assignment",
    Homework: "homework",
    Project: "project",
    Study: "study",
    Exam: "exam",
    Quiz: "quiz",
    Other: "other",
  };

  return taskText(typeKeys[type] || type || "other");
};

const formatDate = (value) => {
  if (!value) return taskText("noDeadline");

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return taskText("invalidDate");
  }

  const language =
    typeof window.getLanguage === "function"
      ? window.getLanguage()
      : "en";

  return date.toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const language =
    typeof window.getLanguage === "function"
      ? window.getLanguage()
      : "en";

  return date.toLocaleTimeString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
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

const getDeadlineText = (task) => {
  const date = formatDate(task.deadline);
  const time = formatTime(task.deadline);

  return time ? `${date} · ${time}` : date;
};

const getStatusClass = (status) => {
  if (status === "Completed") return "completed";
  if (status === "In Progress") return "in-progress";
  return "";
};

const populateCourses = () => {
  const courseSelect = document.getElementById("taskCourse");

  if (!courseSelect) return;

  const selectedValue = courseSelect.value;

  courseSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = taskText("selectCourse");
  courseSelect.appendChild(defaultOption);

  courses.forEach((course) => {
    const id = getItemId(course);

    if (!id) return;

    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${course.name} (${course.code})`;

    courseSelect.appendChild(option);
  });

  if ([...courseSelect.options].some((option) => option.value === selectedValue)) {
    courseSelect.value = selectedValue;
  }
};

const renderTasks = () => {
  const tasksList = document.getElementById("tasksList");
  const taskCount = document.getElementById("taskCount");

  if (!tasksList) return;

  let visibleTasks = [...tasks];

  if (currentFilter !== "All") {
    visibleTasks = visibleTasks.filter(
      (task) => task.status === currentFilter
    );
  }

  visibleTasks.sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;

    return dateA - dateB;
  });

  if (taskCount) {
    const countKey = tasks.length === 1 ? "taskCountSingular" : "taskCount";

    taskCount.textContent = taskTranslate(countKey, {
      count: tasks.length,
    });
  }

  if (visibleTasks.length === 0) {
    const title =
      currentFilter === "All"
        ? taskText("noTasks")
        : taskTranslate("noTasksInCategory", {
            status: translateTaskStatus(currentFilter),
          });

    const description =
      currentFilter === "All"
        ? taskText("noTasksDescription")
        : taskText("noTasksInCategoryDescription");

    tasksList.innerHTML = `
      <div class="tasks-empty">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </div>
    `;

    return;
  }

  tasksList.innerHTML = visibleTasks.map((task) => {
    const id = getItemId(task);
    const statusClass = getStatusClass(task.status);
    const deadlineState = getDeadlineState(task.deadline, task.status);
    const locked = isDeadlinePassed(task.deadline);
    const overdue = locked && task.status !== "Completed";

    const description =
      typeof task.description === "string"
        ? task.description.trim()
        : "";

    return `
      <article
        class="task-item ${statusClass} ${overdue ? "overdue" : ""} ${locked ? "locked" : ""}"
        data-task-id="${escapeHtml(id)}"
      >
        <div class="task-status-dot ${statusClass}"></div>

        <div class="task-main">
          <div class="task-title-row">
            <p class="task-title">${escapeHtml(task.title)}</p>
            <span class="task-type">${escapeHtml(
              translateTaskType(task.type)
            )}</span>
          </div>

          <div class="task-meta">
            <span>${escapeHtml(getCourseName(task))}</span>
            <span class="task-meta-separator">•</span>
            <span>${escapeHtml(translateTaskStatus(task.status))}</span>
          </div>

          ${
            description
              ? `<p class="task-description">${escapeHtml(description)}</p>`
              : ""
          }

          ${
            overdue
              ? `<p class="task-overdue-message">
                  ${escapeHtml(taskText("taskDeadlinePassedLocked"))}
                </p>`
              : ""
          }
        </div>

        <div class="task-deadline ${deadlineState}">
          ${escapeHtml(getDeadlineText(task))}
        </div>

        <div class="task-actions">
          <button
            type="button"
            class="task-action-btn edit"
            data-action="edit"
            data-task-id="${escapeHtml(id)}"
            ${locked ? "disabled" : ""}
            title="${escapeHtml(
              locked ? taskText("deadlinePassed") : taskText("editTask")
            )}"
          >
            ${escapeHtml(locked ? taskText("locked") : taskText("edit"))}
          </button>

          <button
            type="button"
            class="task-action-btn delete"
            data-action="delete"
            data-task-id="${escapeHtml(id)}"
          >
            ${escapeHtml(taskText("delete"))}
          </button>
        </div>
      </article>
    `;
  }).join("");
};

const openTaskModal = (task = null) => {
  const modal = document.getElementById("taskModal");
  const titleInput = document.getElementById("taskTitle");
  const typeInput = document.getElementById("taskType");
  const courseInput = document.getElementById("taskCourse");
  const deadlineInput = document.getElementById("taskDeadline");
  const statusInput = document.getElementById("taskStatus");
  const statusGroup = document.getElementById("taskStatusGroup");
  const descriptionInput = document.getElementById("taskDescription");
  const modalTitle = document.getElementById("modalTitle");
  const saveButton = document.getElementById("saveTaskBtn");
  const errorBox = document.getElementById("taskFormError");

  if (
    !modal || !titleInput || !typeInput || !courseInput ||
    !deadlineInput || !statusInput || !statusGroup ||
    !descriptionInput || !modalTitle || !saveButton || !errorBox
  ) {
    console.error("Task modal elements are missing.");
    return;
  }

  if (task && isDeadlinePassed(task.deadline)) {
    alert(taskText("taskDeadlineError"));
    return;
  }

  populateCourses();

  titleInput.value = "";
  typeInput.value = "";
  courseInput.value = "";
  deadlineInput.value = "";
  statusInput.value = "Pending";
  descriptionInput.value = "";

  errorBox.textContent = "";
  errorBox.classList.remove("visible");

  if (!task) {
    editingTaskId = null;
    modalTitle.textContent = taskText("addTask");
    saveButton.textContent = taskText("saveTask");

    statusGroup.classList.add("hidden");
    statusInput.required = false;
    statusInput.value = "Pending";
  } else {
    editingTaskId = getItemId(task);

    modalTitle.textContent = taskText("editTask");
    saveButton.textContent = taskText("saveChanges");

    statusGroup.classList.remove("hidden");
    statusInput.required = true;

    titleInput.value = task.title || "";
    typeInput.value = task.type || "";
    courseInput.value = getCourseId(task);
    statusInput.value = task.status || "Pending";
    descriptionInput.value = task.description || "";

    if (task.deadline) {
      const date = new Date(task.deadline);

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

const closeTaskModal = () => {
  const modal = document.getElementById("taskModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  editingTaskId = null;
};

const getFormData = () => {
  const title = document.getElementById("taskTitle").value.trim();
  const type = document.getElementById("taskType").value;
  const course = document.getElementById("taskCourse").value;
  const deadline = document.getElementById("taskDeadline").value;
  const statusInput = document.getElementById("taskStatus");
  const status = statusInput ? statusInput.value : "Pending";
  const description = document.getElementById("taskDescription").value.trim();

  if (!title) throw new Error(taskText("enterTaskTitle"));
  if (!type) throw new Error(taskText("selectTaskType"));
  if (!course) throw new Error(taskText("selectCourseError"));
  if (!deadline) throw new Error(taskText("selectDeadline"));

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    throw new Error(taskText("invalidDeadline"));
  }

  if (date.getTime() <= Date.now()) {
    throw new Error(taskText("taskDeadlineError"));
  }

  return {
    title,
    type,
    course,
    deadline: date.toISOString(),
    status: editingTaskId ? status : "Pending",
    description,
  };
};

const saveTask = async (event) => {
  event.preventDefault();

  const saveButton = document.getElementById("saveTaskBtn");
  const errorBox = document.getElementById("taskFormError");

  if (!saveButton || !errorBox) return;

  const isEditing = Boolean(editingTaskId);

  try {
    if (isEditing) {
      const currentTask = findTaskById(editingTaskId);

      if (!currentTask || isDeadlinePassed(currentTask.deadline)) {
        throw new Error(taskText("taskDeadlineError"));
      }
    }

    const data = getFormData();

    errorBox.textContent = "";
    errorBox.classList.remove("visible");

    saveButton.disabled = true;
    saveButton.textContent = taskText(isEditing ? "saving" : "adding");

    if (isEditing) {
      await api.patch(`/tasks/${encodeURIComponent(editingTaskId)}`, data);
    } else {
      await api.post("/tasks", data);
    }

    closeTaskModal();
    await loadData();
  } catch (error) {
    console.error("Save task error:", error);

    errorBox.textContent = translateTaskError(error, "saveTaskFailed");
    errorBox.classList.add("visible");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = taskText(isEditing ? "saveChanges" : "saveTask");
  }
};

const findTaskById = (id) => {
  return tasks.find(
    (task) => String(getItemId(task)) === String(id)
  );
};

const openEditTask = (id) => {
  const task = findTaskById(id);

  if (!task) {
    console.error("Task not found:", id, tasks);
    alert(taskText("taskNotFound"));
    return;
  }

  if (isDeadlinePassed(task.deadline)) {
    alert(taskText("taskDeadlineError"));
    return;
  }

  openTaskModal(task);
};

const openDeleteModal = (id) => {
  const task = findTaskById(id);

  if (!task) {
    console.error("Task not found:", id, tasks);
    alert(taskText("taskNotFound"));
    return;
  }

  const modal = document.getElementById("deleteModal");
  const taskName = document.getElementById("deleteTaskName");

  if (!modal || !taskName) {
    console.error("Delete modal elements are missing.");
    return;
  }

  deletingTask = task;
  taskName.textContent = task.title;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
};

const closeDeleteModal = () => {
  const modal = document.getElementById("deleteModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  deletingTask = null;
};

const confirmDeleteTask = async () => {
  if (!deletingTask) return;

  const id = getItemId(deletingTask);

  if (!id) {
    alert(taskText("identifyTaskError"));
    return;
  }

  const button = document.getElementById("confirmDeleteBtn");

  if (!button) return;

  try {
    button.disabled = true;
    button.textContent = taskText("deleting");

    await api.delete(`/tasks/${encodeURIComponent(id)}`);

    closeDeleteModal();
    await loadData();
  } catch (error) {
    console.error("Delete task error:", error);

    alert(translateTaskError(error, "deleteTaskFailed"));
  } finally {
    button.disabled = false;
    button.textContent = taskText("delete");
  }
};

const loadData = async () => {
  const tasksList = document.getElementById("tasksList");

  if (!tasksList) return;

  tasksList.innerHTML = `
    <div class="tasks-loading">${escapeHtml(taskText("loadingTasks"))}</div>
  `;

  try {
    const [loadedCourses, loadedTasks] = await Promise.all([
      getCourses(),
      getTasks(),
    ]);

    courses = loadedCourses;
    tasks = loadedTasks;

    populateCourses();
    renderTasks();
  } catch (error) {
    console.error("Tasks loading error:", error);

    tasksList.innerHTML = `
      <div class="tasks-empty">
        <strong>${escapeHtml(taskText("unableToLoadTasks"))}</strong>
        <span>${escapeHtml(
          error.message || taskText("checkBackend")
        )}</span>
      </div>
    `;
  }
};

const updateTaskModalTexts = () => {
  const modal = document.getElementById("taskModal");

  if (!modal || modal.classList.contains("hidden")) return;

  const modalTitle = document.getElementById("modalTitle");
  const saveButton = document.getElementById("saveTaskBtn");

  if (modalTitle) {
    modalTitle.textContent = taskText(editingTaskId ? "editTask" : "addTask");
  }

  if (saveButton && !saveButton.disabled) {
    saveButton.textContent = taskText(
      editingTaskId ? "saveChanges" : "saveTask"
    );
  }

  populateCourses();
};

const initializeTasks = () => {
  const taskForm = document.getElementById("taskForm");
  const taskModal = document.getElementById("taskModal");
  const deleteModal = document.getElementById("deleteModal");

  if (!taskForm || !taskModal || !deleteModal) {
    console.error("Task page elements are missing.");
    return;
  }

  taskForm.addEventListener("submit", saveTask);

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("#addTaskBtn");

    if (addButton) {
      event.preventDefault();
      openTaskModal();
      return;
    }

    const editButton = event.target.closest(
      '[data-action="edit"][data-task-id]'
    );

    if (editButton) {
      event.preventDefault();

      if (editButton.dataset.taskId) {
        openEditTask(editButton.dataset.taskId);
      }

      return;
    }

    const deleteButton = event.target.closest(
      '[data-action="delete"][data-task-id]'
    );

    if (deleteButton) {
      event.preventDefault();

      if (deleteButton.dataset.taskId) {
        openDeleteModal(deleteButton.dataset.taskId);
      }

      return;
    }

    if (event.target.closest("#closeModalBtn")) {
      event.preventDefault();
      closeTaskModal();
      return;
    }

    if (event.target.closest("#cancelTaskBtn")) {
      event.preventDefault();
      closeTaskModal();
      return;
    }

    if (event.target.closest("#cancelDeleteBtn")) {
      event.preventDefault();
      closeDeleteModal();
      return;
    }

    if (event.target.closest("#confirmDeleteBtn")) {
      event.preventDefault();
      confirmDeleteTask();
      return;
    }

    const filterButton = event.target.closest(".filter-btn");

    if (filterButton) {
      event.preventDefault();

      document.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.remove("active");
      });

      filterButton.classList.add("active");
      currentFilter = filterButton.dataset.filter || "All";

      renderTasks();
    }
  });

  taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) closeTaskModal();
  });

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) closeDeleteModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeTaskModal();
    closeDeleteModal();
  });

  document.addEventListener("languageChanged", () => {
    renderTasks();
    populateCourses();
    updateTaskModalTexts();

    const deleteButton = document.getElementById("confirmDeleteBtn");

    if (deleteButton && !deleteButton.disabled) {
      deleteButton.textContent = taskText("delete");
    }
  });

  loadData();
};

document.addEventListener("DOMContentLoaded", initializeTasks);