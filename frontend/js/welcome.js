document.addEventListener("DOMContentLoaded", () => {
  // Show popup only once per browser session
  if (sessionStorage.getItem("welcomeShown")) return;

  fetch("/api/users/me", { credentials: "include" })
    .then(res => res.ok ? res.json() : null)
    .then(user => {
      if (user) {
        document.getElementById("welcomeTitle").innerText =
          `Welcome back, ${user.name}!`;
        document.getElementById("welcomeMessage").innerText =
          "Glad to see you again at Kickbarks Moto Shop 🏍️";
      }
    })
    .finally(() => {
      const modal = new bootstrap.Modal(
        document.getElementById("welcomeModal")
      );
      modal.show();
      sessionStorage.setItem("welcomeShown", "true");
    });
});
