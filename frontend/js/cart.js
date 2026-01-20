let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");

function renderCart() {
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="list-group-item text-center">
      Your cart is empty
    </li>`;
    totalEl.innerText = 0;
    return;
  }

  cartList.innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;

    return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.name}</strong><br>
          ₱${item.price} × ${item.qty}
        </div>
        <div>
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, -1)">−</button>
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">✕</button>
        </div>
      </li>
    `;
  }).join("");

  totalEl.innerText = total;
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
