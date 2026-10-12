const translations = {
  en: {
    // General
    language: "العربية",
    brandName: "Student Planner",
    brandTagline: "Stay on track",
    studentAccount: "Student account",
    dashboard: "Dashboard",
    courses: "Courses",
    tasks: "Tasks",
    assessments: "Assessments",
    progress: "Progress",
    calendar: "Calendar",
    logout: "Logout",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    loading: "Loading...",
    checkBackend: "Please make sure the backend server is running.",

    // Page titles
    loginTitle: "Student Planner - Login",
    registerTitle: "Student Planner - Register",
    verifyTitle: "Student Planner - Verify Email",
    dashboardTitle: "Student Planner - Dashboard",
    coursesTitle: "Student Planner - Courses",
    tasksPageTitle: "Student Planner - Tasks",
    assessmentsPageTitle: "Student Planner - Assessments",

    // Login
    welcomeBack: "Welcome back",
    signInHeading: "Sign in to your account",
    loginDescription:
      "Keep track of your courses, tasks, assessments, and progress.",
    email: "Email",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    show: "Show",
    hide: "Hide",
    signIn: "Sign In",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    createOne: "Create one",

    // Registration
    getStarted: "Get started",
    createAccountHeading: "Create your account",
    registerDescription: "Start organizing your university life in one place.",
    fullName: "Full Name",
    enterName: "Enter your name",
    createPassword: "Create a password",
    confirmPassword: "Confirm Password",
    useSixCharacters: "Use at least 6 characters.",
    createAccount: "Create Account",
    creatingAccount: "Creating account...",
    haveAccount: "Already have an account?",
    passwordsMismatch: "Passwords do not match.",
    passwordTooShort: "Password must be at least 6 characters.",
    enterYourName: "Please enter your name.",
    enterYourEmail: "Please enter your email.",
    enterEmailPassword: "Please enter your email and password.",
    accountCreated:
      "Account created successfully. Please check your email to verify your account.",
    loginFailed: "Unable to sign in.",
    registerFailed: "Unable to create your account.",

    // Email verification
    emailVerification: "Email verification",
    verifyingEmail: "Verifying your email...",
    waitVerification: "Please wait while we verify your email address.",
    verificationFailed: "Verification failed",
    missingVerification: "Missing verification link",
    missingVerificationMessage:
      "This verification link is missing or incomplete. Please use the link sent to your email.",
    emailVerified: "Email verified",
    emailVerifiedTitle: "Your email is verified!",
    emailVerifiedMessage:
      "Your account is ready. You can now sign in and start using Student Planner.",
    verificationErrorTitle: "We couldn't verify your email",
    invalidVerificationMessage:
      "This verification link may be expired or invalid. Please request a new verification email.",
    goToLogin: "Go to Login",
    emailAlreadyExists: "Email already exists.",
    pleaseVerifyEmail: "Please verify your email first.",
    invalidCredentials: "Invalid email or password",

    // Dashboard
    goodMorning: "Good morning,",
    goodAfternoon: "Good afternoon,",
    goodEvening: "Good evening,",
    goodNight: "Good night,",
    dashboardDescription: "Small steps every day lead to big results.",
    thisWeek: "This Week",
    youAre: "You're",
    closer: "closer",
    thanYouThink: "than you think.",
    planStudyAchieve: "Plan. Study. Achieve.",
    activeCourses: "Active courses",
    tasksRemaining: "Tasks remaining",
    assessmentsRemaining: "Assessments remaining",
    completed: "Completed",
    completedWork: "Completed work",
    nextUp: "Next up",
    upcomingTasks: "Upcoming Tasks",
    viewAll: "View all",
    deadlines: "Deadlines",
    upcomingAssessments: "Upcoming Assessments",
    yourWorkload: "Your workload",
    currentPriorities: "What do I need to do now?",
    loadingTasks: "Loading tasks...",
    loadingAssessments: "Loading assessments...",
    loadingPriorities: "Loading your priorities...",
    checkingUpcomingWork: "We are checking your upcoming work.",
    noUpcomingTasks: "No upcoming tasks. You're all caught up!",
    noUpcomingAssessments: "No upcoming assessments.",
    noCourse: "No course",
    assessment: "Assessment",
    noDeadline: "No deadline",
    invalidDate: "Invalid date",
    allCaughtUp: "You're all caught up!",
    noUpcomingWork:
      "There are no upcoming tasks or assessments. Keep up the good work.",
    nextAssessmentIs: 'Your next assessment is "{title}".',
    nextTaskIs: 'Your next task is "{title}".',
    dueOn: "It is due on {date}.",
    focusOnTask: 'Focus on "{title}" first.',
    focusOnAssessment: 'Focus on "{title}" first.',
    nextTaskDue: "Your next task is due on {date}.",
    nextAssessmentDue: "Your next assessment is due on {date}.",
    unableToLoadAssessments: "Unable to load assessments.",
    unableToLoadPriorities: "Unable to load your priorities.",

    // Courses
    academicSetup: "Academic setup",
    coursesTitleHeading: "Your courses",
    coursesDescription: "Manage the courses you are taking this semester.",
    addCourse: "Add Course",
    yourSemester: "Your semester",
    coursesHint:
      "Add your courses first, then connect tasks and assessments to them.",
    loadingCourses: "Loading courses...",
    noCourses: "No courses yet",
    noCoursesDescription:
      "Add your first course to start planning your semester.",
    course: "Course",
    courseDetails: "Course details",
    editCourse: "Edit Course",
    saveCourse: "Save Course",
    saveChanges: "Save Changes",
    courseName: "Course Name",
    courseCode: "Course Code",
    creditHours: "Credit Hours",
    instructor: "Instructor",
    courseNamePlaceholder: "e.g. Computer Architecture",
    courseCodePlaceholder: "e.g. CS304",
    instructorPlaceholder: "e.g. Dr. Ahmed Ali",
    deleteCourse: "Delete Course",
    deleteCourseTitle: "Delete Course?",
    deleteCourseDescription:
      "This will permanently delete the course. Any tasks or assessments connected to it may also be affected.",
    editCourseTitle: "Edit course",
    deleteCourseTitleLabel: "Delete course",
    courseNotFound: "Course not found.",
    fillCourseFields: "Please fill in all course fields.",
    invalidCreditHours: "Credit hours must be between 1 and 20.",
    unableToLoadCourses: "Unable to load courses.",
    saving: "Saving...",
    adding: "Adding...",
    deleting: "Deleting...",
    creditHour: "credit hour",
    creditHoursPlural: "credit hours",
    courseCount: "{count} Courses",
    courseCountSingular: "{count} Course",
    saveCourseFailed: "Unable to save course.",
    deleteCourseFailed: "Unable to delete course.",
    courseAlreadyExists: "Course already exists",

    // Tasks page
    tasksTitle: "Tasks",
    tasksDescription: "Organize what needs to be done and stay on schedule.",
    currentWorkload: "Current workload",
    all: "All",
    task: "Task",
    addTask: "Add Task",
    taskDetails: "Task details",
    taskTitle: "Task Title",
    taskTitleLabel: "Task Title",
    taskTitlePlaceholder: "e.g. Finish operating systems assignment",
    description: "Description",
    taskDescriptionPlaceholder: "Add some notes about this task...",
    dueDate: "Due Date",
    deadline: "Deadline",
    status: "Status",
    priority: "Priority",
    type: "Type",
    selectType: "Select type",
    selectCourse: "Select course",
    optional: "Optional",

    // Task statuses
    pending: "Pending",
    inProgress: "In Progress",
    completedStatus: "Completed",
    done: "Done",

    // Task types
    assignment: "Assignment",
    homework: "Homework",
    project: "Project",
    study: "Study",
    exam: "Exam",
    quiz: "Quiz",
    lab: "Lab",
    reading: "Reading",
    other: "Other",

    // Task counts and empty states
    taskCount: "{count} Tasks",
    taskCountSingular: "{count} Task",
    noTasks: "No tasks yet",
    noTasksDescription:
      "Add your first task to start organizing your workload.",
    noTasksInCategory: "No {status} tasks",
    noTasksInCategoryDescription: "There are no tasks in this category.",

    // Task actions and messages
    editTask: "Edit Task",
    locked: "Locked",
    taskDeadlinePassedLocked: "Deadline passed — this task is locked.",
    deadlinePassed: "The deadline has passed",
    taskDeadlineError:
      "The deadline must be in the future. This task can no longer be edited after its deadline.",
    enterTaskTitle: "Please enter a task title.",
    selectTaskType: "Please select a task type.",
    selectCourseError: "Please select a course.",
    selectDeadline: "Please select a deadline.",
    invalidDeadline: "Please enter a valid deadline.",
    saveTask: "Save Task",
    saveTaskFailed: "Unable to save task.",
    taskNotFound: "Task not found.",
    identifyTaskError: "Unable to identify this task.",
    deleteTask: "Delete Task",
    deleteTaskQuestion: "Delete Task?",
    deleteTaskDescription:
      "This task will be permanently removed from your planner.",
    deleteTaskFailed: "Unable to delete task.",
    loadingTasks: "Loading tasks...",
    unableToLoadTasks: "Unable to load tasks",

    // Assessments page
    assessmentsTitle: "Assessments",
    assessmentsDescription: "Track your exams, quizzes, and other assessments.",
    assessmentsEyebrow: "Track your grades",
    assessmentsDescriptionFull:
      "Keep track of exams, assignments, labs, and other graded work.",
    yourAssessments: "Your assessments",
    addAssessment: "Add Assessment",
    addAssessmentHeading: "Add Assessment",
    assessmentTitle: "Assessment Title",
    assessmentTitlePlaceholder: "e.g. Operating Systems Midterm",
    assessmentType: "Assessment Type",
    selectAssessmentTypePlaceholder: "Select type",
    assessmentDetails: "Assessment details",
    editAssessment: "Edit Assessment",
    editAssessmentHeading: "Edit Assessment",
    editAssessmentButton: "Edit",
    saveAssessment: "Save Assessment",
    assessmentSaveChanges: "Save Changes",
    assessmentCount: "{count} Assessments",
    assessmentCountSingular: "{count} Assessment",
    assessmentCountLabel: "{count} Assessments",
    assessmentCountLabelSingular: "{count} Assessment",
    noAssessments: "No assessments yet",
    noAssessmentsDescription:
      "Add your first assessment to track your academic deadlines.",
    addFirstAssessmentDescription:
      "Add your first assessment to start tracking your grades.",
    noAssessmentsInCategory: "No {status} assessments",
    noAssessmentsInSelectedCategory: "No {status} assessments",
    noAssessmentsInCategoryDescription:
      "There are no assessments in this category.",
    noAssessmentsInSelectedCategoryDescription:
      "There are no assessments in this category.",
    assessmentNotFound: "Assessment not found.",
    enterAssessmentTitle: "Please enter an assessment title.",
    selectAssessmentType: "Please select an assessment type.",
    selectAssessmentCourse: "Please select a course.",
    selectAssessmentDeadline: "Please select a deadline.",
    invalidAssessmentDeadline: "Please enter a valid deadline.",
    assessmentDeadlinePassedLocked:
      "Deadline passed — this assessment is locked.",
    assessmentDeadlinePassedMessage:
      "Deadline passed — this assessment is locked.",
    assessmentDeadlineError: "The deadline must be in the future.",
    deadlinePassedTitle: "The deadline has passed",
    assessmentFormTitleRequired: "Please enter an assessment title.",
    assessmentFormTypeRequired: "Please select an assessment type.",
    assessmentFormCourseRequired: "Please select a course.",
    assessmentFormTotalMarksRequired: "Total marks must be greater than 0.",
    assessmentFormDeadlineRequired: "Please select a deadline.",
    assessmentFormInvalidDeadline: "Please enter a valid deadline.",
    assessmentFormFutureDeadline: "The deadline must be in the future.",
    assessmentFormObtainedMarksNegative: "Obtained marks cannot be negative.",
    assessmentFormObtainedMarksTooHigh:
      "Obtained marks cannot be greater than total marks.",
    assessmentFormDeadlineLocked:
      "This assessment's deadline has passed. It can no longer be edited.",
    assessmentFormDeadlineLockedChange:
      "This assessment's deadline has passed. It can no longer be changed.",
    assessmentUnableToIdentify: "Unable to identify this assessment.",
    assessmentDeadlinePassedAlert:
      "This assessment's deadline has passed. It can no longer be edited.",
    totalMarks: "Total Marks",
    totalMarksPlaceholder: "e.g. 20",
    obtainedMarks: "Obtained Marks",
    obtainedMarksPlaceholder: "e.g. 18",
    marks: "Marks",
    enterTotalMarks: "Please enter the total marks.",
    invalidTotalMarks: "Total marks must be greater than zero.",
    invalidObtainedMarks:
      "Obtained marks must be between zero and total marks.",
    deleteAssessment: "Delete Assessment",
    deleteAssessmentQuestion: "Delete Assessment?",
    deleteAssessmentDescription:
      "This assessment will be permanently removed from your planner.",
    deleteAssessmentFailed: "Unable to delete assessment.",
    saveAssessmentFailed: "Unable to save assessment.",
    overdue: "Overdue",
    assessmentLocked: "Locked",

    // Assessment types
    assessmentTypeQuiz: "Quiz",
    assessmentTypeAssignment: "Assignment",
    assessmentTypeLab: "Lab",
    assessmentTypeMidterm: "Midterm",
    assessmentTypeFinal: "Final",
    assessmentTypeProject: "Project",
    assessmentTypeOther: "Other",

    // Assessment formatting and statuses
    assessmentDateLocale: "en-US",
    assessmentStatusPending: "Pending",
    assessmentStatusInProgress: "In Progress",
    assessmentStatusCompleted: "Completed",
    assessmentInvalidDate: "Invalid date",
    assessmentNoDeadline: "No deadline",
    unableToLoadAssessmentsTitle: "Unable to load assessments",
    assessmentLoadingErrorFallback:
      "Please make sure the backend server is running.",

    // Common actions
    edit: "Edit",
    delete: "Delete",
    update: "Update",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    back: "Back",
    retry: "Try again",
    error: "Error",
    success: "Success",

    // Progress page
    progressPageTitle: "Student Planner - Progress",
    progressEyebrow: "Track your performance",
    progressDescription:
      "See how you're performing across your completed assessments.",
    overallPerformance: "Overall Performance",
    noCompletedAssessments: "No completed assessments yet",
    obtained: "Obtained",
    total: "Total",
    includedInOverallScore: "Included in your overall score",
    coursesTracked: "Courses Tracked",
    withCompletedAssessments: "With completed assessments",
    courseBreakdown: "Course breakdown",
    progressByCourse: "Progress by Course",
    loadingProgress: "Loading progress...",
    noProgressYet: "No progress to show yet",
    noProgressDescription:
      "Complete an assessment and add your obtained marks to start tracking your academic progress.",
    goToAssessments: "Go to Assessments",
    unknownCourse: "Unknown Course",
    completedAssessmentCount: "completed assessment",
    completedAssessmentsCount: "completed assessments",
    completeAssessmentForCourseProgress:
      "Complete an assessment to see your course progress here.",
    unableToLoadProgress: "Unable to load your progress.",
    progressTitle: "Progress",
    
    // Calendar page
    calendarPageTitle: "Student Planner - Calendar",
    calendarEyebrow: "Plan your semester",
    calendarTitle: "Calendar",
    calendarDescription: "Keep track of your tasks and assessments.",
    yourSchedule: "Your schedule",
    loadingCalendar: "Loading calendar...",
    calendarSummaryDescription: "Every deadline, organized in one place.",
    selectDateDescription: "Select a date to see your schedule.",
    today: "Today",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdayMon: "Mon",
    weekdayTue: "Tue",
    weekdayWed: "Wed",
    weekdayThu: "Thu",
    weekdayFri: "Fri",
    weekdaySat: "Sat",
    weekdaySun: "Sun",
    selectDate: "Select a date",
    selectedDayDescription: "Your tasks and assessments will appear here.",
    events: "Events",
    selectDateToView: "Select a date to view your schedule.",
    scheduledEventSingular: "{count} scheduled event this month",
    scheduledEventPlural: "{count} scheduled events this month",
    eventCountSingular: "{count} event",
    eventCountPlural: "{count} events",
    dueToday: "Due today",
    noEventsForDay: "No tasks or assessments scheduled for this day.",
    unableToLoadSchedule: "Unable to load your schedule.",
    untitled: "Untitled",
  },

  ar: {
    // General
    language: "English",
    brandName: "منظّم الدراسة",
    brandTagline: "خليك على المسار الصحيح",
    studentAccount: "حساب الطالب",
    dashboard: "لوحة التحكم",
    courses: "المقررات",
    tasks: "المهام",
    assessments: "التقييمات",
    progress: "التقدم",
    calendar: "التقويم",
    logout: "تسجيل الخروج",
    cancel: "إلغاء",
    close: "إغلاق",
    save: "حفظ",
    loading: "جارٍ التحميل...",
    checkBackend: "تأكد من أن خادم الـ Backend يعمل.",

    // Page titles
    loginTitle: "منظّم الدراسة - تسجيل الدخول",
    registerTitle: "منظّم الدراسة - إنشاء حساب",
    verifyTitle: "منظّم الدراسة - تأكيد البريد الإلكتروني",
    dashboardTitle: "منظّم الدراسة - لوحة التحكم",
    coursesTitle: "منظّم الدراسة - المقررات",
    tasksPageTitle: "منظّم الدراسة - المهام",
    assessmentsPageTitle: "منظّم الدراسة - التقييمات",

    // Login
    welcomeBack: "مرحبًا بعودتك",
    signInHeading: "سجّل الدخول إلى حسابك",
    loginDescription:
      "تابع مقرراتك ومهامك وتقييماتك وتقدمك الدراسي في مكان واحد.",
    email: "البريد الإلكتروني",
    enterEmail: "أدخل بريدك الإلكتروني",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    show: "إظهار",
    hide: "إخفاء",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول...",
    noAccount: "ليس لديك حساب؟",
    createOne: "أنشئ حسابًا",

    // Registration
    getStarted: "ابدأ الآن",
    createAccountHeading: "أنشئ حسابك",
    registerDescription: "ابدأ بتنظيم حياتك الجامعية في مكان واحد.",
    fullName: "الاسم بالكامل",
    enterName: "أدخل اسمك",
    createPassword: "أنشئ كلمة مرور",
    confirmPassword: "تأكيد كلمة المرور",
    useSixCharacters: "استخدم 6 أحرف على الأقل.",
    createAccount: "إنشاء الحساب",
    creatingAccount: "جارٍ إنشاء الحساب...",
    haveAccount: "لديك حساب بالفعل؟",
    passwordsMismatch: "كلمتا المرور غير متطابقتين.",
    passwordTooShort: "يجب ألا تقل كلمة المرور عن 6 أحرف.",
    enterYourName: "من فضلك أدخل اسمك.",
    enterYourEmail: "من فضلك أدخل بريدك الإلكتروني.",
    enterEmailPassword: "من فضلك أدخل البريد الإلكتروني وكلمة المرور.",
    accountCreated:
      "تم إنشاء الحساب بنجاح. يُرجى مراجعة بريدك الإلكتروني لتأكيد حسابك.",
    loginFailed: "تعذّر تسجيل الدخول.",
    registerFailed: "تعذّر إنشاء الحساب.",

    // Email verification
    emailVerification: "تأكيد البريد الإلكتروني",
    verifyingEmail: "جارٍ تأكيد بريدك الإلكتروني...",
    waitVerification: "يرجى الانتظار حتى نتحقق من بريدك الإلكتروني.",
    verificationFailed: "فشل التأكيد",
    missingVerification: "رابط التأكيد غير موجود",
    missingVerificationMessage:
      "رابط التأكيد مفقود أو غير مكتمل. يُرجى استخدام الرابط المرسل إلى بريدك الإلكتروني.",
    emailVerified: "تم تأكيد البريد الإلكتروني",
    emailVerifiedTitle: "تم تأكيد بريدك الإلكتروني!",
    emailVerifiedMessage:
      "حسابك جاهز الآن. يمكنك تسجيل الدخول والبدء في استخدام منظّم الدراسة.",
    verificationErrorTitle: "لم نتمكن من تأكيد بريدك الإلكتروني",
    invalidVerificationMessage:
      "قد يكون رابط التأكيد منتهي الصلاحية أو غير صالح. يُرجى طلب رسالة تأكيد جديدة.",
    goToLogin: "الانتقال إلى تسجيل الدخول",
    emailAlreadyExists: "البريد الإلكتروني مسجل بالفعل.",
    pleaseVerifyEmail: "يُرجى تأكيد بريدك الإلكتروني أولًا.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

    // Dashboard
    goodMorning: "صباح الخير،",
    goodAfternoon: "مساء الخير،",
    goodEvening: "مساء الخير،",
    goodNight: "مساء الخير،",
    dashboardDescription: "خطوات صغيرة كل يوم تؤدي إلى نتائج كبيرة.",
    thisWeek: "هذا الأسبوع",
    youAre: "أنت",
    closer: "أقرب",
    thanYouThink: "مما تتخيل.",
    planStudyAchieve: "خطط. ذاكر. حقق أهدافك.",
    activeCourses: "المقررات النشطة",
    tasksRemaining: "المهام المتبقية",
    assessmentsRemaining: "التقييمات المتبقية",
    completed: "مكتمل",
    completedWork: "الأعمال المكتملة",
    nextUp: "التالي",
    upcomingTasks: "المهام القادمة",
    viewAll: "عرض الكل",
    deadlines: "المواعيد النهائية",
    upcomingAssessments: "التقييمات القادمة",
    yourWorkload: "مهامك الحالية",
    currentPriorities: "ماذا يجب أن أفعل الآن؟",
    loadingTasks: "جارٍ تحميل المهام...",
    loadingAssessments: "جارٍ تحميل التقييمات...",
    loadingPriorities: "جارٍ تحديد أولوياتك...",
    checkingUpcomingWork: "جارٍ مراجعة مهامك القادمة.",
    noUpcomingTasks: "لا توجد مهام قادمة. لقد أنهيت كل شيء!",
    noUpcomingAssessments: "لا توجد تقييمات قادمة.",
    noCourse: "بدون مقرر",
    assessment: "تقييم",
    noDeadline: "لا يوجد موعد نهائي",
    invalidDate: "تاريخ غير صالح",
    allCaughtUp: "لقد أنهيت كل مهامك الحالية!",
    noUpcomingWork: "لا توجد مهام أو تقييمات قادمة. استمر على هذا المستوى!",
    nextAssessmentIs: 'التقييم القادم هو "{title}".',
    nextTaskIs: 'المهمة القادمة هي "{title}".',
    dueOn: "موعد التسليم: {date}.",
    focusOnTask: 'ابدأ أولًا بالمهمة "{title}".',
    focusOnAssessment: 'ابدأ أولًا بالتقييم "{title}".',
    nextTaskDue: "موعد تسليم المهمة القادمة هو {date}.",
    nextAssessmentDue: "موعد التقييم القادم هو {date}.",
    unableToLoadAssessments: "تعذر تحميل التقييمات.",
    unableToLoadPriorities: "تعذر تحميل الأولويات.",

    // Courses
    academicSetup: "الإعداد الأكاديمي",
    coursesTitleHeading: "مقرراتك الدراسية",
    coursesDescription: "أدِر المقررات التي تدرسها هذا الفصل الدراسي.",
    addCourse: "إضافة مقرر",
    yourSemester: "الفصل الدراسي",
    coursesHint: "أضف مقرراتك أولًا، ثم اربط المهام والتقييمات بها.",
    loadingCourses: "جارٍ تحميل المقررات...",
    noCourses: "لا توجد مقررات حتى الآن",
    noCoursesDescription: "أضف أول مقرر لتبدأ في تنظيم فصلك الدراسي.",
    course: "مقرر",
    courseDetails: "تفاصيل المقرر",
    editCourse: "تعديل المقرر",
    saveCourse: "حفظ المقرر",
    saveChanges: "حفظ التغييرات",
    courseName: "اسم المقرر",
    courseCode: "كود المقرر",
    creditHours: "الساعات المعتمدة",
    instructor: "المحاضر",
    courseNamePlaceholder: "مثال: معمارية الحاسوب",
    courseCodePlaceholder: "مثال: CS304",
    instructorPlaceholder: "مثال: د. أحمد علي",
    deleteCourse: "حذف المقرر",
    deleteCourseTitle: "حذف المقرر؟",
    deleteCourseDescription:
      "سيتم حذف المقرر نهائيًا. وقد تتأثر أيضًا المهام أو التقييمات المرتبطة به.",
    editCourseTitle: "تعديل المقرر",
    deleteCourseTitleLabel: "حذف المقرر",
    courseNotFound: "لم يتم العثور على المقرر.",
    fillCourseFields: "من فضلك املأ جميع حقول المقرر.",
    invalidCreditHours: "يجب أن يتراوح عدد الساعات المعتمدة بين 1 و20.",
    unableToLoadCourses: "تعذّر تحميل المقررات.",
    saving: "جارٍ الحفظ...",
    adding: "جارٍ الإضافة...",
    deleting: "جارٍ الحذف...",
    creditHour: "ساعة معتمدة",
    creditHoursPlural: "ساعات معتمدة",
    courseCount: "عدد المقررات: {count}",
    courseCountSingular: "عدد المقررات: {count}",
    saveCourseFailed: "تعذّر حفظ المقرر.",
    deleteCourseFailed: "تعذّر حذف المقرر.",
    courseAlreadyExists: "المقرر موجود بالفعل",

    // Tasks page
    tasksTitle: "المهام",
    tasksDescription: "نظّم مهامك الدراسية وتابع مواعيد تسليمها.",
    currentWorkload: "عبء المهام الحالي",
    all: "الكل",
    task: "مهمة",
    addTask: "إضافة مهمة",
    taskDetails: "تفاصيل المهمة",
    taskTitle: "عنوان المهمة",
    taskTitleLabel: "عنوان المهمة",
    taskTitlePlaceholder: "مثال: إنهاء واجب نظم التشغيل",
    description: "الوصف",
    taskDescriptionPlaceholder: "أضف ملاحظات عن هذه المهمة...",
    dueDate: "تاريخ التسليم",
    deadline: "الموعد النهائي",
    status: "الحالة",
    priority: "الأولوية",
    type: "النوع",
    selectType: "اختر النوع",
    selectCourse: "اختر المقرر",
    optional: "اختياري",

    // Task statuses
    pending: "قيد الانتظار",
    inProgress: "قيد التنفيذ",
    completedStatus: "مكتملة",
    done: "تم",

    // Task types
    assignment: "واجب",
    homework: "واجب منزلي",
    project: "مشروع",
    study: "مذاكرة",
    exam: "امتحان",
    quiz: "اختبار قصير",
    lab: "معمل",
    reading: "قراءة",
    other: "أخرى",

    // Task counts and empty states
    taskCount: "عدد المهام: {count}",
    taskCountSingular: "عدد المهام: {count}",
    noTasks: "لا توجد مهام بعد",
    noTasksDescription: "أضف أول مهمة لتبدأ في تنظيم مهامك.",
    noTasksInCategory: "لا توجد مهام بحالة {status}",
    noTasksInCategoryDescription: "لا توجد مهام في هذه الفئة.",

    // Task actions and messages
    editTask: "تعديل المهمة",
    locked: "مقفلة",
    taskDeadlinePassedLocked: "انتهى الموعد النهائي — المهمة مقفلة.",
    deadlinePassed: "انتهى الموعد النهائي",
    taskDeadlineError:
      "يجب أن يكون الموعد النهائي في المستقبل. لا يمكن تعديل المهمة بعد انتهاء موعدها.",
    enterTaskTitle: "من فضلك أدخل عنوان المهمة.",
    selectTaskType: "من فضلك اختر نوع المهمة.",
    selectCourseError: "من فضلك اختر مقررًا.",
    selectDeadline: "من فضلك اختر الموعد النهائي.",
    invalidDeadline: "من فضلك أدخل موعدًا نهائيًا صحيحًا.",
    saveTask: "حفظ المهمة",
    saveTaskFailed: "تعذر حفظ المهمة.",
    taskNotFound: "لم يتم العثور على المهمة.",
    identifyTaskError: "تعذر تحديد المهمة.",
    deleteTask: "حذف المهمة",
    deleteTaskQuestion: "حذف المهمة؟",
    deleteTaskDescription: "ستتم إزالة هذه المهمة نهائيًا من مخططك الدراسي.",
    deleteTaskFailed: "تعذر حذف المهمة.",
    loadingTasks: "جارٍ تحميل المهام...",
    unableToLoadTasks: "تعذر تحميل المهام",

    // Assessments page
    assessmentsTitle: "التقييمات",
    assessmentsDescription:
      "تابع امتحاناتك واختباراتك والتقييمات الدراسية الأخرى.",
    assessmentsEyebrow: "تابع درجاتك",
    assessmentsDescriptionFull:
      "تابع امتحاناتك وواجباتك ومعاملك وجميع أعمالك التي تُحتسب ضمن درجاتك.",
    yourAssessments: "التقييمات الخاصة بك",
    addAssessment: "إضافة تقييم",
    addAssessmentHeading: "إضافة تقييم",
    assessmentTitle: "عنوان التقييم",
    assessmentTitlePlaceholder: "مثال: امتحان منتصف الفصل لنظم التشغيل",
    assessmentType: "نوع التقييم",
    selectAssessmentTypePlaceholder: "اختر النوع",
    assessmentDetails: "تفاصيل التقييم",
    editAssessment: "تعديل التقييم",
    editAssessmentHeading: "تعديل التقييم",
    editAssessmentButton: "تعديل",
    saveAssessment: "حفظ التقييم",
    assessmentSaveChanges: "حفظ التغييرات",
    assessmentCount: "عدد التقييمات: {count}",
    assessmentCountSingular: "عدد التقييمات: {count}",
    assessmentCountLabel: "عدد التقييمات: {count}",
    assessmentCountLabelSingular: "عدد التقييمات: {count}",
    noAssessments: "لا توجد تقييمات حتى الآن",
    noAssessmentsDescription: "أضف أول تقييم لتتابع مواعيدك الدراسية.",
    addFirstAssessmentDescription:
      "أضف أول تقييم لتبدأ في متابعة درجاتك ومواعيدك الدراسية.",
    noAssessmentsInCategory: "لا توجد تقييمات بحالة {status}",
    noAssessmentsInSelectedCategory: "لا توجد تقييمات بحالة {status}",
    noAssessmentsInCategoryDescription: "لا توجد تقييمات في هذه الفئة.",
    noAssessmentsInSelectedCategoryDescription: "لا توجد تقييمات في هذه الفئة.",
    assessmentNotFound: "لم يتم العثور على التقييم.",
    enterAssessmentTitle: "من فضلك أدخل عنوان التقييم.",
    selectAssessmentType: "من فضلك اختر نوع التقييم.",
    selectAssessmentCourse: "من فضلك اختر المقرر.",
    selectAssessmentDeadline: "من فضلك اختر الموعد النهائي.",
    invalidAssessmentDeadline: "من فضلك أدخل موعدًا نهائيًا صحيحًا.",
    assessmentDeadlinePassedLocked: "انتهى الموعد النهائي — التقييم مقفل.",
    assessmentDeadlinePassedMessage: "انتهى الموعد النهائي — هذا التقييم مقفل.",
    assessmentDeadlineError: "يجب أن يكون الموعد النهائي في المستقبل.",
    deadlinePassedTitle: "انتهى الموعد النهائي",
    assessmentFormTitleRequired: "من فضلك أدخل عنوان التقييم.",
    assessmentFormTypeRequired: "من فضلك اختر نوع التقييم.",
    assessmentFormCourseRequired: "من فضلك اختر المقرر.",
    assessmentFormTotalMarksRequired:
      "يجب أن تكون الدرجة النهائية أكبر من صفر.",
    assessmentFormDeadlineRequired: "من فضلك اختر الموعد النهائي.",
    assessmentFormInvalidDeadline: "من فضلك أدخل موعدًا نهائيًا صحيحًا.",
    assessmentFormFutureDeadline: "يجب أن يكون الموعد النهائي في المستقبل.",
    assessmentFormObtainedMarksNegative:
      "لا يمكن أن تكون الدرجة المحصّلة سالبة.",
    assessmentFormObtainedMarksTooHigh:
      "لا يمكن أن تتجاوز الدرجة المحصّلة الدرجة النهائية.",
    assessmentFormDeadlineLocked:
      "انتهى الموعد النهائي لهذا التقييم، ولم يعد بالإمكان تعديله.",
    assessmentFormDeadlineLockedChange:
      "انتهى الموعد النهائي لهذا التقييم، ولم يعد بالإمكان تغيير بياناته.",
    assessmentUnableToIdentify: "تعذر تحديد هذا التقييم.",
    assessmentDeadlinePassedAlert:
      "انتهى الموعد النهائي لهذا التقييم، ولم يعد بالإمكان تعديله.",
    totalMarks: "الدرجة النهائية",
    totalMarksPlaceholder: "مثال: 20",
    obtainedMarks: "الدرجة المحصّلة",
    obtainedMarksPlaceholder: "مثال: 18",
    marks: "الدرجات",
    enterTotalMarks: "من فضلك أدخل الدرجة النهائية.",
    invalidTotalMarks: "يجب أن تكون الدرجة النهائية أكبر من صفر.",
    invalidObtainedMarks:
      "يجب أن تكون الدرجة المحصّلة بين صفر والدرجة النهائية.",
    deleteAssessment: "حذف التقييم",
    deleteAssessmentQuestion: "حذف التقييم؟",
    deleteAssessmentDescription:
      "سيتم حذف هذا التقييم نهائيًا من مخططك الدراسي.",
    deleteAssessmentFailed: "تعذر حذف التقييم.",
    saveAssessmentFailed: "تعذر حفظ التقييم.",
    overdue: "متأخر",
    assessmentLocked: "مقفل",

    // Assessment types
    assessmentTypeQuiz: "اختبار قصير",
    assessmentTypeAssignment: "واجب",
    assessmentTypeLab: "معمل",
    assessmentTypeMidterm: "امتحان منتصف الفصل",
    assessmentTypeFinal: "امتحان نهائي",
    assessmentTypeProject: "مشروع",
    assessmentTypeOther: "أخرى",

    // Assessment formatting and statuses
    assessmentDateLocale: "ar-EG",
    assessmentStatusPending: "قيد الانتظار",
    assessmentStatusInProgress: "قيد التنفيذ",
    assessmentStatusCompleted: "مكتمل",
    assessmentInvalidDate: "تاريخ غير صالح",
    assessmentNoDeadline: "لا يوجد موعد نهائي",
    unableToLoadAssessmentsTitle: "تعذر تحميل التقييمات",
    assessmentLoadingErrorFallback: "تأكد من أن خادم الـ Backend يعمل.",

    // Common actions
    edit: "تعديل",
    delete: "حذف",
    update: "تحديث",
    search: "بحث",
    filter: "تصفية",
    clear: "مسح",
    back: "رجوع",
    retry: "حاول مرة أخرى",
    error: "خطأ",
    success: "تم بنجاح",

    // Progress page
    progressPageTitle: "منظّم الدراسة - التقدم",
    progressEyebrow: "تابع أداءك الدراسي",
    progressDescription: "شاهد أداءك في التقييمات التي أكملتها.",
    overallPerformance: "الأداء العام",
    noCompletedAssessments: "لا توجد تقييمات مكتملة حتى الآن",
    obtained: "درجتك",
    total: "الدرجة النهائية",
    includedInOverallScore: "تدخل ضمن درجتك الإجمالية",
    coursesTracked: "المقررات التي تتم متابعتها",
    withCompletedAssessments: "بها تقييمات مكتملة",
    courseBreakdown: "تفاصيل المقررات",
    progressByCourse: "التقدم حسب المقرر",
    loadingProgress: "جارٍ تحميل التقدم...",
    noProgressYet: "لا يوجد تقدم لعرضه حتى الآن",
    noProgressDescription:
      "أكمل تقييمًا وأضف الدرجة التي حصلت عليها لبدء متابعة تقدمك الدراسي.",
    goToAssessments: "الانتقال إلى التقييمات",
    unknownCourse: "مقرر غير معروف",
    completedAssessmentCount: "تقييم مكتمل",
    completedAssessmentsCount: "تقييمات مكتملة",
    completeAssessmentForCourseProgress:
      "أكمل تقييمًا لعرض تقدمك في المقررات هنا.",
    unableToLoadProgress: "تعذّر تحميل تقدمك الدراسي.",
    progressTitle: "التقدم",

    // Calendar page
    calendarPageTitle: "منظّم الدراسة - التقويم",
    calendarEyebrow: "خطط لفصلك الدراسي",
    calendarTitle: "التقويم",
    calendarDescription: "تابع مهامك وتقييماتك الدراسية.",
    yourSchedule: "جدولك الدراسي",
    loadingCalendar: "جارٍ تحميل التقويم...",
    calendarSummaryDescription: "جميع المواعيد النهائية في مكان واحد.",
    selectDateDescription: "اختر يومًا لعرض جدولك الدراسي.",
    today: "اليوم",
    previousMonth: "الشهر السابق",
    nextMonth: "الشهر التالي",
    weekdayMon: "الإثنين",
    weekdayTue: "الثلاثاء",
    weekdayWed: "الأربعاء",
    weekdayThu: "الخميس",
    weekdayFri: "الجمعة",
    weekdaySat: "السبت",
    weekdaySun: "الأحد",
    selectDate: "اختر يومًا",
    selectedDayDescription: "ستظهر مهامك وتقييماتك هنا.",
    events: "الأحداث",
    selectDateToView: "اختر يومًا لعرض جدولك الدراسي.",
    scheduledEventSingular: "موعد واحد مجدول هذا الشهر",
    scheduledEventPlural: "{count} مواعيد مجدولة هذا الشهر",
    eventCountSingular: "موعد واحد",
    eventCountPlural: "{count} مواعيد",
    dueToday: "موعده اليوم",
    noEventsForDay: "لا توجد مهام أو تقييمات مجدولة لهذا اليوم.",
    unableToLoadSchedule: "تعذّر تحميل جدولك الدراسي.",
    untitled: "بدون عنوان",
  },
};

