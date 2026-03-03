import { clearCart, createCartItemHTML, updateCartBadge } from "../../assets/js/cart.js";

const navbarContainer = document.getElementById("navbar-container");
const cartSlider = document.getElementById("cart-slider");
const closeIcon = document.getElementById("close-icon");
const cartOverlay = document.getElementById("cart-overlay");

function openCart() {
  cartSlider.classList.add("right-slide");
  if (cartOverlay) cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartSlider() {
  cartSlider.classList.remove("right-slide");
  if (cartOverlay) cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

fetch("../../header.html")
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
    const cartLogo = document.getElementById("cart-logo");

    cartLogo.addEventListener("click", function () {
      if (cartSlider.classList.contains("right-slide")) {
        closeCartSlider();
      } else {
        openCart();
      }
    });

    closeIcon.addEventListener("click", closeCartSlider);
    if (cartOverlay) {
      cartOverlay.addEventListener("click", closeCartSlider);
    }

    updateCartBadge();
  })
  .catch((error) => {
    console.error("Error loading the navigation bar:", error);
  });

function displayCartListSummary() {
  const cartList = document.getElementById("cart-list-summary");
  cartList.innerHTML = "";
  const savedCart = localStorage.getItem("shoppingCart");

  if (!savedCart || JSON.parse(savedCart).length === 0) {
    cartList.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: #aaa;">
        <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 0.75rem; display: block; color: #ddd;"></i>
        <p style="font-weight: 600; color: #888; margin: 0;">No items in your order</p>
      </div>
    `;
    return;
  }

  let cartItems = JSON.parse(savedCart);
  let totalPrice = 0;

  cartItems.forEach((cartItem, idx) => {
    const cartItemHTML = createCartItemHTML(cartItem);
    cartList.appendChild(cartItemHTML);
    totalPrice += cartItem.price * cartItem.quantity;

    // Quantity input change handler
    cartItemHTML
      .querySelector(".quantity-input")
      .addEventListener("input", (event) => {
        const quantityInput = event.target;
        const newQuantity = parseInt(quantityInput.value);

        if (!isNaN(newQuantity) && newQuantity > 0) {
          cartItems[idx].quantity = newQuantity;
          localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

          const subTotal = cartItem.price * newQuantity;
          cartItemHTML.querySelector(
            ".sub-total"
          ).textContent = `৳ ${subTotal.toFixed(2)}`;
          updateSummaryTotal();
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
      updateSummaryTotal();
      updateCartBadge();
    });
  });

  updateSummaryTotal();
}

function updateSummaryTotal() {
  const savedCart = localStorage.getItem("shoppingCart");
  const summaryTotal = document.getElementById("summary-total");
  if (!savedCart || !summaryTotal) return;

  const cartItems = JSON.parse(savedCart);
  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

  summaryTotal.innerHTML = `<i class="fas fa-receipt" style="margin-right: 0.5rem;"></i> Total: ৳${total.toFixed(2)}`;
  localStorage.setItem("totalPrice", total);
}

displayCartListSummary();

function SaveCustomerInfo(event) {
  event.preventDefault();
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
    const labels = {
      firstname: "First Name",
      lastname: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address"
    };

    let html = '';
    for (const key in savedCheckoutInfo) {
      const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
      html += `<p><strong>${label}:</strong> ${savedCheckoutInfo[key]}</p>`;
    }

    // Add total
    const totalPrice = localStorage.getItem("totalPrice") || 0;
    html += `<p style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #ddd;"><strong>Order Total:</strong> <span style="color: #89c74a; font-weight: 700;">৳${parseFloat(totalPrice).toFixed(2)}</span></p>`;

    modalContent.innerHTML = html;
  }

  modalCustomerInfo.innerHTML = "";
  modalCustomerInfo.appendChild(modalContent);

  modal.style.display = "block";
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
  document.body.style.overflow = "";
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
