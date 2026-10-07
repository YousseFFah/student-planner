let tasks = [];
let courses = [];
let editingTaskId = null;
let deletingTask = null;
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

  return Array.isArray(data.courses) ? data.courses : [];
};

const getTasks = async () => {
  const data = await api.get("/tasks");

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.tasks) ? data.tasks : [];
};

const getCourseName = (task) => {
  if (!task?.course) {
    return "No course";
  }

  if (typeof task.course === "string") {
    const course = courses.find(
      (item) =>
        String(getItemId(item)) === String(task.course)
    );

    return course
      ? `${course.name} (${course.code})`
      : "No course";
  }

  return (
    task.course.name ||
    task.course.code ||
    "No course"
  );
};

const getCourseId = (task) => {
  if (!task?.course) {
    return "";
  }

  if (typeof task.course === "string") {
    return task.course;
  }

  return getItemId(task.course);
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

const getDeadlineText = (task) => {
  const date = formatDate(task.deadline);
  const time = formatTime(task.deadline);

  return time ? `${date} · ${time}` : date;
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

const populateCourses = () => {
  const courseSelect =
    document.getElementById("taskCourse");

  if (!courseSelect) {
    return;
  }

  courseSelect.innerHTML =
    '<option value="">Select course</option>';

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

const renderTasks = () => {
  const tasksList =
    document.getElementById("tasksList");

  const taskCount =
    document.getElementById("taskCount");

  if (!tasksList) {
    return;
  }

  let visibleTasks = [...tasks];

  if (currentFilter !== "All") {
    visibleTasks = visibleTasks.filter(
      (task) =>
        task.status === currentFilter
    );
  }

  visibleTasks.sort((a, b) => {
    return (
      new Date(a.deadline).getTime() -
      new Date(b.deadline).getTime()
    );
  });

  if (taskCount) {
    taskCount.textContent =
      tasks.length === 1
        ? "1 Task"
        : `${tasks.length} Tasks`;
  }

  if (visibleTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="tasks-empty">
        <strong>
          ${
            currentFilter === "All"
              ? "No tasks yet"
              : `No ${currentFilter.toLowerCase()} tasks`
          }
        </strong>

        <span>
          ${
            currentFilter === "All"
              ? "Add your first task to start organizing your workload."
              : "There are no tasks in this category."
          }
        </span>
      </div>
    `;

    return;
  }

  tasksList.innerHTML = visibleTasks
    .map((task) => {
      const id = getItemId(task);

      const statusClass =
        getStatusClass(task.status);

      const deadlineState =
        getDeadlineState(
          task.deadline,
          task.status
        );

      const description =
        typeof task.description === "string"
          ? task.description.trim()
          : "";

      return `
        <article
          class="task-item ${statusClass}"
          data-task-id="${escapeHtml(id)}"
        >

          <div class="task-status-dot ${statusClass}"></div>

          <div class="task-main">

            <div class="task-title-row">

              <p class="task-title">
                ${escapeHtml(task.title)}
              </p>

              <span class="task-type">
                ${escapeHtml(task.type)}
              </span>

            </div>

            <div class="task-meta">

              <span>
                ${escapeHtml(
                  getCourseName(task)
                )}
              </span>

              <span class="task-meta-separator">
                •
              </span>

              <span>
                ${escapeHtml(task.status)}
              </span>

            </div>

            ${
              description
                ? `
                  <p class="task-description">
                    ${escapeHtml(description)}
                  </p>
                `
                : ""
            }

          </div>

          <div class="task-deadline ${deadlineState}">
            ${escapeHtml(
              getDeadlineText(task)
            )}
          </div>

          <div class="task-actions">

            <button
              type="button"
              class="task-action-btn edit"
              data-action="edit"
              data-task-id="${escapeHtml(id)}"
            >
              Edit
            </button>

            <button
              type="button"
              class="task-action-btn delete"
              data-action="delete"
              data-task-id="${escapeHtml(id)}"
            >
              Delete
            </button>

          </div>

        </article>
      `;
    })
    .join("");
};

const openTaskModal = (task = null) => {
  const modal =
    document.getElementById("taskModal");

  const titleInput =
    document.getElementById("taskTitle");

  const typeInput =
    document.getElementById("taskType");

  const courseInput =
    document.getElementById("taskCourse");

  const deadlineInput =
    document.getElementById("taskDeadline");

  const statusInput =
    document.getElementById("taskStatus");

  const statusGroup =
    document.getElementById("taskStatusGroup");

  const descriptionInput =
    document.getElementById("taskDescription");

  const modalTitle =
    document.getElementById("modalTitle");

  const saveButton =
    document.getElementById("saveTaskBtn");

  const errorBox =
    document.getElementById("taskFormError");

  if (
    !modal ||
    !titleInput ||
    !typeInput ||
    !courseInput ||
    !deadlineInput ||
    !statusInput ||
    !statusGroup ||
    !descriptionInput ||
    !modalTitle ||
    !saveButton ||
    !errorBox
  ) {
    console.error(
      "Task modal elements are missing."
    );

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

  /*
   * ADD TASK
   */
  if (!task) {
    editingTaskId = null;

    modalTitle.textContent =
      "Add Task";

    saveButton.textContent =
      "Save Task";

    /*
     * New tasks are always Pending.
     * User doesn't need to choose status.
     */
    statusGroup.classList.add("hidden");

    /*
     * Required because the field is hidden
     * and shouldn't participate in validation.
     */
    statusInput.required = false;
    statusInput.value = "Pending";
  }

  /*
   * EDIT TASK
   */
  else {
    editingTaskId = getItemId(task);

    modalTitle.textContent =
      "Edit Task";

    saveButton.textContent =
      "Save Changes";

    /*
     * Show status only while editing.
     */
    statusGroup.classList.remove("hidden");

    statusInput.required = true;

    titleInput.value =
      task.title || "";

    typeInput.value =
      task.type || "";

    courseInput.value =
      getCourseId(task);

    statusInput.value =
      task.status || "Pending";

    descriptionInput.value =
      task.description || "";

    if (task.deadline) {
      const date =
        new Date(task.deadline);

      if (!Number.isNaN(date.getTime())) {
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

  modal.classList.remove("hidden");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  setTimeout(() => {
    titleInput.focus();
  }, 50);
};

const closeTaskModal = () => {
  const modal =
    document.getElementById("taskModal");

  if (!modal) {
    return;
  }

  modal.classList.add("hidden");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  editingTaskId = null;
};

const getFormData = () => {
  const title =
    document
      .getElementById("taskTitle")
      .value
      .trim();

  const type =
    document.getElementById(
      "taskType"
    ).value;

  const course =
    document.getElementById(
      "taskCourse"
    ).value;

  const deadline =
    document.getElementById(
      "taskDeadline"
    ).value;

  const statusInput =
    document.getElementById(
      "taskStatus"
    );

  const status =
    statusInput
      ? statusInput.value
      : "Pending";

  const description =
    document
      .getElementById(
        "taskDescription"
      )
      .value
      .trim();

  if (!title) {
    throw new Error(
      "Please enter a task title."
    );
  }

  if (!type) {
    throw new Error(
      "Please select a task type."
    );
  }

  if (!course) {
    throw new Error(
      "Please select a course."
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

  return {
    title,
    type,
    course,
    deadline: date.toISOString(),

    /*
     * New task = Pending automatically.
     * Edit task = use selected status.
     */
    status: editingTaskId
      ? status
      : "Pending",

    description,
  };
};

const saveTask = async (event) => {
  event.preventDefault();

  const saveButton =
    document.getElementById(
      "saveTaskBtn"
    );

  const errorBox =
    document.getElementById(
      "taskFormError"
    );

  if (!saveButton || !errorBox) {
    return;
  }

  const isEditing =
    Boolean(editingTaskId);

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
        `/tasks/${encodeURIComponent(
          editingTaskId
        )}`,
        data
      );
    } else {
      saveButton.textContent =
        "Adding...";

      await api.post(
        "/tasks",
        data
      );
    }

    closeTaskModal();

    await loadData();

  } catch (error) {
    console.error(
      "Save task error:",
      error
    );

    errorBox.textContent =
      error.message ||
      "Unable to save task.";

    errorBox.classList.add(
      "visible"
    );

  } finally {
    saveButton.disabled = false;

    saveButton.textContent =
      isEditing
        ? "Save Changes"
        : "Save Task";
  }
};

const findTaskById = (id) => {
  return tasks.find(
    (task) =>
      String(
        getItemId(task)
      ) === String(id)
  );
};

const openEditTask = (id) => {
  const task =
    findTaskById(id);

  if (!task) {
    console.error(
      "Task not found:",
      id,
      tasks
    );

    return;
  }

  openTaskModal(task);
};

const openDeleteModal = (id) => {
  const task =
    findTaskById(id);

  if (!task) {
    console.error(
      "Task not found:",
      id,
      tasks
    );

    return;
  }

  const modal =
    document.getElementById(
      "deleteModal"
    );

  const taskName =
    document.getElementById(
      "deleteTaskName"
    );

  if (!modal || !taskName) {
    console.error(
      "Delete modal elements are missing."
    );

    return;
  }

  deletingTask = task;

  taskName.textContent =
    task.title;

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

  deletingTask = null;
};

const confirmDeleteTask = async () => {
  if (!deletingTask) {
    return;
  }

  const id =
    getItemId(deletingTask);

  if (!id) {
    alert(
      "Unable to identify this task."
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
      `/tasks/${encodeURIComponent(id)}`
    );

    closeDeleteModal();

    await loadData();

  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    alert(
      error.message ||
        "Unable to delete task."
    );

  } finally {
    button.disabled = false;

    button.textContent =
      originalText;
  }
};

const loadData = async () => {
  const tasksList =
    document.getElementById(
      "tasksList"
    );

  if (!tasksList) {
    return;
  }

  tasksList.innerHTML = `
    <div class="tasks-loading">
      Loading tasks...
    </div>
  `;

  try {
    const [
      loadedCourses,
      loadedTasks,
    ] = await Promise.all([
      getCourses(),
      getTasks(),
    ]);

    courses =
      loadedCourses;

    tasks =
      loadedTasks;

    populateCourses();

    renderTasks();

  } catch (error) {
    console.error(
      "Tasks loading error:",
      error
    );

    tasksList.innerHTML = `
      <div class="tasks-empty">

        <strong>
          Unable to load tasks
        </strong>

        <span>
          ${escapeHtml(
            error.message
          )}
        </span>

      </div>
    `;
  }
};

const initializeTasks = () => {
  const taskForm =
    document.getElementById(
      "taskForm"
    );

  const taskModal =
    document.getElementById(
      "taskModal"
    );

  const deleteModal =
    document.getElementById(
      "deleteModal"
    );

  if (
    !taskForm ||
    !taskModal ||
    !deleteModal
  ) {
    console.error(
      "Task page elements are missing."
    );

    return;
  }

  taskForm.addEventListener(
    "submit",
    saveTask
  );

  document.addEventListener(
    "click",
    (event) => {

      const addButton =
        event.target.closest(
          "#addTaskBtn"
        );

      if (addButton) {
        event.preventDefault();

        openTaskModal();

        return;
      }

      const editButton =
        event.target.closest(
          '[data-action="edit"][data-task-id]'
        );

      if (editButton) {
        event.preventDefault();

        const taskId =
          editButton.dataset.taskId;

        if (taskId) {
          openEditTask(taskId);
        }

        return;
      }

      const deleteButton =
        event.target.closest(
          '[data-action="delete"][data-task-id]'
        );

      if (deleteButton) {
        event.preventDefault();

        const taskId =
          deleteButton.dataset.taskId;

        if (taskId) {
          openDeleteModal(taskId);
        }

        return;
      }

      const closeButton =
        event.target.closest(
          "#closeModalBtn"
        );

      if (closeButton) {
        event.preventDefault();

        closeTaskModal();

        return;
      }

      const cancelTaskButton =
        event.target.closest(
          "#cancelTaskBtn"
        );

      if (cancelTaskButton) {
        event.preventDefault();

        closeTaskModal();

        return;
      }

      const cancelDeleteButton =
        event.target.closest(
          "#cancelDeleteBtn"
        );

      if (cancelDeleteButton) {
        event.preventDefault();

        closeDeleteModal();

        return;
      }

      const confirmDeleteButton =
        event.target.closest(
          "#confirmDeleteBtn"
        );

      if (confirmDeleteButton) {
        event.preventDefault();

        confirmDeleteTask();

        return;
      }

      const filterButton =
        event.target.closest(
          ".filter-btn"
        );

      if (filterButton) {
        event.preventDefault();

        document
          .querySelectorAll(
            ".filter-btn"
          )
          .forEach((button) => {
            button.classList.remove(
              "active"
            );
          });

        filterButton.classList.add(
          "active"
        );

        currentFilter =
          filterButton.dataset.filter ||
          "All";

        renderTasks();
      }
    }
  );

  taskModal.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        taskModal
      ) {
        closeTaskModal();
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
      if (event.key !== "Escape") {
        return;
      }

      closeTaskModal();
      closeDeleteModal();
    }
  );

  loadData();
};

document.addEventListener(
  "DOMContentLoaded",
  initializeTasks
);