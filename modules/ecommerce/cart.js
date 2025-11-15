// modules/ecommerce/cart.js

const CART_STORAGE_KEY = 'taaibosch-cart';
const PRODUCTS_URL = '/data/products.json';
const SITE_CONFIG_URL = '/data/site.json';

let cart = [];
let products = [];
let siteConfig = {};

// Initialize cart from localStorage
function loadCart() {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart
function addItem(productId, quantity = 1) {
  const product = products.find(p => p.id === productId || p.slug === productId);
  if (!product) {
    console.warn('Product not found:', productId);
    return false;
  }
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '/assets/img/Free_Foil_Bag_Pack_PSD_Mockup.png',
      quantity: quantity
    });
  }
  saveCart();
  showCartNotification(product.title);
  return true;
}

// Remove item from cart
function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      item.quantity = quantity;
      saveCart();
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
}

// Update cart UI (badge, modal, cart page)
function updateCartUI() {
  const count = getCartCount();
  // Update badge in header (desktop and mobile)
  const badge = document.getElementById('cart-badge');
  const badgeMobile = document.getElementById('cart-badge-mobile');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
  if (badgeMobile) {
    badgeMobile.textContent = count;
    badgeMobile.style.display = count > 0 ? 'block' : 'none';
  }
  // Update cart page if on /cart/
  if (window.location.pathname.includes('/cart/')) {
    renderCartPage();
  }
  // Update slide-out if open
  const drawer = document.getElementById('cart-drawer');
  if (drawer && !drawer.classList.contains('hidden')) {
    renderCartDrawer();
  }
}

