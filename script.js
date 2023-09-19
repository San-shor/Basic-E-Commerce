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
            `;
      productList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

window.addEventListener("load", function () {
  displayProducts("");
});
