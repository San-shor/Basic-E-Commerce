function createCartItemHTML(cartItem) {
  const cartItemHTML = document.createElement("div");

  cartItemHTML.classList.add("cart-item");
  cartItemHTML.innerHTML = `
    <img class="item-img" src="${cartItem.image}" alt="${cartItem.name}">
    <p>${cartItem.name}</p>
    <p class="sub-total">৳ ${cartItem.price * cartItem.quantity}</p>
  
    <div class="quantity-control">
      <button class="increase">+</button>
      <input type="number" class="quantity-input" value="${cartItem.quantity}">
      <button class="decrease">-</button>
    </div>
    <img class="delete-item" src="../../assets/trash-bin.png">
  `;

  return cartItemHTML;
}

async function displayCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  const savedCart = localStorage.getItem("shoppingCart");

  if (!savedCart) {
    return;
  }

  let cartItems = JSON.parse(savedCart);
  let totalPrice = 0;

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
          totalPrice += subTotal;
          cartItemHTML.querySelector(
            ".sub-total"
          ).textContent = `৳ ${subTotal.toFixed(2)}`;
          getCurrentTotal();
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
    });
  });

  getCurrentTotal();
}

function getCurrentTotal() {
  const savedCart = localStorage.getItem("shoppingCart");
  const cartItems = JSON.parse(savedCart);
  let total = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total Price:  ৳${total}`;
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
}

export { displayCart, clearCart };
