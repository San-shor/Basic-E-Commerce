const catergoryItems = document.getElementById("category-items");
let result = "";
let existingCategory = [];

// fetch data and show data on index page
async function displayCatergory() {
  try {
    const response = await fetch("./features/products/category.json");
    const catergories = await response.json();
    console.log(catergories);
    catergories.forEach((category) => {
      // if (existingCategory.includes(product.category)) return;
      // existingCategory.push(product.category);
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

// cart click event
const cartLogo = document.getElementById("cart-logo");
cartLogo.addEventListener("click", function () {
  window.location.href = "./features/cart/cart.html";
});
