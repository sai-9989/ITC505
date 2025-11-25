// prevent XSS
function clean(str) {
  return str.replace(/[<>]/g, "");
}

function $(id) {
  return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("registerForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let first = clean($("firstName").value.trim());
    let last = clean($("lastName").value.trim());
    let email = clean($("email").value.trim());
    let pass = $("password").value;
    let cpass = $("confirmPassword").value;

    let valid = true;

    // reset errors
    $("firstNameErr").textContent = "";
    $("lastNameErr").textContent = "";
    $("emailErr").textContent = "";
    $("passwordErr").textContent = "";
    $("confirmPasswordErr").textContent = "";
    $("msg").textContent = "";

    // First name
    if (first === "") {
      $("firstNameErr").textContent = "First name required";
      valid = false;
    }

    // Last name
    if (last === "") {
      $("lastNameErr").textContent = "Last name required";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $("emailErr").textContent = "Invalid email format";
      valid = false;
    }

    // Password
    if (pass.length < 8) {
      $("passwordErr").textContent = "Password must be at least 8 characters";
      valid = false;
    }

    // Confirm password
    if (pass !== cpass) {
      $("confirmPasswordErr").textContent = "Passwords do not match";
      valid = false;
    }

    if (!valid) return;

    $("msg").innerHTML = `<div class="success">✔ Registration Successful</div>`;
  });
});
