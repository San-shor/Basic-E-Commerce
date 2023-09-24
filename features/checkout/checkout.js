import { clearCart, createCartItemHTML } from "../../assets/js/cart.js";

// displayCart();

const navbarContainer = document.getElementById("navbar-container");
const cartSlider = document.getElementById("cart-slider");
const closeIcon = document.getElementById("close-icon");

fetch("../../header.html")
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
    const cartLogo = document.getElementById("cart-logo");

    cartLogo.addEventListener("click", function () {
      cartSlider.classList.toggle("right-slide");
    });

    closeIcon.addEventListener("click", function () {
      cartSlider.classList.remove("right-slide");
    });
    cartLogo.style.display = "none";
  })
  .catch((error) => {
    console.error("Error loading the navigation bar:", error);
  });

function displayCartListSummary() {
  const cartList = document.getElementById("cart-list-summary");
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
    });
  });
}

displayCartListSummary();

function SaveCustomerInfo(event) {
  event.preventDefault();
  console.log("helooooooo");
  const form = document.querySelector("form");

  const formData = new FormData(form);

  const checkoutInfo = {};
  formData.forEach((value, key) => {
    checkoutInfo[key] = value;
  });

  localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));
  form.reset();

  openModal();
}

const checkoutButton = document.getElementById("checkout-place-order-button");
const modalCustomerInfo = document.getElementById("modal-customer-info");
const modal = document.getElementById("myModal");
const overlay = document.getElementById("overlay");
const closeButton = document.querySelector(".close");

function openModal() {
  const savedCheckoutInfo = JSON.parse(localStorage.getItem("checkoutInfo"));

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  if (savedCheckoutInfo) {
    const infoParagraph = document.createElement("p");
    infoParagraph.innerHTML = `Customer Information<br/>`;

    for (const key in savedCheckoutInfo) {
      infoParagraph.innerHTML += `${
        key.charAt(0).toUpperCase() + key.slice(1)
      }: ${savedCheckoutInfo[key]}<br/>`;
    }

    modalContent.appendChild(infoParagraph);
  }

  modalCustomerInfo.innerHTML = "";

  modalCustomerInfo.appendChild(modalContent);

  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
  clearCart();
  document.location.href = "/";
}

function fillFormInfoFromLocalStorage() {
  const shippingAddress = localStorage.getItem("checkoutInfo")
    ? JSON.parse(localStorage.getItem("checkoutInfo"))
    : {};
  if (shippingAddress.firstname) {
    const firstNameInputEl = document.getElementById("firstname");
    const lastNameInputEl = document.getElementById("lastname");
    const emailInputEl = document.getElementById("email");
    const phoneInputEl = document.getElementById("phone");
    const addressInputEl = document.getElementById("address");
    firstNameInputEl.value = shippingAddress.firstname;
    lastNameInputEl.value = shippingAddress.lastname;
    emailInputEl.value = shippingAddress.email;
    phoneInputEl.value = shippingAddress.phone;
    addressInputEl.value = shippingAddress.address;
  }
}

fillFormInfoFromLocalStorage();

checkoutButton.addEventListener("click", SaveCustomerInfo);
closeButton.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);
