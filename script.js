import { displayCart } from "./assets/js/cart.js";

const navbarContainer = document.getElementById("navbar-container");
const cartSlider = document.getElementById("cart-slider");
const closeIcon = document.getElementById("close-icon");

fetch("header.html")
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
  })
  .catch((error) => {
    console.error("Error loading the navigation bar:", error);
  });

// Function to display category links dynamically
const catergoryItems = document.getElementById("category-items");
let result = "";
let existingCategory = [];

async function displayCatergory() {
  try {
    const response = await fetch("./features/products/category.json");
    const catergories = await response.json();
    console.log(catergories);
    catergories.forEach((category) => {
      result += `<li class="category-item">
      <a href="./features/products/productsList.html?categoryId=${category.id}">
        <div class="category-image">
          <img src="${category.image}" alt="${category.name}">
        </div>
        ${category.name}
      </a>
    </li>
    `;
    });
    catergoryItems.innerHTML = result;
  } catch (error) {}
}

displayCatergory();
displayCart();
