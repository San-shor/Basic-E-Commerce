async function displayCart() {
  const cartList = document.getElementById("cart-list");

  const savedCart = localStorage.getItem("shoppingCart");
  if (!savedCart) {
    return;
  }

  const cartItems = JSON.parse(savedCart);
  console.log(cartItems);

  let totalPrice = 0;

  cartItems.forEach((cartItem) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
        <h3>${cartItem.name}</h3>
        <p>Price: &#2547 ${cartItem.price}</p>
        <p>Quantity: ${cartItem.quantity}</p>
      `;
    cartList.appendChild(cartItemElement);
  });

  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
  }
}

window.addEventListener("load", function () {
  displayCart();
});
