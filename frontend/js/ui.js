function showLoader() {
  document.getElementById("loader")?.classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("loader")?.classList.add("d-none");
}
function showToast(message) {
  const body = document.getElementById("toastBody");
  const toastEl = document.getElementById("toast");

  if (!body || !toastEl) {
    console.warn("Toast HTML missing:", message);
    return;
  }

  body.innerText = message;
  new bootstrap.Toast(toastEl).show();
}

