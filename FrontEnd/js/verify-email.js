let currentVerificationState = null;

const setVerificationState = (state) => {
  currentVerificationState = state;

  const card = document.querySelector(".verification-card");
  const iconElement = document.getElementById("verificationIcon");
  const eyebrowElement = document.getElementById("verificationEyebrow");
  const titleElement = document.getElementById("verificationTitle");
  const messageElement = document.getElementById("verificationMessage");
  const actionsElement = document.getElementById("verificationActions");

  if (
    !card ||
    !iconElement ||
    !eyebrowElement ||
    !titleElement ||
    !messageElement ||
    !actionsElement
  ) {
    return;
  }

  card.classList.remove("success", "error");

  if (state.type) {
    card.classList.add(state.type);
  }

  iconElement.textContent = state.icon;
  eyebrowElement.textContent = t(state.eyebrowKey);
  titleElement.textContent = t(state.titleKey);

  messageElement.textContent = state.messageKey
    ? t(state.messageKey)
    : state.message;

  actionsElement.classList.toggle("hidden", !state.showButton);
};

const getVerificationToken = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

const verifyUserEmail = async () => {
  const token = getVerificationToken();

  if (!token) {
    setVerificationState({
      type: "error",
      eyebrowKey: "verificationFailed",
      titleKey: "missingVerification",
      messageKey: "missingVerificationMessage",
      icon: "!",
      showButton: true,
    });

    return;
  }

  try {
    setVerificationState({
      type: "",
      eyebrowKey: "emailVerification",
      titleKey: "verifyingEmail",
      messageKey: "waitVerification",
      icon: "✓",
      showButton: false,
    });

    await auth.verifyEmail(token);

    setVerificationState({
      type: "success",
      eyebrowKey: "emailVerified",
      titleKey: "emailVerifiedTitle",
      messageKey: "emailVerifiedMessage",
      icon: "✓",
      showButton: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);

    setVerificationState({
      type: "error",
      eyebrowKey: "verificationFailed",
      titleKey: "verificationErrorTitle",
      messageKey: "invalidVerificationMessage",
      icon: "!",
      showButton: true,
    });
  }
};

document.addEventListener("languageChanged", () => {
  if (currentVerificationState) {
    setVerificationState(currentVerificationState);
  }
});

document.addEventListener("DOMContentLoaded", verifyUserEmail);