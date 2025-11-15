// modules/ecommerce/checkout.js

const SITE_CONFIG_URL = '/data/site.json';

let siteConfig = {};
let selectedCourier = null;

// Courier options with pricing and timeframes
const couriers = {
  'courier-guy': {
    name: 'Courier Guy',
    icon: '🚚',
    standard: { cost: 120, timeframe: '3-5 business days', description: 'Standard delivery to major cities' },
    express: { cost: 180, timeframe: '1-2 business days', description: 'Express delivery available' }
  },
  'paxi': {
    name: 'Paxi',
    icon: '📦',
    standard: { cost: 80, timeframe: '4-7 business days', description: 'Affordable delivery to Paxi collection points' },
    express: { cost: 120, timeframe: '2-3 business days', description: 'Faster delivery to Paxi points' }
  },
  'aramex': {
    name: 'Aramex',
    icon: '✈️',
    standard: { cost: 150, timeframe: '3-5 business days', description: 'Reliable international courier service' },
    express: { cost: 220, timeframe: '1-2 business days', description: 'Priority express delivery' }
  }
};

async function initCheckout() {
  try {
    siteConfig = await fetch(SITE_CONFIG_URL).then(r => r.json());
  } catch (e) {
    console.warn('Failed to load site config:', e);
  }
  
  renderCartSummary();
  renderCourierOptions();
  setupFormValidation();
}

function renderCartSummary() {
  const summaryEl = document.getElementById('checkout-cart-summary');
  if (!summaryEl || !window.Cart) return;
  
  const cart = window.Cart.getCart();
  const subtotal = window.Cart.getCartTotal();
  const freeDelivery = siteConfig.free_delivery_threshold || 500;
  
  if (cart.length === 0) {
    summaryEl.innerHTML = '<div class="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6"><p class="text-yellow-800">Your cart is empty. <a href="/shop/index.html" class="underline">Continue shopping</a></p></div>';
    return;
  }
  
  summaryEl.innerHTML = `
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Order Summary</h2>
      <div class="space-y-3 mb-4">
        ${cart.map(item => `
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded">
              <div>
                <p class="font-semibold">${item.title}</p>
                <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
              </div>
            </div>
            <p class="font-bold">R${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `).join('')}
      </div>
      <div class="border-t pt-4 space-y-2">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span class="font-semibold">R${subtotal.toFixed(2)}</span>
        </div>
        ${subtotal >= freeDelivery ? `
          <div class="flex justify-between text-green-600">
            <span>Shipping</span>
            <span class="font-semibold">FREE (Order over R${freeDelivery})</span>
          </div>
        ` : ''}
        <div class="flex justify-between font-bold text-lg pt-2 border-t" id="checkout-total">
          <span>Total</span>
          <span>R${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderCourierOptions() {
  const form = document.getElementById('wa-checkout-form');
  if (!form) return;
  
  // Insert courier selection before submit button
  const submitBtn = form.querySelector('#wa-order-btn');
  const courierSection = document.createElement('div');
  courierSection.id = 'courier-selection';
  courierSection.className = 'space-y-4';
  courierSection.innerHTML = `
    <div>
      <label class="block font-semibold mb-3">Select Delivery Method <span class="text-red-500">*</span></label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="courier-options">
        ${Object.entries(couriers).map(([key, courier]) => `
          <div class="courier-option border-2 rounded-lg p-4 cursor-pointer transition hover:border-primary ${selectedCourier === key ? 'border-primary bg-green-50' : 'border-gray-300'}" data-courier="${key}">
            <div class="flex items-center justify-between mb-2">
              <span class="text-2xl">${courier.icon}</span>
              <input type="radio" name="courier" value="${key}" id="courier-${key}" class="courier-radio" ${selectedCourier === key ? 'checked' : ''} required>
            </div>
            <h3 class="font-bold text-lg mb-2">${courier.name}</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Standard:</span>
                <span class="font-semibold">R${courier.standard.cost}</span>
              </div>
              <p class="text-xs text-gray-600">${courier.standard.timeframe}</p>
              <p class="text-xs text-gray-500">${courier.standard.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div id="courier-details" class="mt-4 p-4 bg-blue-50 rounded-lg hidden">
        <h4 class="font-semibold mb-2">Selected Courier Details</h4>
        <div id="courier-info"></div>
      </div>
    </div>
  `;
  
  submitBtn.parentNode.insertBefore(courierSection, submitBtn);
  
  // Add event listeners
  document.querySelectorAll('.courier-option').forEach(option => {
    option.addEventListener('click', () => {
      const courierKey = option.dataset.courier;
      selectedCourier = courierKey;
      updateCourierSelection();
      updateTotal();
    });
  });
  
  document.querySelectorAll('.courier-radio').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedCourier = e.target.value;
      updateCourierSelection();
      updateTotal();
    });
  });
}

