let tasks = [];
let assessments = [];

let currentDate = new Date();
let selectedDate = new Date();

let calendarEvents = [];
let isCalendarLoading = false;
let calendarError = null;

const translate = (key) => {
  return typeof window.t === "function" ? window.t(key) : key;
};

const getCalendarLanguage = () => {
  return typeof window.getLanguage === "function" ? window.getLanguage() : "en";
};

const getLocale = () => {
  return getCalendarLanguage() === "ar" ? "ar-EG" : "en-US";
};

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
  if (!item?.course) return translate("noCourse");

  if (typeof item.course === "string") {
    return translate("course");
  }

  return item.course.name || item.course.code || translate("noCourse");
};

const formatDate = (date) => {
  return date.toLocaleDateString(getLocale(), {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (date) => {
  return date.toLocaleDateString(getLocale(), {
    month: "long",
    day: "numeric",
  });
};

const formatMonth = (date) => {
  return date.toLocaleDateString(getLocale(), {
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString(getLocale(), {
    hour: "numeric",
    minute: "2-digit",
  });
};

const isCompleted = (event) => {
  return event.status === "Completed";
};

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

const getEventStatusKey = (event) => {
  if (isCompleted(event)) {
    return "completedStatus";
  }

  if (isOverdue(event)) {
    return "overdue";
  }

  if (event.date && sameDay(event.date, new Date())) {
    return "dueToday";
  }

  switch (event.status) {
    case "In Progress":
      return "inProgress";
    case "Pending":
      return "pending";
    case "Completed":
      return "completedStatus";
    default:
      return null;
  }
};

const getEventStatus = (event) => {
  const key = getEventStatusKey(event);

  return key ? translate(key) : event.status || translate("pending");
};

const getEventTypeLabel = (event) => {
  return event.eventType === "Assessment"
    ? translate("assessments")
    : translate("tasks");
};

const renderLoadingMessage = () => {
  document.getElementById("calendarGrid").innerHTML = `
    <div class="calendar-message">
      ${escapeHtml(translate("loadingCalendar"))}
    </div>
  `;
};

const renderCalendarError = () => {
  const grid = document.getElementById("calendarGrid");

  grid.innerHTML = `
    <div class="calendar-message">
      ${escapeHtml(translate("unableToLoadSchedule"))}<br>
      <button id="retryCalendarBtn" type="button">
        ${escapeHtml(translate("retry"))}
      </button>
    </div>
  `;
};

const loadCalendarData = async () => {
  if (isCalendarLoading) return;

  isCalendarLoading = true;
  calendarError = null;
  renderLoadingMessage();

  try {
    const [tasksResponse, assessmentsResponse] = await Promise.all([
      api.get("/tasks"),
      api.get("/assessments"),
    ]);

    tasks = Array.isArray(tasksResponse)
      ? tasksResponse
      : Array.isArray(tasksResponse?.tasks)
        ? tasksResponse.tasks
        : [];

    assessments = Array.isArray(assessmentsResponse)
      ? assessmentsResponse
      : Array.isArray(assessmentsResponse?.assessments)
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

    calendarError = error;
    renderCalendarError();
  } finally {
    isCalendarLoading = false;
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

  const key =
    monthEvents.length === 1
      ? "scheduledEventSingular"
      : "scheduledEventPlural";

  document.getElementById("monthSummary").textContent = translate(key).replace(
    "{count}",
    String(monthEvents.length),
  );
};

const renderCalendar = () => {
  const grid = document.getElementById("calendarGrid");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("calendarMonth").textContent =
    formatMonth(currentDate);

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

    const eventCountLabel = translate(
      dayEvents.length === 1 ? "eventCountSingular" : "eventCountPlural",
    ).replace("{count}", String(dayEvents.length));

    button.setAttribute(
      "aria-label",
      `${formatDate(date)}, ${eventCountLabel}`,
    );

    button.setAttribute("aria-pressed", String(sameDay(date, selectedDate)));

    const visibleDots = dayEvents
      .slice(0, 4)
      .map((event) => {
        if (isCompleted(event)) {
          return '<i class="event-dot completed-dot"></i>';
        }

        if (isOverdue(event)) {
          return '<i class="event-dot overdue-dot"></i>';
        }

        const dotClass =
          event.eventType === "Assessment" ? "assessment-dot" : "task-dot";

        return `<i class="event-dot ${dotClass}"></i>`;
      })
      .join("");

    const extraEvents = dayEvents.length > 4 ? `+${dayEvents.length - 4}` : "";

    button.innerHTML = `
      <span class="day-number">${date.getDate()}</span>

      <span class="day-event-dots">
        ${visibleDots}
      </span>

      <span class="day-event-count">
        ${extraEvents}
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

  title.textContent = formatShortDate(selectedDate);
  subtitle.textContent = formatDate(selectedDate);
  dayTotal.textContent = events.length;

  // Count unfinished tasks and assessments that are not overdue.
  dayPending.textContent = events.filter((event) => {
    return !isCompleted(event) && !isOverdue(event);
  }).length;

  if (events.length === 0) {
    list.innerHTML = `
      <div class="calendar-message">
        ${escapeHtml(translate("noEventsForDay"))}
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
      const typeLabel = getEventTypeLabel(event);
      const time = formatTime(event.date);
      const courseName = getCourseName(event);
      const details = [courseName, time].filter(Boolean);

      return `
        <article class="${classes}">
          <div class="day-event-top">
            <span class="day-event-type">
              ${escapeHtml(typeLabel)}
            </span>

            <span class="day-event-status">
              ${escapeHtml(status)}
            </span>
          </div>

          <h3>${escapeHtml(event.title || translate("untitled"))}</h3>

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

// Re-render translated content without fetching data again.
document.addEventListener("languageChanged", () => {
  if (isCalendarLoading) {
    renderLoadingMessage();
    return;
  }

  if (calendarError) {
    renderCalendarError();
    return;
  }

  renderCalendar();
  renderSelectedDay();
  updateMonthSummary();
});

document.addEventListener("DOMContentLoaded", () => {
  loadCalendarData();
});
