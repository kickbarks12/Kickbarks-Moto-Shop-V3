// const cart = JSON.parse(localStorage.getItem("cart")) || [];
// const checkoutItems = document.getElementById("checkoutItems");
// const subtotalEl = document.getElementById("subtotal");
// const voucherUsedEl = document.getElementById("voucherUsed");
// const finalTotalEl = document.getElementById("finalTotal");

// let subtotal = 0;

// checkoutItems.innerHTML = cart.map(item => {
//   subtotal += item.price * item.qty;
//   return `<li class="list-group-item">
//     ${item.name} × ${item.qty} — ₱${item.price * item.qty}
//   </li>`;
// }).join("");

// subtotalEl.innerText = subtotal;

// // const cart = JSON.parse(localStorage.getItem("cart")) || [];
// // const appliedVoucher = Number(localStorage.getItem("appliedVoucher")) || 0;

// // let subtotal = 0;
// // cart.forEach(item => {
// //   subtotal += item.price * item.qty;
// // });

// // let total = subtotal - appliedVoucher;
// // if (total < 0) total = 0;

const cart = JSON.parse(localStorage.getItem("cart")) || [];


const checkoutItems = document.getElementById("checkoutItems");
const subtotalEl = document.getElementById("subtotal");

const finalTotalEl = document.getElementById("finalTotal");

let subtotal = 0;

checkoutItems.innerHTML = cart.map(item => {
  subtotal += item.price * item.qty;
  return `<li class="list-group-item">
    ${item.name} × ${item.qty} — ₱${item.price * item.qty}
  </li>`;
}).join("");

let finalTotal = subtotal
if (finalTotal < 0) finalTotal = 0;

subtotalEl.innerText = subtotal;

finalTotalEl.innerText = finalTotal;


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
    body: JSON.stringify({
      items: cart,
      
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Order failed");
      return res.json();
    })
    .then(data => {
      localStorage.removeItem("cart");
      

      const earned = Number(data.cashbackEarned);

if (earned > 0) {
  showToast(`Order placed! You earned ₱${earned} store credit`);
} else {
  showToast("Order placed successfully");
}


      setTimeout(() => {
        window.location.href = "/profile.html";
      }, 1200);
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to place order");
    });
}



