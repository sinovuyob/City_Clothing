// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = calculateTotal();

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clear-cart");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Add to cart buttons (on product.html)
if (addToCartButtons) {
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);

      cart.push({ name, price });
      saveCart();
      renderCart();
      alert(`${name} added to cart!`);
    });
  });
}

// Render cart (for cart.html)
function renderCart() {
  if (!cartItems) return; // only run on cart page

  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - R${item.price.toFixed(2)} 
      <button onclick="removeItem(${index})">❌</button>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = `Total: R${calculateTotal().toFixed(2)}`;
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Thank you for your purchase!");
    cart = [];
    saveCart();
    renderCart();
  });
}

// Clear cart
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

// Helpers
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

// Render cart if on cart page
renderCart();
