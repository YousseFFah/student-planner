const showMessage = (element, message) => {
  if (!element) {
    return;
  }

  element.textContent = message || "";
  element.classList.toggle("visible", Boolean(message));
};

const setButtonLoading = (
  button,
  loading,
  loadingText,
  normalText
) => {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = loading
    ? loadingText
    : normalText;
};

const setupPasswordToggle = (
  inputId,
  buttonId
) => {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) {
    return;
  }

  button.addEventListener("click", () => {
    const showingPassword =
      input.type === "text";

    input.type = showingPassword
      ? "password"
      : "text";

    button.textContent = showingPassword
      ? "Show"
      : "Hide";

    button.setAttribute(
      "aria-label",
      showingPassword
        ? "Show password"
        : "Hide password"
    );
  });
};

const initializeLoginPage = () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  const emailInput =
    document.getElementById("loginEmail");

  const passwordInput =
    document.getElementById("loginPassword");

  const button =
    document.getElementById("loginButton");

  const errorBox =
    document.getElementById("loginError");

  setupPasswordToggle(
    "loginPassword",
    "toggleLoginPassword"
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    showMessage(errorBox, "");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage(
        errorBox,
        "Please enter your email and password."
      );

      return;
    }

    try {
      setButtonLoading(
        button,
        true,
        "Signing in...",
        "Sign In"
      );

      await auth.login(
        email,
        password
      );

      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        errorBox,
        error.message || "Unable to sign in."
      );

      setButtonLoading(
        button,
        false,
        "Signing in...",
        "Sign In"
      );
    }
  });
};

const initializeRegisterPage = () => {
  const form =
    document.getElementById("registerForm");

  if (!form) {
    return;
  }

  const nameInput =
    document.getElementById("registerName");

  const emailInput =
    document.getElementById("registerEmail");

  const passwordInput =
    document.getElementById("registerPassword");

  const confirmPasswordInput =
    document.getElementById("confirmPassword");

  const button =
    document.getElementById("registerButton");

  const errorBox =
    document.getElementById("registerError");

  const successBox =
    document.getElementById("registerSuccess");

  setupPasswordToggle(
    "registerPassword",
    "toggleRegisterPassword"
  );

  setupPasswordToggle(
    "confirmPassword",
    "toggleConfirmPassword"
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    showMessage(errorBox, "");
    showMessage(successBox, "");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword =
      confirmPasswordInput.value;

    if (!name) {
      showMessage(
        errorBox,
        "Please enter your name."
      );

      return;
    }

    if (!email) {
      showMessage(
        errorBox,
        "Please enter your email."
      );

      return;
    }

    if (password.length < 6) {
      showMessage(
        errorBox,
        "Password must be at least 6 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        errorBox,
        "Passwords do not match."
      );

      return;
    }

    try {
      setButtonLoading(
        button,
        true,
        "Creating account...",
        "Create Account"
      );

      await auth.register({
        name,
        email,
        password,
      });

      showMessage(
        successBox,
        "Account created successfully. Please check your email to verify your account."
      );

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2500);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      showMessage(
        errorBox,
        error.message ||
          "Unable to create your account."
      );

      setButtonLoading(
        button,
        false,
        "Creating account...",
        "Create Account"
      );
    }
  });
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeLoginPage();
    initializeRegisterPage();
  }
);