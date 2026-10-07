const PUBLIC_PAGES = [
  "login.html",
  "register.html",
  "verify-email.html",
];

const getCurrentPage = () => {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  return page || "index.html";
};

const isPublicPage = () => {
  return PUBLIC_PAGES.includes(getCurrentPage());
};

const getInitial = (name) => {
  if (!name) {
    return "U";
  }

  return name.trim().charAt(0).toUpperCase();
};

const updateUserUI = (user) => {
  if (!user) {
    return;
  }

  const name = user.name || "Student";
  const initial = getInitial(name);

  document.querySelectorAll(".user-name").forEach((element) => {
    element.textContent = name;
  });

  document.querySelectorAll(".user-avatar").forEach((element) => {
    element.textContent = initial;
  });
};

const logout = () => {
  api.clearAuth();
  window.location.href = "login.html";
};

const setupLogoutButtons = () => {
  document.querySelectorAll(".logout-btn").forEach((button) => {
    button.addEventListener("click", logout);
  });
};

const requireAuth = () => {
  if (!api.isLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }

  return true;
};

const redirectIfAuthenticated = () => {
  if (api.isLoggedIn() && isPublicPage()) {
    window.location.href = "index.html";
    return true;
  }

  return false;
};

const loadCurrentUser = async () => {
  if (!api.isLoggedIn()) {
    return null;
  }

  try {
    const data = await api.get("/users/me");
    const user = data.user || data;

    api.saveCurrentUser(user);

    return user;
  } catch (error) {
    console.error("Authentication error:", error);

    api.clearAuth();

    if (!isPublicPage()) {
      window.location.href = "login.html";
    }

    return null;
  }
};

const login = async (email, password) => {
  const data = await api.post("/users/login", {
    email,
    password,
  });

  const token =
    data.token ||
    data.accessToken ||
    data.jwt;

  if (!token) {
    throw new Error(
      "Login succeeded but no authentication token was returned."
    );
  }

  api.saveToken(token);

  if (data.user) {
    api.saveCurrentUser(data.user);
  }

  return data;
};

const register = async (userData) => {
  return api.post("/users/register", userData);
};

const verifyEmail = async (token) => {
  return api.get(`/users/verify-email/${token}`);
};

const initializeAuth = async () => {
  if (redirectIfAuthenticated()) {
    return;
  }

  if (isPublicPage()) {
    return;
  }

  if (!requireAuth()) {
    return;
  }

  const savedUser = api.getCurrentUser();

  if (savedUser) {
    updateUserUI(savedUser);
  }

  const freshUser = await loadCurrentUser();

  if (freshUser) {
    updateUserUI(freshUser);
  }

  setupLogoutButtons();
};

window.auth = {
  login,
  register,
  verifyEmail,
  logout,
  requireAuth,
  initializeAuth,
  getCurrentUser: api.getCurrentUser,
  loadCurrentUser,
  updateUserUI,
};