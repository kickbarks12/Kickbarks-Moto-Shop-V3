// fetch("/api/users/me", { credentials: "include" })
//   .then(res => {
//     if (!res.ok) {
//       window.location.href = "/login.html";
//       return null;
//     }
//     return res.json();
//   })
//   .then(user => {
//     if (!user) return;

//    const nameEl = document.getElementById("profileName");
//     const emailEl = document.getElementById("profileEmail");
//     const voucherEl = document.getElementById("profileVouchers");

//     if (nameEl) nameEl.innerText = user.name || "—";
//     if (emailEl) emailEl.innerText = user.email;
//     if (voucherEl) voucherEl.innerText = user.vouchers || 0;
//   });
document.addEventListener("DOMContentLoaded", () => {
fetch("/api/users/me", { credentials: "include" })
  .then(res => {
    if (!res.ok) {
      window.location.href = "/login.html";
      return null;
    }
    return res.json();
  })
  .then(user => {
    if (!user) return;

    // Profile fields
    document.getElementById("welcomeName").innerText = user.name;
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const voucherEl = document.getElementById("profileVouchers");

    console.log("PROFILE USER:", user);
      console.log("NAME ELEMENT:", nameEl);

    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
    if (voucherEl) voucherEl.innerText = user.vouchers;
  });
})


fetch("/api/orders", { credentials: "include" })
  .then(res => res.json())
  .then(orders => {
    const ordersEl = document.getElementById("orders");

    if (orders.length === 0) {
      ordersEl.innerHTML = `
        <li class="list-group-item text-center">
          No orders yet
        </li>`;
      return;
    }

    ordersEl.innerHTML = orders.map(o => `
      <li class="list-group-item">
  <a href="/order.html?id=${o._id}" class="text-decoration-none text-dark">
    <strong>₱${o.total}</strong><br>
    Status:
    <span class="badge bg-warning text-dark">
      ${o.status}
    </span><br>
    <small>${new Date(o.date).toLocaleString()}</small>
  </a>
</li>

    `).join("");
  });


function logout() {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  })
    .then(() => {
      // Force reload / redirect so navbar updates
      window.location.href = "/index.html";
    })
    .catch(err => {
      console.error("Logout failed", err);
    });
}

fetch("/api/users/wishlist", { credentials: "include" })
  .then(res => res.json())
  .then(items => {
    const wishlistEl = document.getElementById("wishlist");

    if (!items || items.length === 0) {
      wishlistEl.innerHTML = `
        <li class="list-group-item text-center">
          No wishlist items
        </li>`;
      return;
    }

    wishlistEl.innerHTML = items.map(p => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${p.name}</span>
        <div>
          <button class="btn btn-sm btn-primary"
            onclick='addWishlistToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
          <button class="btn btn-sm btn-danger ms-2"
            onclick="removeWishlist('${p._id}')">
            ✕
          </button>
        </div>
      </li>
    `).join("");
  });
function addWishlistToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const found = cart.find(i => i._id === product._id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");

}

function removeWishlist(productId) {
  fetch(`/api/users/wishlist/${productId}`, {
    method: "POST",
    credentials: "include"
  })
    .then(() => location.reload());
}

