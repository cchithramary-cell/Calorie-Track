// ======================================================
// CALORIETRACK AUTHENTICATION + USER-SPECIFIC STORAGE
// ======================================================

const USERS_KEY = "calorieTrackUsers";
const SESSION_KEY = "calorieTrackSession";

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

// Returns a storage key unique to the currently logged-in email.
// Returns null if there is no valid session.
function getUserStorageKey(baseKey) {
  const user = getLoggedInUser();
  if (!user || typeof user.email !== "string" || !user.email.trim()) {
    return null;
  }
  return `${baseKey}_${encodeURIComponent(user.email.trim().toLowerCase())}`;
}

function protectPage() {
  if (!getLoggedInUser()) {
    window.location.replace("login.html");
    return false;
  }
  return true;
}

function displayLoggedInUser() {
  const user = getLoggedInUser();
  const nameElement = document.getElementById("loggedInUser");
  if (user && nameElement) {
    nameElement.textContent = `Welcome, ${user.name || user.email}`;
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.replace("login.html");
}

// The form handlers below support the common IDs used by the project.
// They do nothing on pages without a matching login/register form.
function findField(form, selectors) {
  for (const selector of selectors) {
    const field = form.querySelector(selector);
    if (field) return field;
  }
  return null;
}

function setupRegisterForm() {
  const form =
    document.querySelector(
      "#registerForm, #register-form, #registrationForm, form[data-auth='register']",
    ) ||
    (window.location.pathname.toLowerCase().includes("register")
      ? document.querySelector("form")
      : null);
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameField = findField(form, [
      "#name",
      "#fullName",
      "[name='name']",
      "[name='fullName']",
      "input[name='username']",
    ]);
    const emailField = findField(form, [
      "#email",
      "[name='email']",
      "input[type='email']",
    ]);
    const passwordField = findField(form, [
      "#password",
      "[name='password']",
      "input[type='password']",
    ]);
    const confirmField = findField(form, [
      "#confirmPassword",
      "#confirm-password",
      "[name='confirmPassword']",
      "[name='confirm-password']",
    ]);

    if (!nameField || !emailField || !passwordField) {
      alert(
        "Registration form fields could not be found. Check the name, email, and password input IDs/names.",
      );
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim().toLowerCase();
    const password = passwordField.value;

    if (!name || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }
    if (confirmField && password !== confirmField.value) {
      alert("Passwords do not match.");
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      users = [];
    }
    if (!Array.isArray(users)) users = [];

    if (users.some((user) => String(user.email).toLowerCase() === email)) {
      alert("An account with this email already exists. Please log in.");
      return;
    }

    // Demo only: passwords are stored in LocalStorage as plain text.
    // Do not use this approach for a real/public authentication system.
    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert("Registration successful. Please log in.");
    window.location.href = "login.html";
  });
}

function setupLoginForm() {
  const form =
    document.querySelector(
      "#loginForm, #login-form, form[data-auth='login']",
    ) ||
    (window.location.pathname.toLowerCase().includes("login")
      ? document.querySelector("form")
      : null);
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const emailField = findField(form, [
      "#email",
      "[name='email']",
      "input[type='email']",
    ]);
    const passwordField = findField(form, [
      "#password",
      "[name='password']",
      "input[type='password']",
    ]);

    if (!emailField || !passwordField) {
      alert(
        "Login form fields could not be found. Check the email and password input IDs/names.",
      );
      return;
    }

    const email = emailField.value.trim().toLowerCase();
    const password = passwordField.value;
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      users = [];
    }
    if (!Array.isArray(users)) users = [];

    const user = users.find(
      (item) =>
        String(item.email).toLowerCase() === email &&
        item.password === password,
    );

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        name: user.name,
        email: String(user.email).toLowerCase(),
      }),
    );
    window.location.href = "index.html";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    setupRegisterForm();
    setupLoginForm();
    displayLoggedInUser();
  });
} else {
  setupRegisterForm();
  setupLoginForm();
  displayLoggedInUser();
}
