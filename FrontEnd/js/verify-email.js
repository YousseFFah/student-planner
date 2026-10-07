const setVerificationState = ({
  type,
  title,
  message,
  eyebrow,
  icon,
  showButton,
}) => {
  const card =
    document.querySelector(".verification-card");

  const iconElement =
    document.getElementById("verificationIcon");

  const eyebrowElement =
    document.getElementById(
      "verificationEyebrow"
    );

  const titleElement =
    document.getElementById(
      "verificationTitle"
    );

  const messageElement =
    document.getElementById(
      "verificationMessage"
    );

  const actionsElement =
    document.getElementById(
      "verificationActions"
    );

  card.classList.remove(
    "success",
    "error"
  );

  if (type) {
    card.classList.add(type);
  }

  iconElement.textContent = icon;
  eyebrowElement.textContent = eyebrow;
  titleElement.textContent = title;
  messageElement.textContent = message;

  if (showButton) {
    actionsElement.classList.remove("hidden");
  } else {
    actionsElement.classList.add("hidden");
  }
};

const getVerificationToken = () => {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("token");
};

const verifyUserEmail = async () => {
  const token = getVerificationToken();

  if (!token) {
    setVerificationState({
      type: "error",
      eyebrow: "Verification failed",
      title: "Missing verification link",
      message:
        "This verification link is missing or incomplete. Please use the link sent to your email.",
      icon: "!",
      showButton: true,
    });

    return;
  }

  try {
    setVerificationState({
      type: "",
      eyebrow: "Email verification",
      title: "Verifying your email...",
      message:
        "Please wait while we verify your email address.",
      icon: "✓",
      showButton: false,
    });

    await auth.verifyEmail(token);

    setVerificationState({
      type: "success",
      eyebrow: "Email verified",
      title: "Your email is verified!",
      message:
        "Your account is ready. You can now sign in and start using Student Planner.",
      icon: "✓",
      showButton: true,
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    setVerificationState({
      type: "error",
      eyebrow: "Verification failed",
      title: "We couldn't verify your email",
      message:
        error.message ||
        "This verification link may be expired or invalid. Please request a new verification email.",
      icon: "!",
      showButton: true,
    });
  }
};

document.addEventListener(
  "DOMContentLoaded",
  verifyUserEmail
);