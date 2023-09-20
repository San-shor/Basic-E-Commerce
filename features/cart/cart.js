async function displayCart() {
  const cartList = document.getElementById("cart-list");

  const savedCart = localStorage.getItem("shoppingCart");
  if (!savedCart) {
    return;
  }

  const cartItems = JSON.parse(savedCart);

  cartItems.forEach((cartItem) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
        <h3>${cartItem.name}</h3>
        <p>Price: $${cartItem.price.toFixed(2)}</p>
        <p>Quantity: ${cartItem.quantity}</p>
      `;
    cartList.appendChild(cartItemElement);
  });
}

window.addEventListener("load", function () {
  displayCart();
});
