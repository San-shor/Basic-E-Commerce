async function displayCart() {
  const cartList = document.getElementById("cart-list");

  const savedCart = localStorage.getItem("shoppingCart");
  if (!savedCart) {
    return;
  }

  const cartItems = JSON.parse(savedCart);
  console.log(cartItems);

  let totalPrice = 0;
  let subTotal = 0;

  function getCurrentTotal() {
    let total = 0;
    cartItems.forEach((item) => {
      subTotal = item.price * item.quantity;
      total += subTotal;
    });
    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
      totalPriceElement.textContent = `Total Price: ${total.toFixed(2)}`;
    }
    localStorage.setItem("totalPrice", total.toFixed(2));
  }

  cartItems.forEach((cartItem, idx) => {
    subTotal = cartItem.price * cartItem.quantity;
    totalPrice += subTotal;
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
        <img src="${cartItem.image}" alt="${cartItem.name}">
        <h3>${cartItem.name}</h3>
        <p>Price: &#2547 ${cartItem.price}</p>
        <p>Quantity: ${cartItem.quantity}</p>
        <img  class ="delete-item"
        src="../../assets//remove.png"  >
        <p>Sub Total : ${subTotal}</p>
      `;
    cartList.appendChild(cartItemElement);

    const deleteItem = cartItemElement.querySelector(".delete-item");
    deleteItem.addEventListener("click", () => {
      cartItems.splice(idx, 1);
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
      cartItemElement.remove();
      getCurrentTotal();
    });
  });
  getCurrentTotal();
}

window.addEventListener("load", function () {
  displayCart();
});
