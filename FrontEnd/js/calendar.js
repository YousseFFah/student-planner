let tasks = [];
let assessments = [];

let currentDate = new Date();
let selectedDate = new Date();

let calendarEvents = [];

const escapeHtml = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

const getItemId = (item) => {
  return item?._id || item?.id || "";
};

const parseDate = (value) => {
  if (!value) return null;

  // Keep date-only values in local time.
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
      const date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      );

      if (
        date.getFullYear() !== Number(match[1]) ||
        date.getMonth() !== Number(match[2]) - 1 ||
        date.getDate() !== Number(match[3])
      ) {
        return null;
      }

      return date;
    }
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const sameDay = (first, second) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const getCourseName = (item) => {
  if (!item?.course) return "No course";

  if (typeof item.course === "string") {
    return "Course";
  }

  return item.course.name || item.course.code || "No course";
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const isCompleted = (event) => {
  return event.status === "Completed";
};

// Check whether the actual deadline has passed.
// Date-only deadlines are considered overdue after that day ends.
const isOverdue = (event) => {
  if (isCompleted(event) || !event.date) {
    return false;
  }

  const rawDeadline = event.deadline;

  if (
    typeof rawDeadline === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(rawDeadline)
  ) {
    return startOfDay(event.date) < startOfDay(new Date());
  }

  return event.date.getTime() < Date.now();
};

const getEventStatus = (event) => {
  if (isCompleted(event)) {
    return "Completed";
  }

  if (isOverdue(event)) {
    return "Overdue";
  }

  if (event.date && sameDay(event.date, new Date())) {
    return "Due today";
  }

  return event.status || "Pending";
};

const loadCalendarData = async () => {
  const grid = document.getElementById("calendarGrid");

  grid.innerHTML = `
    <div class="calendar-message">
      Loading your schedule...
    </div>
  `;

  try {
    const [tasksResponse, assessmentsResponse] = await Promise.all([
      api.get("/tasks"),
      api.get("/assessments"),
    ]);

    tasks = Array.isArray(tasksResponse)
      ? tasksResponse
      : Array.isArray(tasksResponse.tasks)
        ? tasksResponse.tasks
        : [];

    assessments = Array.isArray(assessmentsResponse)
      ? assessmentsResponse
      : Array.isArray(assessmentsResponse.assessments)
        ? assessmentsResponse.assessments
        : [];

    calendarEvents = [
      ...tasks.map((task) => ({
        ...task,
        id: getItemId(task),
        eventType: "Task",
        date: parseDate(task.deadline),
      })),

      ...assessments.map((assessment) => ({
        ...assessment,
        id: getItemId(assessment),
        eventType: "Assessment",
        date: parseDate(assessment.deadline),
      })),
    ].filter((event) => event.date !== null);

    calendarEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    renderCalendar();
    renderSelectedDay();
    updateMonthSummary();
  } catch (error) {
    console.error("Calendar error:", error);

    grid.innerHTML = `
      <div class="calendar-message">
        Unable to load your schedule.<br>
        ${escapeHtml(error.message)}<br>
        <button id="retryCalendarBtn" type="button">
          Try again
        </button>
      </div>
    `;
  }
};

const updateMonthSummary = () => {
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  const monthEvents = calendarEvents.filter((event) => {
    return event.date >= monthStart && event.date < monthEnd;
  });

  const summary = document.getElementById("monthSummary");

  summary.textContent =
    `${monthEvents.length} scheduled event` +
    `${monthEvents.length === 1 ? "" : "s"} this month`;
};

const renderCalendar = () => {
  const grid = document.getElementById("calendarGrid");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("calendarMonth").textContent =
    currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  grid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const startingDay = (firstDay.getDay() + 6) % 7;
  const today = startOfDay(new Date());

  // Six rows keep the calendar height consistent.
  for (let index = 0; index < 42; index++) {
    const dayNumber = index - startingDay + 1;
    const date = new Date(year, month, dayNumber);
    const inCurrentMonth = date.getMonth() === month;

    const dayEvents = calendarEvents.filter((event) => {
      return sameDay(event.date, date);
    });

    const button = document.createElement("button");

    button.type = "button";
    button.className = "calendar-day";

    if (!inCurrentMonth) {
      button.classList.add("outside-month");
    }

    if (sameDay(date, today)) {
      button.classList.add("is-today");
    }

    if (sameDay(date, selectedDate)) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-label",
      `${formatDate(date)}, ${dayEvents.length} events`,
    );

    button.setAttribute("aria-pressed", String(sameDay(date, selectedDate)));

    const visibleDots = dayEvents
      .slice(0, 4)
      .map((event) => {
        // Completed events always stay green.
        if (isCompleted(event)) {
          return `<i class="event-dot completed-dot"></i>`;
        }

        // Any unfinished event past its deadline is red.
        if (isOverdue(event)) {
          return `<i class="event-dot overdue-dot"></i>`;
        }

        // Otherwise use the regular task/assessment colors.
        const dotClass =
          event.eventType === "Assessment" ? "assessment-dot" : "task-dot";

        return `<i class="event-dot ${dotClass}"></i>`;
      })
      .join("");

    button.innerHTML = `
      <span class="day-number">${date.getDate()}</span>

      <span class="day-event-dots">
        ${visibleDots}
      </span>

      <span class="day-event-count">
        ${dayEvents.length > 4 ? `+${dayEvents.length - 4}` : ""}
      </span>
    `;

    button.addEventListener("click", () => {
      selectedDate = new Date(date);

      if (!inCurrentMonth) {
        currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
      }

      renderCalendar();
      renderSelectedDay();
      updateMonthSummary();
    });

    grid.appendChild(button);
  }
};