// Get the saved language.
const getSavedLanguage = () => {
  try {
    return localStorage.getItem("language") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
};

let currentLanguage = getSavedLanguage();

// Translate a key using the current language.
const t = (key) => {
  return translations[currentLanguage]?.[key] ?? translations.en[key] ?? key;
};

// Return the current language.
const getLanguage = () => currentLanguage;

// Apply the selected language to the page.
const applyLanguage = (language) => {
  currentLanguage = language === "ar" ? "ar" : "en";

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  try {
    localStorage.setItem("language", currentLanguage);
  } catch {
    // The page can still work if storage is unavailable.
  }

  // Translate text content.
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  // Translate placeholders.
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  // Translate accessible labels.
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    element.setAttribute("aria-label", t(key));
  });

  // Update language toggle buttons.
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = t("language");

    button.setAttribute(
      "aria-label",
      currentLanguage === "ar"
        ? "Switch language to English"
        : "تغيير اللغة إلى العربية",
    );
  });

  // Update the page title if a translation key is provided.
  const titleKey = document.body.dataset.titleKey;

  if (titleKey) {
    document.title = t(titleKey);
  }

  // Notify page scripts that the language has changed.
  document.dispatchEvent(
    new CustomEvent("languageChanged", {
      detail: { language: currentLanguage },
    }),
  );
};

// Make translation functions available to other scripts.
window.t = t;
window.getLanguage = getLanguage;
window.translations = translations;
window.applyLanguage = applyLanguage;

// Toggle the language when the language button is clicked.
document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest("[data-language-toggle]");

  if (!button) {
    return;
  }

  applyLanguage(currentLanguage === "ar" ? "en" : "ar");
});

// Apply the saved language when the page loads.
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLanguage);
});
