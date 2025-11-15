// modules/ecommerce/whatsapp-order.js

const SITE_CONFIG_URL = '/data/site.json';

let siteConfig = {};

// Build WhatsApp order message
function buildWhatsAppMessage(cartItems, customerInfo = {}) {
  const name = customerInfo.name || 'Customer';
  const phone = customerInfo.phone || '';
  const address = customerInfo.address || '';
  
  let message = `*Taaibosch Organics Order*\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${name}\n`;
  if (phone) message += `Phone: ${phone}\n`;
  if (address) message += `Address: ${address}\n\n`;
  
  message += `*Order Items:*\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.title} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeDelivery = siteConfig.free_delivery_threshold || 500;
  const shipping = subtotal >= freeDelivery ? 0 : 80;
  const total = subtotal + shipping;
  
  message += `\n*Summary:*\n`;
  message += `Subtotal: R${subtotal.toFixed(2)}\n`;
  message += `Shipping: ${shipping === 0 ? 'FREE (Order over R' + freeDelivery + ')' : 'R' + shipping.toFixed(2)}\n`;
  message += `*Total: R${total.toFixed(2)}*\n\n`;
  message += `Thank you for your order! We'll confirm shortly.`;
  
  return message;
}

// Open WhatsApp with order
function openWhatsAppOrder(cartItems, customerInfo = {}) {
  if (!siteConfig.WA_PHONE) {
    console.error('WhatsApp phone number not configured');
    return false;
  }
  
  const message = buildWhatsAppMessage(cartItems, customerInfo);
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${siteConfig.WA_PHONE.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  
  window.open(waUrl, '_blank');
  return true;
}

// Initialize
(async function initWhatsApp() {
  try {
    siteConfig = await fetch(SITE_CONFIG_URL).then(r => r.json());
  } catch (e) {
    console.warn('Failed to load site config:', e);
  }
  
  // Listen for checkout event
  window.addEventListener('cart:checkout', async () => {
    if (!window.Cart) {
      console.error('Cart module not loaded');
      return;
    }
    
    const cart = window.Cart.getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Check if we're on checkout page (has form)
    const checkoutForm = document.getElementById('wa-checkout-form');
    if (checkoutForm) {
      // On checkout page - wait for form submission
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const customerInfo = {
          name: formData.get('customer-name') || '',
          phone: formData.get('phone') || '',
          address: formData.get('address') || ''
        };
        
        if (openWhatsAppOrder(cart, customerInfo)) {
          window.Cart.clearCart();
          alert('Order sent to WhatsApp! Redirecting...');
          window.location.href = '/index.html';
        }
      });
    } else {
      // On cart page or elsewhere - open WhatsApp directly
      if (openWhatsAppOrder(cart)) {
        window.Cart.clearCart();
      }
    }
  });
  
  // Export API
  window.WhatsAppOrder = { buildWhatsAppMessage, openWhatsAppOrder };
})();

