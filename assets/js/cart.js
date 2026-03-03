function createCartItemHTML(cartItem) {
  const cartItemHTML = document.createElement("div");

  cartItemHTML.classList.add("cart-item");
  cartItemHTML.innerHTML = `
    <img class="item-img" src="${cartItem.image}" alt="${cartItem.name}">
    <div class="cart-item-details">
      <p class="cart-item-name">${cartItem.name}</p>
      <p class="sub-total">৳ ${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
    </div>
    <div class="quantity-control">
      <button class="increase">+</button>
      <input type="number" class="quantity-input" value="${cartItem.quantity}">
      <button class="decrease">−</button>
    </div>
    <button class="delete-item" aria-label="Remove item">
      <i class="fas fa-trash-alt"></i>
    </button>
  `;

  return cartItemHTML;
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const savedCart = localStorage.getItem("shoppingCart");
  if (!savedCart) {
    badge.style.display = "none";
    return;
  }

  const cartItems = JSON.parse(savedCart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems > 99 ? "99+" : totalItems;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function toggleCartEmpty(cartItems) {
  const emptyEl = document.getElementById("cart-empty");
  if (!emptyEl) return;

  if (!cartItems || cartItems.length === 0) {
    emptyEl.style.display = "flex";
  } else {
    emptyEl.style.display = "none";
  }
}

async function displayCart() {
  const cartList = document.getElementById("cart-list");
  if (!cartList) return;

  // Preserve the empty state element
  const emptyEl = cartList.querySelector("#cart-empty");
  cartList.innerHTML = "";
  if (emptyEl) cartList.appendChild(emptyEl);

  const savedCart = localStorage.getItem("shoppingCart");

  if (!savedCart || JSON.parse(savedCart).length === 0) {
    toggleCartEmpty([]);
    updateCartBadge();
    return;
  }

  let cartItems = JSON.parse(savedCart);
  toggleCartEmpty(cartItems);

  cartItems.forEach((cartItem, idx) => {
    const cartItemHTML = createCartItemHTML(cartItem);
    cartList.appendChild(cartItemHTML);

    // Quantity input change handler
    cartItemHTML
      .querySelector(".quantity-input")
      .addEventListener("input", (event) => {
        const quantityInput = event.target;
        const newQuantity = parseInt(quantityInput.value);

        if (!isNaN(newQuantity) && newQuantity > 0) {
          cartItems[idx].quantity = newQuantity;
          localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

          // Update sub-total and total
          const subTotal = cartItem.price * newQuantity;
          cartItemHTML.querySelector(
            ".sub-total"
          ).textContent = `৳ ${subTotal.toFixed(2)}`;
          getCurrentTotal();
          updateCartBadge();
        }
      });

    // Decrease button click handler
    cartItemHTML.querySelector(".decrease").addEventListener("click", () => {
      const quantityInput = cartItemHTML.querySelector(".quantity-input");
      const newQuantity = parseInt(quantityInput.value) - 1;

      if (newQuantity >= 1) {
        quantityInput.value = newQuantity;
        quantityInput.dispatchEvent(new Event("input"));
      }
    });

    // Increase button click handler
    cartItemHTML.querySelector(".increase").addEventListener("click", () => {
      const quantityInput = cartItemHTML.querySelector(".quantity-input");
      const newQuantity = parseInt(quantityInput.value) + 1;
      quantityInput.value = newQuantity;
      quantityInput.dispatchEvent(new Event("input"));
    });

    // Delete item click handler
    cartItemHTML.querySelector(".delete-item").addEventListener("click", () => {
      cartItems = cartItems.filter((item, index) => index != idx);
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
      cartItemHTML.remove();
      getCurrentTotal();
      updateCartBadge();
      toggleCartEmpty(cartItems);
    });
  });

  getCurrentTotal();
  updateCartBadge();
}

function getCurrentTotal() {
  const savedCart = localStorage.getItem("shoppingCart");
  if (!savedCart) return;
  const cartItems = JSON.parse(savedCart);
  let total = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: ৳${total.toFixed(2)}`;
  }
  localStorage.setItem("totalPrice", total);
}

document.addEventListener("DOMContentLoaded", function () {
  const checkoutPage = document.getElementById("checkout-button");
  if (checkoutPage) {
    checkoutPage.addEventListener("click", () => {
      window.location.href = "../../features/checkout/checkout.html";
    });
  }
});

function clearCart() {
  localStorage.setItem("shoppingCart", JSON.stringify([]));
  updateCartBadge();
}

export { displayCart, clearCart, createCartItemHTML, updateCartBadge };
