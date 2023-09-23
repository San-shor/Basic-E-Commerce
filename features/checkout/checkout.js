import { displayCart } from "../../assets/js/cart.js";

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

  modal.appendChild(modalContent);

  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}
checkoutButton.addEventListener("click", SaveCustomerInfo);
closeButton.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);
