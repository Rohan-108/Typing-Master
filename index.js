const loginForm = document.getElementById("logInForm");
const signUpForm = document.getElementById("signUpForm");

//authentication
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
  console.log(window.location.pathname);
  if (currentUser === "") {
    if (
      window.location.pathname !== "/index.html" &&
      window.location.pathname !== "/login.html"
    ) {
      window.location.href = "index.html";
    }
  } else {
    if (
      window.location.pathname === "/index.html" ||
      window.location.pathname === "/login.html"
    ) {
      window.location.href = "home.html";
    }
  }
});
//login form
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm.elements["username"].value?.trim();
  const password = loginForm.elements["password"].value?.trim();
  if (username.length === 0 || password.length === 0) {
    alert("Please fill in all fields.");
    return;
  }
  const users = JSON.parse(localStorage.getItem("UserData") || "{}") || [];
  const user = users.find((user) => user.username === username);
  if (!user) {
    alert("User not found.");
    return;
  }
  const isValidPassword = (await hashPassword(password)) === user.password;
  if (!isValidPassword) {
    alert("Invalid password.");
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify(user.username));
  alert("Login successful.");
  window.location.href = "home.html";
});

//signup form
signUpForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = signUpForm.elements["username"].value?.trim();
  const password = signUpForm.elements["password"].value?.trim();
  const email = signUpForm.elements["email"].value;
  // validate email
  if (username.length === 0 || password.length === 0) {
    alert("Please fill in all fields.Value is trimed");
    return;
  }
  if (!emailIsValid(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  // validate password
  if (!checkPassword(password)) {
    alert(
      "Password must contain at least one number, one special character, one uppercase letter, one lowercase letter and at least 8 characters long."
    );
    return;
  }
  // check if username is taken
  if (isUsernameTaken(username)) {
    alert("Username is already taken.");
    return;
  }
  if (isEmailTaken(email)) {
    alert("Email is already taken.");
    return;
  }
  // store user data
  const hashedPassword = await hashPassword(password);
  const users = JSON.parse(localStorage.getItem("UserData")) || [];
  users.push({ username, password: hashedPassword, email });
  localStorage.setItem("UserData", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(username));
  alert("Account created successfully.");
  window.location.href = "home.html";
});

//utility function

function isUsernameTaken(username) {
  const users = JSON.parse(localStorage.getItem("UserData"));
  if (!users) return false;
  return users.some((user) => user.username === username);
}
function isEmailTaken(email) {
  const users = JSON.parse(localStorage.getItem("UserData"));
  if (!users) return false;
  return users.some((user) => user.email === email);
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function checkPassword(str) {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}

// Function to hash the password

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
