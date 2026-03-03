import { displayCart } from './assets/js/cart.js';

const navbarContainer = document.getElementById('navbar-container');
const cartSlider = document.getElementById('cart-slider');
const closeIcon = document.getElementById('close-icon');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
  cartSlider.classList.add('right-slide');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSlider.classList.remove('right-slide');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

fetch('header.html')
  .then((response) => response.text())
  .then((data) => {
    navbarContainer.innerHTML = data;
    const cartLogo = document.getElementById('cart-logo');

    cartLogo.addEventListener('click', function () {
      if (cartSlider.classList.contains('right-slide')) {
        closeCart();
      } else {
        openCart();
      }
    });

    closeIcon.addEventListener('click', closeCart);
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }

    updateCartBadge();
  })
  .catch((error) => {
    console.error('Error loading the navigation bar:', error);
  });

// Update cart badge count
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const savedCart = localStorage.getItem('shoppingCart');
  if (!savedCart) {
    badge.style.display = 'none';
    return;
  }

  const cartItems = JSON.parse(savedCart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems > 99 ? '99+' : totalItems;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// Function to display category links dynamically
const catergoryItems = document.getElementById('category-items');
let result = '';

async function displayCatergory() {
  try {
    const response = await fetch('./features/products/category.json');
    const catergories = await response.json();
    catergories.forEach((category, index) => {
      result += `<li class="category-item" style="animation-delay: ${index * 0.1}s">
      <a href="./features/products/productsList.html?categoryId=${category.id}">
        <div class="category-image">
          <img src="${category.image}" alt="${category.name}">
        </div>
        <span>${category.name}</span>
      </a>
    </li>
    `;
    });
    catergoryItems.innerHTML = result;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

displayCatergory();
displayCart();

// Re-export updateCartBadge so cart.js can call it
window.updateCartBadge = updateCartBadge;

// Listen for storage changes (in case cart is modified from another tab)
window.addEventListener('storage', updateCartBadge);
