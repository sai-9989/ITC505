/* script.js
   Lab 8 — Input Validation + XSS protections
   - sanitize() to neutralize common XSS characters
   - Live validation + inline messages
   - Password strength meter
   - Show/hide password
   - Final validate on submit
*/

/* ---------- Utility: sanitize input to prevent XSS ---------- */
/* Escapes characters <, >, &, ", ' so they cannot be interpreted as HTML */
function sanitize(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- Element refs ---------- */
const form = document.getElementById('registrationForm');
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirm = document.getElementById('confirm');

const errFname = document.getElementById('err-fname');
const errLname = document.getElementById('err-lname');
const errEmail = document.getElementById('err-email');
const errPassword = document.getElementById('err-password');
const errConfirm = document.getElementById('err-confirm');

const globalMsg = document.getElementById('globalMsg');
const validateBtn = document.getElementById('validateBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const togglePassword = document.getElementById('togglePassword');

const fieldsMap = {
  fname: { el: fname, wrapper: document.getElementById('field-fname'), err: errFname },
  lname: { el: lname, wrapper: document.getElementById('field-lname'), err: errLname },
  email: { el: email, wrapper: document.getElementById('field-email'), err: errEmail },
  password: { el: password, wrapper: document.getElementById('field-password'), err: errPassword },
  confirm: { el: confirm, wrapper: document.getElementById('field-confirm'), err: errConfirm }
};

/* ---------- Validation rules ---------- */
function isEmpty(v) { return !v || v.trim().length === 0; }

function validEmail(v) {
  // RFC-like simple validation (sufficient for client-side)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v);
}

function checkPasswordStrength(pw) {
  let score = 0;
  if (!pw) return { score: 0, label: 'Too weak' };
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  let label = 'Weak';
  if (score <= 1) label = 'Too weak';
  else if (score === 2) label = 'Weak';
  else if (score === 3) label = 'Medium';
  else if (score === 4) label = 'Strong';
  else if (score >= 5) label = 'Excellent';

  return { score, label };
}

/* ---------- UI helpers ---------- */
function markFieldOK(name) {
  const f = fieldsMap[name];
  f.wrapper.classList.remove('error');
  f.wrapper.classList.add('success');
  f.err.textContent = '';
}

function markFieldError(name, message) {
  const f = fieldsMap[name];
  f.wrapper.classList.add('error');
  f.wrapper.classList.remove('success');
  f.err.textContent = message;
}

/* Clear all inline messages */
function clearFieldMarks() {
  Object.keys(fieldsMap).forEach(k => {
    fieldsMap[k].wrapper.classList.remove('error', 'success');
    fieldsMap[k].err.textContent = '';
  });
  globalMsg.textContent = '';
}

/* ---------- Live validation binding ---------- */
fname.addEventListener('input', () => {
  const v = fname.value.trim();
  if (isEmpty(v)) markFieldError('fname', 'First name required.');
  else if (v.length < 2) markFieldError('fname', 'Too short.');
  else markFieldOK('fname');
});

lname.addEventListener('input', () => {
  const v = lname.value.trim();
  if (isEmpty(v)) markFieldError('lname', 'Last name required.');
  else markFieldOK('lname');
});

email.addEventListener('input', () => {
  const v = email.value.trim();
  if (isEmpty(v)) markFieldError('email', 'Email required.');
  else if (!validEmail(v)) markFieldError('email', 'Invalid email format.');
  else markFieldOK('email');
});

password.addEventListener('input', () => {
  const pw = password.value;
  const strength = checkPasswordStrength(pw);
  // update meter
  const percent = Math.min(100, strength.score * 20);
  strengthBar.style.width = percent + '%';
  strengthText.textContent = strength.label;

  if (pw.length === 0) { markFieldError('password', 'Password required.'); }
  else if (pw.length < 8) { markFieldError('password', 'At least 8 characters.'); }
  else markFieldOK('password');

  // if confirm has value, re-validate confirm match
  if (confirm.value.length > 0) {
    if (confirm.value !== pw) markFieldError('confirm', 'Passwords do not match.');
    else markFieldOK('confirm');
  }
});

confirm.addEventListener('input', () => {
  if (confirm.value !== password.value) markFieldError('confirm', 'Passwords do not match.');
  else if (confirm.value.length === 0) markFieldError('confirm', 'Please confirm password.');
  else markFieldOK('confirm');
});

/* ---------- show/hide password ---------- */
togglePassword.addEventListener('click', () => {
  const type = password.type === 'password' ? 'text' : 'password';
  password.type = type;
  confirm.type = type;
  togglePassword.textContent = (type === 'text') ? 'Hide' : 'Show';
  togglePassword.setAttribute('aria-pressed', type === 'text' ? 'true' : 'false');
});

/* ---------- Validation runner used on submit / validate button ---------- */
function validateAll() {
  clearFieldMarks();
  let ok = true;

  const f = sanitize(fname.value.trim());
  const l = sanitize(lname.value.trim());
  const e = sanitize(email.value.trim());
  const p = password.value;
  const c = confirm.value;

  // Empty checks
  if (isEmpty(f)) { markFieldError('fname', 'First name is required.'); ok = false; } else markFieldOK('fname');
  if (isEmpty(l)) { markFieldError('lname', 'Last name is required.'); ok = false; } else markFieldOK('lname');

  if (isEmpty(e)) { markFieldError('email', 'Email is required.'); ok = false; }
  else if (!validEmail(e)) { markFieldError('email', 'Enter a valid email address.'); ok = false; }
  else markFieldOK('email');

  if (isEmpty(p)) { markFieldError('password', 'Password is required.'); ok = false; }
  else if (p.length < 8) { markFieldError('password', 'Password must be at least 8 characters.'); ok = false; }
  else markFieldOK('password');

  if (isEmpty(c)) { markFieldError('confirm', 'Confirm your password.'); ok = false; }
  else if (c !== p) { markFieldError('confirm', 'Passwords do not match.'); ok = false; }
  else markFieldOK('confirm');

  // If email looks like script injection (very rare), fail safe: sanitize already prevents DOM injection,
  // but client-side can't be solely trusted — server must revalidate.
  if (!ok) {
    globalMsg.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error') || '#ff4f6d';
    globalMsg.textContent = 'Please fix the highlighted errors.';
  } else {
    globalMsg.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success') || '#2ee6a5';
    globalMsg.textContent = 'All checks passed — ready to submit.';
  }

  return ok;
}

/* Validate button does not submit, just runs checks & shows sanitized preview (no HTML injection) */
validateBtn.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (validateAll()) {
    // show a sanitized preview (no innerHTML usage) demonstrating input is sanitized
    const preview = `Preview (sanitized): ${sanitize(fname.value)} ${sanitize(lname.value)} — ${sanitize(email.value)}`;
    // use textContent to avoid any accidental HTML parse
    globalMsg.style.color = '#9dd7ff';
    globalMsg.textContent = preview;
  }
});

