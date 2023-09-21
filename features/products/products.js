const navbarContainer = document.getElementById("navbar-container");

fetch("../../header.html")
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
  })
  .catch((error) => {
    console.error("Error loading the navigation bar:", error);
  });

async function displayProducts() {
  const productDataUrl = "products.json";
  const productList = document.getElementById("product-list");
  let params = new URL(document.location).searchParams;
  let category = params.get("category");

  try {
    const response = await fetch(productDataUrl);
    const products = await response.json();

    products.forEach((product) => {
      if (product.category !== category) return;
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");
      productItem.innerHTML = `
                  <img src="${product.image}" alt="${product.name}">
                  <h3>${product.name}</h3>
                  <p>${product.price}</p>
                  <button class="add-to-cart">Add to Cart</button>
  
              `;

      const addToCartButton = productItem.querySelector(".add-to-cart");
      addToCartButton.addEventListener("click", () => {
        const cartItem = {
          name: product.name,
          price: product.price,
          quantity: 1,
        };
        addToCart(cartItem);
      });

      productList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

function addToCart(product) {
  let shoppingCart = localStorage.getItem("shoppingCart")
    ? JSON.parse(localStorage.getItem("shoppingCart"))
    : [];

  const previousItem = shoppingCart.find((item) => item.name === product.name);

  if (previousItem) {
    previousItem.quantity++;
  } else {
    shoppingCart.push(product);
  }
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

  const successMessage = document.getElementById("success-message");

  if (successMessage) {
    successMessage.textContent = "Item has been added to cart";
    successMessage.classList.remove("hidden");

    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 4000);
  }
}

window.addEventListener("load", function () {
  displayProducts("");
});