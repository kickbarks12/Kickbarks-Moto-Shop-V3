const navCart = JSON.parse(localStorage.getItem("cart")) || [];
const count = navCart.reduce((sum, item) => sum + (item.qty || 1), 0);

const badge = document.getElementById("cartCount");
if (badge) badge.innerText = count;