/* ---------- final submit handler ---------- */
form.addEventListener('submit', (ev) => {
  ev.preventDefault(); // prevent default to simulate behavior for the lab
  const ok = validateAll();
  if (!ok) return;

  // Prepare sanitized payload that would be sent to server (example)
  const payload = {
    firstName: sanitize(fname.value.trim()),
    lastName: sanitize(lname.value.trim()),
    email: sanitize(email.value.trim()),
    // DON'T send password in plain text in a real app; here it's just demonstration.
    // On real apps, send over HTTPS and hashed server-side.
  };

  // NOTE: This client-side code demonstrates validation + sanitization.
  // Real security requires server-side validation and parameterized queries to prevent SQLi.
  // Simulate successful submit (for lab)
  globalMsg.style.color = '#2ee6a5';
  globalMsg.textContent = 'Form validated and ready. (Simulated submit — see server-side requirements in report)';

  // OPTIONAL: Clear form after short delay (simulate submission)
  setTimeout(() => {
    form.reset();
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Too weak';
    clearFieldMarks();
  }, 900);
});

/* ---------- Accessibility: Enter key on any field triggers submit via form submit ---------- */
/* Nothing extra required because form handles submit. */

/* ---------- Notes for grader (console) ---------- */
/* Print sanitized values to console for debugging (safe, not exposing to DOM) */
function debugPrint() {
  console.log('DEBUG_SANITIZED:',
    sanitize(fname.value), sanitize(lname.value), sanitize(email.value)
  );
}
