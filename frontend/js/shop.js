let wishlistIds = [];

fetch("/api/users/wishlist-ids", { credentials: "include" })
  .then(res => res.json())
  .then(ids => {
    wishlistIds = ids;
  });


let allProducts = [];

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");

fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products);
  });

function renderProducts(products) {
  productList.innerHTML = products.map(p => `
    <div class="col-md-4 mb-3">
      <div class="card h-100">
        <img src="${p.image}" class="card-img-top">
        <div class="card-body">
          <h5>
            <a href="/product.html?id=${p._id}">
              ${p.name}
            </a>
          </h5>
          
<p class="fw-bold text-success fs-5">
  ₱${p.price}
</p>

          <div class="card-body">
  

  <button class="btn btn-primary"
  onclick='addCart(${JSON.stringify(p)})'>
  Add to Cart
</button>


  <button
  class="btn btn-sm ms-2 ${wishlistIds.includes(p._id) ? "btn-danger" : "btn-outline-danger"}"
  onclick="toggleWishlist('${p._id}')"
>
  ♥
</button>

</div>

            
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
});

priceFilter.addEventListener("change", () => {
  let sorted = [...allProducts];

  if (priceFilter.value === "low") {
    sorted.sort((a, b) => a.price - b.price);
  }

  if (priceFilter.value === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
});


function toggleWishlist(productId) {
  fetch(`/api/users/wishlist/${productId}`, {
    method: "POST",
    credentials: "include"
  })
    .then(res => {
      if (res.status === 401) {
        alert("Please login to use wishlist");
        location.href = "/login.html";
        return;
      }
      return fetch("/api/users/wishlist-ids", {
        credentials: "include"
      });
    })
    .then(res => res.json())
    .then(ids => {
      wishlistIds = ids;
      renderProducts(allProducts);
    });
}
// function addToCart(product) {
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];
//   const found = cart.find(i => i._id === product._id);

//   if (found) found.qty += 1;
//   else cart.push({ ...product, qty: 1 });

//   localStorage.setItem("cart", JSON.stringify(cart));
//   showToast("Added to cart");
// }
function addCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const found = cart.find(i => i._id === product._id);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Added to cart");
}