const renderSelectedDay = () => {
  const title = document.getElementById("selectedDateTitle");
  const subtitle = document.getElementById("selectedDateSubtitle");
  const list = document.getElementById("selectedDayEvents");

  const dayTotal = document.getElementById("dayTotal");
  const dayPending = document.getElementById("dayPending");

  const events = calendarEvents.filter((event) => {
    return sameDay(event.date, selectedDate);
  });

  title.textContent = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  subtitle.textContent = formatDate(selectedDate);
  dayTotal.textContent = events.length;

  // Count unfinished tasks and assessments.
  dayPending.textContent = events.filter((event) => {
    return !isCompleted(event) && !isOverdue(event);
  }).length;

  if (events.length === 0) {
    list.innerHTML = `
      <div class="calendar-message">
        No tasks or assessments scheduled for this day.
      </div>
    `;
    return;
  }

  list.innerHTML = events
    .map((event) => {
      const isAssessment = event.eventType === "Assessment";
      const overdue = isOverdue(event);

      const classes = [
        "day-event",
        isAssessment ? "assessment-event" : "",
        isCompleted(event) ? "completed-event" : "",
        overdue ? "overdue-event" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const status = getEventStatus(event);
      const time = formatTime(event.date);
      const courseName = getCourseName(event);

      const details = [courseName, time].filter(Boolean);

      return `
      <article class="${classes}">
        <div class="day-event-top">
          <span class="day-event-type">
            ${event.eventType}
          </span>

          <span class="day-event-status">
            ${escapeHtml(status)}
          </span>
        </div>

        <h3>${escapeHtml(event.title || "Untitled")}</h3>

        <p>${escapeHtml(details.join(" · "))}</p>
      </article>
    `;
    })
    .join("");
};

const changeMonth = (amount) => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + amount,
    1,
  );

  renderCalendar();
  updateMonthSummary();
};

document
  .getElementById("prevMonthBtn")
  .addEventListener("click", () => changeMonth(-1));

document
  .getElementById("nextMonthBtn")
  .addEventListener("click", () => changeMonth(1));

document.getElementById("todayBtn").addEventListener("click", () => {
  currentDate = new Date();
  selectedDate = new Date();

  renderCalendar();
  renderSelectedDay();
  updateMonthSummary();
});

document.getElementById("calendarGrid").addEventListener("click", (event) => {
  if (event.target.closest("#retryCalendarBtn")) {
    loadCalendarData();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadCalendarData();
});
