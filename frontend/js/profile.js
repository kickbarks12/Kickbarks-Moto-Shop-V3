
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
// Render addresses
const addressList = document.getElementById("addressList");

if (addressList) {
  if (!user.addresses || user.addresses.length === 0) {
    addressList.innerHTML = `
      <li class="list-group-item text-center text-muted">
        No addresses saved
      </li>`;
  } else {
    addressList.innerHTML = user.addresses.map((a, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div>
          <strong>${a.label || "Address"}</strong><br>
          ${a.street}, ${a.city}<br>
          ${a.province || ""} ${a.zip || ""}
        </div>
        <button class="btn btn-sm btn-outline-danger"
          onclick="deleteAddress(${i})">
          ✕
        </button>
      </li>
    `).join("");
  }
}



    // Profile fields
    document.getElementById("welcomeName").innerText = user.name;
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const voucherEl = document.getElementById("profileVouchers");
const mobileEl = document.getElementById("profileMobile");
const birthdayEl = document.getElementById("profileBirthday");


    console.log("PROFILE USER:", user);
      

    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
    if (voucherEl) voucherEl.innerText = user.vouchers ?? 0;



if (mobileEl) {
  mobileEl.innerText =
    user.mobile !== null && user.mobile !== undefined && user.mobile !== ""
      ? user.mobile
      : "—";
}


if (birthdayEl) {
  birthdayEl.innerText = user.birthday
    ? new Date(user.birthday).toLocaleDateString()
    : "—";
}

if (mobileEl) {
  mobileEl.innerText =
    user.mobile !== null && user.mobile !== undefined && user.mobile !== ""
      ? user.mobile
      : "—";
}


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

  ordersEl.innerHTML = orders.map(o => {
  let badgeClass = "bg-warning text-dark";

  if (o.status === "completed") badgeClass = "bg-success";
  if (o.status === "cancelled") badgeClass = "bg-danger";

  return `
    <li class="list-group-item">
      <a href="/order.html?id=${o._id}" class="text-decoration-none text-dark">
        <strong>₱${o.total}</strong><br>
        Status:
        <span class="badge ${badgeClass}">
          ${o.status}
        </span><br>
        <small>${new Date(o.date).toLocaleString()}</small>
      </a>
    </li>
  `;
}).join("");
  })


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

document.getElementById("addressForm")?.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/users/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      label: document.getElementById("addrLabel").value,
      street: document.getElementById("addrStreet").value,
      city: document.getElementById("addrCity").value,
      province: document.getElementById("addrProvince").value,
      zip: document.getElementById("addrZip").value
    })
  })
    .then(res => res.json())
    .then(() => location.reload());
});
function deleteAddress(index) {
  fetch(`/api/users/addresses/${index}`, {
    method: "DELETE",
    credentials: "include"
  })
    .then(() => location.reload());
}
