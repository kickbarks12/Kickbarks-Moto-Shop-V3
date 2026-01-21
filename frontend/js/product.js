// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let product;

// Load product details
fetch(`/api/products/${id}`)
  .then(res => res.json())
  .then(p => {
    product = p;

    document.getElementById("name").innerText = p.name;
    document.getElementById("image").src = p.image;
    document.getElementById("desc").innerText = p.description;
    document.getElementById("price").innerText = p.price;
    // document.getElementById("addBtn").disabled = false;

    renderReviews(p.reviews || []);
  });

// Add to cart
function add() {
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const found = cart.find(i => i._id === product._id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Added to cart");
}



// Render reviews
function renderReviews(reviews) {
  const reviewsEl = document.getElementById("reviews");
  reviewsEl.innerHTML = "";

  if (reviews.length === 0) {
    reviewsEl.innerHTML = "<p>No reviews yet</p>";
    return;
  }

  fetch("/api/users/me", { credentials: "include" })
    .then(res => res.ok ? res.json() : null)
    .then(user => {
      reviewsEl.innerHTML = reviews.map(r => {
        const isMine = user && r.userId === user._id;

        return `
          <div class="border p-2 mb-2">
            <strong>${r.userName}</strong>
            — ${"★".repeat(r.rating)}
            <p>${r.comment}</p>
            <small>${new Date(r.date).toLocaleDateString()}</small>

            ${isMine ? `
              <div class="mt-2">
                <button class="btn btn-sm btn-warning"
                  onclick="editReview(${r.rating}, '${r.comment.replace(/'/g, "\\'")}')">
                  Edit
                </button>
                <button class="btn btn-sm btn-danger"
                  onclick="deleteReview()">
                  Delete
                </button>
              </div>
            ` : ""}
          </div>
        `;
      }).join("");
    });
}


// Submit review
function submitReview() {
  fetch(`/api/products/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      userName: "Customer",
      rating: rating.value,
      comment: comment.value
    })
  })
    .then(res => {
      if (!res.ok) {
        alert("Please login to leave a review");
        location.href = "/login.html";
        return;
      }
      return res.json();
    })
    .then(reviews => {
      renderReviews(reviews);
      comment.value = "";
    });
}

function editReview(ratingVal, commentVal) {
  rating.value = ratingVal;
  comment.value = commentVal;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function deleteReview() {
  if (!confirm("Delete your review?")) return;

  fetch(`/api/products/${id}/reviews`, {
    method: "DELETE",
    credentials: "include"
  })
    .then(res => res.json())
    .then(reviews => renderReviews(reviews));
}
