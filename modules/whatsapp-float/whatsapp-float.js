// modules/whatsapp-float/whatsapp-float.js

const SITE_CONFIG_URL = '/data/site.json';

async function initWhatsAppFloat() {
  // Check if button already exists
  if (document.getElementById('whatsapp-float-btn')) return;

  let siteConfig = {};
  
  try {
    siteConfig = await fetch(SITE_CONFIG_URL).then(r => r.json());
  } catch (e) {
    console.warn('Failed to load site config:', e);
    siteConfig = { WA_PHONE: '+27629875647' };
  }

  const waPhone = siteConfig.WA_PHONE || '+27629875647';
  const cleanPhone = waPhone.replace(/[^0-9]/g, '');
  
  // Default message
  const defaultMessage = encodeURIComponent('Hi! I\'m interested in your products. Can you help me?');
  const waUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  // Create floating WhatsApp button
  const btn = document.createElement('a');
  btn.id = 'whatsapp-float-btn';
  btn.href = waUrl;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center justify-center group animate-bounce';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.title = 'Chat with us on WhatsApp';
  btn.innerHTML = `
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898 1.86 1.867 2.89 4.35 2.89 6.99 0 5.45-4.436 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  `;
  
  document.body.appendChild(btn);
  
  // Stop bounce animation after 3 seconds
  setTimeout(() => {
    btn.classList.remove('animate-bounce');
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhatsAppFloat);
} else {
  initWhatsAppFloat();
}