// Show cart notification
function showCartNotification(productName) {
  const notif = document.createElement('div');
  notif.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in';
  notif.textContent = `${productName} added to cart!`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Render cart drawer (slide-out modal)
function renderCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;
  
  if (cart.length === 0) {
    drawer.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50" id="cart-overlay"></div>
      <div class="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Cart</h2>
            <button id="close-cart-drawer" class="text-gray-500 hover:text-gray-700" aria-label="Close cart">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <p class="text-gray-500 text-center py-8">Your cart is empty</p>
          <a href="/shop/index.html" class="block text-center py-2 px-4 bg-primary text-white rounded hover:bg-green-700">Continue Shopping</a>
        </div>
      </div>
    `;
  } else {
    const total = getCartTotal();
    const freeDelivery = siteConfig.free_delivery_threshold || 500;
    const shipping = total >= freeDelivery ? 0 : 80;
    const grandTotal = total + shipping;
    
    drawer.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50" id="cart-overlay"></div>
      <div class="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Cart (${getCartCount()} items)</h2>
            <button id="close-cart-drawer" class="text-gray-500 hover:text-gray-700" aria-label="Close cart">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="space-y-4 mb-6">
            ${cart.map(item => `
              <div class="flex gap-4 border-b pb-4" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                  <h3 class="font-semibold">${item.title}</h3>
                  <div class="flex items-center gap-2 mt-2">
                    <button class="qty-btn-decrease px-2 py-1 border rounded" data-id="${item.id}">-</button>
                    <span class="px-3">${item.quantity}</span>
                    <button class="qty-btn-increase px-2 py-1 border rounded" data-id="${item.id}">+</button>
                  </div>
                  <div class="mt-2 font-bold text-primary">R${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button class="remove-item-btn text-red-500 hover:text-red-700" data-id="${item.id}" aria-label="Remove ${item.title}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            `).join('')}
          </div>
          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>R${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>${shipping === 0 ? '<span class="text-green-600 font-semibold">FREE</span>' : 'R' + shipping.toFixed(2)}</span>
            </div>
            <div class="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>R${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button id="whatsapp-checkout-btn" class="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700">Order via WhatsApp</button>
          <a href="/cart/index.html" class="block text-center mt-4 text-primary underline">View Full Cart</a>
        </div>
      </div>
    `;
    
    // Wire up drawer buttons
    drawer.querySelectorAll('.qty-btn-increase').forEach(btn => {
      btn.onclick = () => updateQuantity(btn.dataset.id, cart.find(i => i.id === btn.dataset.id).quantity + 1);
    });
    drawer.querySelectorAll('.qty-btn-decrease').forEach(btn => {
      btn.onclick = () => updateQuantity(btn.dataset.id, cart.find(i => i.id === btn.dataset.id).quantity - 1);
    });
    drawer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.onclick = () => removeItem(btn.dataset.id);
    });
    drawer.querySelector('#whatsapp-checkout-btn').onclick = () => {
      window.dispatchEvent(new CustomEvent('cart:checkout'));
      closeCartDrawer();
    };
  }
  
  // Close handlers
  drawer.querySelector('#close-cart-drawer').onclick = closeCartDrawer;
  drawer.querySelector('#cart-overlay').onclick = closeCartDrawer;
}

// Open cart drawer
function openCartDrawer() {
  let drawer = document.getElementById('cart-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'hidden';
    document.body.appendChild(drawer);
  }
  drawer.classList.remove('hidden');
  renderCartDrawer();
  // Focus trap
  const firstFocusable = drawer.querySelector('button, a, input');
  if (firstFocusable) firstFocusable.focus();
}

// Close cart drawer
function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('hidden');
}

// Render cart page (/cart/index.html)
function renderCartPage() {
  const itemsEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  const emptyEl = document.getElementById('empty-cart');
  
  if (!itemsEl) return;
  
  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (summaryEl) summaryEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }
  
  if (emptyEl) emptyEl.classList.add('hidden');
  if (summaryEl) summaryEl.classList.remove('hidden');
  
  itemsEl.innerHTML = cart.map(item => `
    <div class="flex gap-4 bg-white p-4 rounded shadow" data-item-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded">
      <div class="flex-1">
        <h3 class="font-semibold text-lg">${item.title}</h3>
        <div class="flex items-center gap-2 mt-2">
          <button class="qty-btn-decrease px-2 py-1 border rounded" data-id="${item.id}">-</button>
          <span class="px-3">${item.quantity}</span>
          <button class="qty-btn-increase px-2 py-1 border rounded" data-id="${item.id}">+</button>
        </div>
        <div class="mt-2 font-bold text-primary">R${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <button class="remove-item-btn text-red-500 hover:text-red-700" data-id="${item.id}" aria-label="Remove">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>
  `).join('');
  
  const total = getCartTotal();
  const freeDelivery = siteConfig.free_delivery_threshold || 500;
  const shipping = total >= freeDelivery ? 0 : 80;
  const grandTotal = total + shipping;
  
  if (summaryEl) {
    summaryEl.querySelector('#cart-subtotal').textContent = `R${total.toFixed(2)}`;
  }
  
  // Wire up buttons
  itemsEl.querySelectorAll('.qty-btn-increase').forEach(btn => {
    btn.onclick = () => updateQuantity(btn.dataset.id, cart.find(i => i.id === btn.dataset.id).quantity + 1);
  });
  itemsEl.querySelectorAll('.qty-btn-decrease').forEach(btn => {
    btn.onclick = () => updateQuantity(btn.dataset.id, cart.find(i => i.id === btn.dataset.id).quantity - 1);
  });
  itemsEl.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.onclick = () => removeItem(btn.dataset.id);
  });
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => window.dispatchEvent(new CustomEvent('cart:checkout'));
  }
}

// Initialize
(async function initCart() {
  // Load products and config
  try {
    products = await fetch(PRODUCTS_URL).then(r => r.json());
    siteConfig = await fetch(SITE_CONFIG_URL).then(r => r.json());
  } catch (e) {
    console.warn('Failed to load products/config:', e);
  }
  
  loadCart();
  
  // Add to cart button listeners (delegated)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
      const btn = e.target.closest('.add-to-cart-btn');
      const productCard = btn.closest('.product-card, [data-product-id]');
      const productId = productCard?.dataset?.productId || 
                       productCard?.querySelector('a')?.href?.match(/product-([\w-]+)/)?.[1] ||
                       btn.dataset.productId;
      if (productId) {
        addItem(productId);
        openCartDrawer();
      }
    }
    // Cart icon click - open drawer instead of navigating
    const cartLink = e.target.closest('a[href*="/cart/"]');
    if (cartLink && !cartLink.href.includes('index.html') && !e.target.closest('#cart-drawer')) {
      e.preventDefault();
      openCartDrawer();
    }
  });
  
  // Export cart API globally
  window.Cart = { 
    addItem, 
    removeItem, 
    updateQuantity, 
    getCart: () => cart, 
    clearCart, 
    getCartTotal, 
    getCartCount, 
    openCartDrawer, 
    closeCartDrawer,
    updateCartUI
  };
})();

