// Lab 8 - Input Validation + XSS Protection

// Sanitize user input to block XSS attacks
function sanitize(input) {
    return input.replace(/[&<>"']/g, function (char) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return map[char];
    });
}

function validateForm() {
    const fname = sanitize(document.getElementById("fname").value.trim());
    const lname = sanitize(document.getElementById("lname").value.trim());
    const email = sanitize(document.getElementById("email").value.trim());
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    // Check empty fields
    if (!fname || !lname || !email || !password || !confirm) {
        errorMsg.textContent = "All fields are required.";
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Please enter a valid email address.";
        return false;
    }

    // Check password match
    if (password !== confirm) {
        errorMsg.textContent = "Passwords do not match.";
        return false;
    }

    alert("Form submitted successfully!");
    return true;
}