function updateCourierSelection() {
  document.querySelectorAll('.courier-option').forEach(opt => {
    if (opt.dataset.courier === selectedCourier) {
      opt.classList.add('border-primary', 'bg-green-50');
      opt.classList.remove('border-gray-300');
    } else {
      opt.classList.remove('border-primary', 'bg-green-50');
      opt.classList.add('border-gray-300');
    }
  });
  
  const detailsEl = document.getElementById('courier-details');
  const infoEl = document.getElementById('courier-info');
  if (selectedCourier && couriers[selectedCourier]) {
    const courier = couriers[selectedCourier];
    detailsEl.classList.remove('hidden');
    infoEl.innerHTML = `
      <p class="font-semibold">${courier.name} - Standard Delivery</p>
      <p class="text-sm">Cost: R${courier.standard.cost}</p>
      <p class="text-sm">Timeframe: ${courier.standard.timeframe}</p>
      <p class="text-sm text-gray-600">${courier.standard.description}</p>
    `;
  } else {
    detailsEl.classList.add('hidden');
  }
}

function updateTotal() {
  if (!selectedCourier || !window.Cart) return;
  
  const subtotal = window.Cart.getCartTotal();
  const freeDelivery = siteConfig.free_delivery_threshold || 500;
  const shipping = subtotal >= freeDelivery ? 0 : (couriers[selectedCourier]?.standard.cost || 0);
  const total = subtotal + shipping;
  
  const totalEl = document.getElementById('checkout-total');
  if (totalEl) {
    totalEl.innerHTML = `
      <span>Total</span>
      <span>R${total.toFixed(2)}</span>
    `;
  }
}

function setupFormValidation() {
  const form = document.getElementById('wa-checkout-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedCourier) {
      alert('Please select a delivery method');
      return;
    }
    
    const formData = new FormData(form);
    const customerInfo = {
      name: formData.get('customer-name') || '',
      phone: formData.get('phone') || '',
      address: formData.get('address') || ''
    };
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Build enhanced WhatsApp message with courier info
    const cart = window.Cart.getCart();
    const subtotal = window.Cart.getCartTotal();
    const freeDelivery = siteConfig.free_delivery_threshold || 500;
    const courier = couriers[selectedCourier];
    const shipping = subtotal >= freeDelivery ? 0 : courier.standard.cost;
    const total = subtotal + shipping;
    
    let message = `*Taaibosch Organics Order*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerInfo.name}\n`;
    message += `Phone: ${customerInfo.phone}\n`;
    message += `Address: ${customerInfo.address}\n\n`;
    
    message += `*Order Items:*\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.title} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Delivery Method:*\n`;
    message += `${courier.icon} ${courier.name}\n`;
    message += `Standard Delivery: ${courier.standard.timeframe}\n`;
    message += `Cost: R${shipping === 0 ? '0.00 (FREE - Order over R' + freeDelivery + ')' : shipping.toFixed(2)}\n\n`;
    
    message += `*Summary:*\n`;
    message += `Subtotal: R${subtotal.toFixed(2)}\n`;
    message += `Shipping: ${shipping === 0 ? 'FREE' : 'R' + shipping.toFixed(2)}\n`;
    message += `*Total: R${total.toFixed(2)}*\n\n`;
    message += `Thank you for your order! We'll confirm shortly.`;
    
    const waPhone = siteConfig.WA_PHONE || '+27629875647';
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
    
    // Clear cart after successful order
    if (window.Cart) {
      window.Cart.clearCart();
    }
    
    // Show success message
    alert('Order sent to WhatsApp! Redirecting to homepage...');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}

