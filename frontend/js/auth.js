// function signup() {
//   fetch("http://localhost:4000/api/auth/signup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({
//       name: name.value,
//       email: email.value,
//       password: password.value
//     })
//   })
//     .then(res => res.json())
//     .then(() => {
//       location.href = "profile.html";
//     });
// }

function signup(e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  fetch("http://localhost:4000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error || data.msg) {
        alert(data.error || data.msg);
        return;
      }
      window.location.href = "profile.html";
    })
    .catch(err => {
      console.error(err);
      alert("Signup failed");
    });
}

function login(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      return res.json();
    })
    .then(data => {
      // store token IF backend sends one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      window.location.href = "/profile.html";
    })
    .catch(err => {
      alert(err.message);
    });
}
function requestReset(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed");
      return res.json();
    })
    .then(() => {
      showToast("Reset link sent to your email 📧");
    })
    .catch(() => {
      showToast("If the email exists, a reset link was sent.");
    });
}

