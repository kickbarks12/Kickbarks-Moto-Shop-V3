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

function signup() {
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
      if (data.error) {
        alert(data.error);
        return;
      }
      window.location.href = "profile.html";
    })
    .catch(err => {
      console.error(err);
      alert("Signup failed");
    });
}


function login() {
  fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      return res.json();
    })
    .then(() => {
      location.href = "/profile.html";
    })
    .catch(err => {
      alert(err.message);
    });
}
