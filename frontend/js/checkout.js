const cart = JSON.parse(localStorage.getItem("cart")) || [];
const checkoutItems = document.getElementById("checkoutItems");
const subtotalEl = document.getElementById("subtotal");
const voucherUsedEl = document.getElementById("voucherUsed");
const finalTotalEl = document.getElementById("finalTotal");

let subtotal = 0;

checkoutItems.innerHTML = cart.map(item => {
  subtotal += item.price * item.qty;
  return `<li class="list-group-item">
    ${item.name} × ${item.qty} — ₱${item.price * item.qty}
  </li>`;
}).join("");

subtotalEl.innerText = subtotal;

function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    showToast("Cart is empty");
    return;
  }

  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ items: cart })
  })
    .then(res => {
      if (!res.ok) throw new Error("Order failed");
      return res.json();
    })
    .then(() => {
      localStorage.removeItem("cart");
      showToast("Order placed successfully");
      setTimeout(() => {
        window.location.href = "/profile.html";
      }, 1000);
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to place order");
    });
}


