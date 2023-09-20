async function displayProducts() {
  const productDataUrl = "products.json";
  const productList = document.getElementById("product-list");
  let params = new URL(document.location).searchParams;
  let category = params.get("category");

  let shoppingCart = [];

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
        const existingItem = shoppingCart.find(
          (item) => item.name === cartItem.name
        );
        if (existingItem) {
          existingItem.quantity++;
        } else {
          shoppingCart.push(cartItem);
        }
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        console.log(shoppingCart);
      });

      productList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

window.addEventListener("load", function () {
  displayProducts("");
});
