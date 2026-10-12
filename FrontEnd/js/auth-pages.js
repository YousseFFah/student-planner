const showMessage = (element, message) => {
  if (!element) {
    return;
  }

  element.textContent = message || "";
  element.classList.toggle("visible", Boolean(message));
};

const setButtonLoading = (button, loading, loadingText, normalText) => {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = loading ? loadingText : normalText;
};

const setupPasswordToggle = (inputId, buttonId) => {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) {
    return;
  }

  const updateToggleText = () => {
    const isVisible = input.type === "text";
    const key = isVisible ? "hide" : "show";

    button.textContent = t(key);
    button.setAttribute("aria-label", t(key));
  };

  button.addEventListener("click", () => {
    input.type = input.type === "text" ? "password" : "text";
    updateToggleText();
  });

  document.addEventListener("languageChanged", updateToggleText);
  updateToggleText();
};

const initializeLoginPage = () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const button = document.getElementById("loginButton");
  const errorBox = document.getElementById("loginError");

  setupPasswordToggle("loginPassword", "toggleLoginPassword");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(errorBox, "");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage(errorBox, t("enterEmailPassword"));
      return;
    }

    try {
      setButtonLoading(button, true, t("signingIn"), t("signIn"));

      await auth.login(email, password);

      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.message === "Please verify your email first"
          ? t("pleaseVerifyEmail")
          : error.message === "Invalid email or password"
            ? t("invalidCredentials")
            : error.message || t("loginFailed");

      showMessage(errorBox, message);
      setButtonLoading(button, false, t("signingIn"), t("signIn"));
    }
  });

  document.addEventListener("languageChanged", () => {
    if (!button.disabled) {
      button.textContent = t("signIn");
    }
  });
};

const initializeRegisterPage = () => {
  const form = document.getElementById("registerForm");

  if (!form) {
    return;
  }

  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const button = document.getElementById("registerButton");
  const errorBox = document.getElementById("registerError");
  const successBox = document.getElementById("registerSuccess");

  setupPasswordToggle("registerPassword", "toggleRegisterPassword");
  setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    showMessage(errorBox, "");
    showMessage(successBox, "");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name) {
      showMessage(errorBox, t("enterYourName"));
      return;
    }

    if (!email) {
      showMessage(errorBox, t("enterYourEmail"));
      return;
    }

    if (password.length < 6) {
      showMessage(errorBox, t("passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      showMessage(errorBox, t("passwordsMismatch"));
      return;
    }

    try {
      setButtonLoading(button, true, t("creatingAccount"), t("createAccount"));

      await auth.register({
        name,
        email,
        password,
      });

      showMessage(successBox, t("accountCreated"));

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2500);
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.message === "Email already exists"
          ? t("emailAlreadyExists")
          : error.message || t("registerFailed");

      showMessage(errorBox, message);

      setButtonLoading(button, false, t("creatingAccount"), t("createAccount"));
    }
  });

  document.addEventListener("languageChanged", () => {
    if (!button.disabled) {
      button.textContent = t("createAccount");
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeLoginPage();
  initializeRegisterPage();
});
