import { clearCart, displayCart } from "../../assets/js/cart.js";

displayCart();

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

const checkoutButton = document.querySelector(".checkout-button");
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
    infoParagraph.textContent = `Customer Information:\n`;

    for (const key in savedCheckoutInfo) {
      infoParagraph.textContent += `${key}: ${savedCheckoutInfo[key]}\n`;
    }

    modalContent.appendChild(infoParagraph);
  }

  modalCustomerInfo.innerHTML = "";

  modalCustomerInfo.appendChild(modalContent);

  modal.style.display = "block";
  // modalCustomerInfo.style.display = "block";
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
