// --- Basic XSS sanitization helper ---
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Simple email regex for client-side validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Disallow obvious XSS characters/patterns
function containsXSSChars(str) {
  if (!str) return false;
  const lowered = str.toLowerCase();
  return (
    lowered.includes("<") ||
    lowered.includes(">") ||
    lowered.includes("script") ||
    lowered.includes("onerror=") ||
    lowered.includes("onload=")
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const formMessage = document.getElementById("formMessage");

  const fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword")
  };

  const errors = {
    firstName: document.getElementById("firstNameError"),
    lastName: document.getElementById("lastNameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError")
  };

  // Utility to show error on a single field
  function showError(fieldKey, message) {
    const field = fields[fieldKey];
    const errorElement = errors[fieldKey];

    if (!field || !errorElement) return;

    errorElement.textContent = message || "";
    const shell = field.closest(".field-shell");

    if (shell) {
      if (message) {
        shell.classList.add("has-error");
      } else {
        shell.classList.remove("has-error");
      }
    }
  }

  // Validate a single field
  function validateField(fieldKey) {
    const value = fields[fieldKey].value.trim();

    // Check for empty fields
    if (!value) {
      showError(fieldKey, "This field is required.");
      return false;
    }

    // Basic XSS block
    if (containsXSSChars(value)) {
      showError(fieldKey, "Input contains forbidden characters.");
      return false;
    }

    if (fieldKey === "email") {
      if (!emailRegex.test(value)) {
        showError(fieldKey, "Please enter a valid email address.");
        return false;
      }
    }

    if (fieldKey === "password") {
      if (value.length < 8) {
        showError(fieldKey, "Password must be at least 8 characters.");
        return false;
      }
    }

    if (fieldKey === "confirmPassword") {
      const passwordValue = fields.password.value.trim();
      if (value !== passwordValue) {
        showError(fieldKey, "Passwords do not match.");
        return false;
      }
    }

    // Clear error
    showError(fieldKey, "");
    return true;
  }

  // Real-time validation while typing
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("input", () => {
      validateField(key);

      // If password changes, re-check confirmPassword
      if (key === "password" && fields.confirmPassword.value.trim()) {
        validateField("confirmPassword");
      }
    });
  });

  // Handle submit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent actual submit (no backend in lab)

    formMessage.textContent = "";
    formMessage.classList.remove("success", "error");

    let allValid = true;

    // Validate each field
    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) {
        allValid = false;
      }
    });

    if (!allValid) {
      formMessage.textContent =
        "Please fix the highlighted fields and try again.";
      formMessage.classList.add("error");
      return;
    }

    // At this point inputs are checked and sanitized before any display
    const safeFirstName = sanitizeInput(fields.firstName.value.trim());
    const safeLastName = sanitizeInput(fields.lastName.value.trim());
    const safeEmail = sanitizeInput(fields.email.value.trim());

    formMessage.innerHTML =
      `✅ Form submitted successfully (client-side).<br>` +
      `Welcome, <strong>${safeFirstName} ${safeLastName}</strong> &mdash; ` +
      `we will contact you at <strong>${safeEmail}</strong>.`;
    formMessage.classList.add("success");

    // Optionally clear the form (for demo)
    // form.reset();
  });
});
