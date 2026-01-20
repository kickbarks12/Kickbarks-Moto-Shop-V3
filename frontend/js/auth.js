function signup() {
  fetch("http://localhost:4000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  })
    .then(res => res.json())
    .then(() => {
      location.href = "profile.html";
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
