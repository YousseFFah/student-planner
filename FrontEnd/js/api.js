const API_BASE_URL = "http://localhost:3000";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Make sure the backend is running."
    );
  }

  const contentType = response.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "Something went wrong.";

    throw new Error(message);
  }

  return data;
};

const get = (endpoint) => {
  return request(endpoint, {
    method: "GET",
  });
};

const post = (endpoint, body = {}) => {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const patch = (endpoint, body = {}) => {
  return request(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

const remove = (endpoint) => {
  return request(endpoint, {
    method: "DELETE",
  });
};

const saveToken = (token) => {
  localStorage.setItem("token", token);
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};

const isLoggedIn = () => {
  return Boolean(getToken());
};

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("currentUser");

    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const saveCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

window.api = {
  get,
  post,
  patch,
  delete: remove,
  saveToken,
  clearAuth,
  isLoggedIn,
  getToken,
  getCurrentUser,
  saveCurrentUser,
};