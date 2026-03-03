import { displayCart, updateCartBadge } from '../../assets/js/cart.js';

const navbarContainer = document.getElementById('navbar-container');
const cartSlider = document.getElementById('cart-slider');
const closeIcon = document.getElementById('close-icon');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
  cartSlider.classList.add('right-slide');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSlider() {
  cartSlider.classList.remove('right-slide');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

fetch('../../header.html')
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
    const cartLogo = document.getElementById('cart-logo');

    cartLogo.addEventListener('click', function () {
      if (cartSlider.classList.contains('right-slide')) {
        closeCartSlider();
      } else {
        openCart();
      }
    });

    closeIcon.addEventListener('click', closeCartSlider);
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCartSlider);
    }

    updateCartBadge();
  })
  .catch((error) => {
    console.error('Error loading the navigation bar:', error);
  });

async function displayProducts() {
  const productDataUrl = 'products.json';
  const categoryDataUrl = 'category.json';
  const productList = document.getElementById('product-list');
  const emptyState = document.getElementById('empty-state');
  const productsCount = document.getElementById('products-count');
  const categoryTitle = document.getElementById('category-title');
  const categoryDescription = document.getElementById('category-description');
  const currentCategoryBreadcrumb = document.getElementById('current-category');

  let params = new URL(document.location).searchParams;
  let categoryId = params.get('categoryId');

  try {
    // Fetch both products and categories data
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(productDataUrl),
      fetch(categoryDataUrl),
    ]);

    const products = await productsResponse.json();
    const categories = await categoriesResponse.json();

    // Find current category
    const currentCategory = categories.find((cat) => cat.id == categoryId);

    // Update page title and breadcrumb
    if (currentCategory) {
      categoryTitle.textContent = currentCategory.name;
      categoryDescription.textContent = `Fresh and quality ${currentCategory.name.toLowerCase()} for your daily needs`;
      currentCategoryBreadcrumb.textContent = currentCategory.name;
      document.title = `${currentCategory.name} - FreshMart`;
    }

    // Filter products by category
    const filteredProducts = products.filter(
      (product) => product.categoryId == categoryId
    );

    // Update products count
    productsCount.innerHTML = `<i class="fas fa-cubes"></i> ${filteredProducts.length} Product${filteredProducts.length !== 1 ? 's' : ''}`;

    if (filteredProducts.length === 0) {
      productList.style.display = 'none';
      emptyState.classList.remove('hidden');
      return;
    }

    // Hide empty state and show product list
    emptyState.classList.add('hidden');
    productList.style.display = 'grid';

    filteredProducts.forEach((product, index) => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.style.animationDelay = `${index * 0.08}s`;
      productItem.innerHTML = `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='../../assets/products/placeholder.svg'; this.onerror=null;">
        </div>
        <div class="product-card-body">
          <span class="product__item-category">${product.category}</span>
          <h5 class="product__item-name">${product.name}</h5>
          <div class="product__item-info">
            <div class="product__price-row">
              <p class="product__item-price">৳${product.price}</p>
              <span class="product__price-unit">/item</span>
            </div>
            <div class="quantity-section">
              <div class="quantity-controls">
                <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="99" aria-label="Quantity">
                <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
              </div>
              <button class="add-to-cart" aria-label="Add ${product.name} to cart">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;

      // Quantity control functionality
      const quantityInput = productItem.querySelector('.quantity-input');
      const minusBtn = productItem.querySelector('.minus');
      const plusBtn = productItem.querySelector('.plus');
      const addToCartButton = productItem.querySelector('.add-to-cart');

      // Minus button functionality
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });

      // Plus button functionality
      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
          quantityInput.value = currentValue + 1;
        }
      });

      // Input validation
      quantityInput.addEventListener('input', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
          quantityInput.value = 1;
        } else if (value > 99) {
          quantityInput.value = 99;
        }
      });

      // Add to cart with selected quantity
      addToCartButton.addEventListener('click', () => {
        const selectedQuantity = parseInt(quantityInput.value);
        const cartItem = {
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: selectedQuantity,
        };
        addToCart(cartItem);
        displayCart();
        updateCartBadge();

        // Reset quantity to 1 after adding to cart
        quantityInput.value = 1;

        // Button feedback animation
        addToCartButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          addToCartButton.style.transform = '';
        }, 150);
      });

      productList.appendChild(productItem);
    });

    // Add loading animation completion
    productList.style.opacity = '0';
    setTimeout(() => {
      productList.style.transition = 'opacity 0.5s ease';
      productList.style.opacity = '1';
    }, 100);
  } catch (error) {
    console.error('Error fetching data:', error);
    productsCount.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error loading';
    emptyState.classList.remove('hidden');
    productList.style.display = 'none';
  }
}

function addToCart(product) {
  let shoppingCart = localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart'))
    : [];

  const previousItem = shoppingCart.find((item) => item.name === product.name);

  if (previousItem) {
    previousItem.quantity += product.quantity;
  } else {
    shoppingCart.push(product);
  }
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  const successMessage = document.getElementById('success-message');

  if (successMessage) {
    const quantityText =
      product.quantity > 1 ? `${product.quantity} items` : '1 item';
    successMessage.textContent = `${quantityText} added to cart`;
    successMessage.classList.remove('hidden');

    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 2500);
  }
}

window.addEventListener('load', function () {
  displayProducts('');
});
displayCart();
