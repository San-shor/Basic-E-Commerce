// Fetch and insert the navigation bar from "header.html" into the container
const navbarContainer = document.getElementById("navbar-container");

fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
    const cartLogo = document.getElementById("cart-logo");
    cartLogo.addEventListener("click", function () {
      window.location.href = "./features/cart/cart.html";
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
      result += `<li>
              <img src="${category.image}" alt="${category.name}">
            <a href="./features/products/productsList.html?category=${category.name}">
              ${category.name}
            </a>
          </li>`;
    });
    catergoryItems.innerHTML = result;
  } catch (error) {}
}

displayCatergory();

// Add a click event listener to the cart logo to navigate to the cart page
//
