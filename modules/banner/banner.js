// modules/banner/banner.js

const BANNER_STORAGE_KEY = 'taaibosch-reseller-banner-hidden';

function initBanner() {
  // Only show on homepage
  if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
    return;
  }

  // Check if banner was dismissed
  const isHidden = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
  if (isHidden) {
    return;
  }

  const bannerContainer = document.getElementById('banner-container');
  if (!bannerContainer) return;

  // Load banner HTML
  fetch('modules/banner/banner.html')
    .then(r => r.text())
    .then(html => {
      bannerContainer.innerHTML = html;
      
      const banner = document.getElementById('reseller-banner');
      const closeBtn = document.getElementById('close-banner-btn');
      const ctaBtn = document.getElementById('reseller-cta-btn');

      if (banner) {
        banner.style.display = 'flex';
      }

      // Close button handler
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          localStorage.setItem(BANNER_STORAGE_KEY, 'true');
          if (banner) {
            banner.style.display = 'none';
          }
        });
      }

      // CTA button handler - open WhatsApp for reseller inquiries
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          const message = encodeURIComponent('Hi! I\'m interested in becoming a reseller and ordering in bulk. Please provide more information.');
          const waPhone = '+27629875647';
          window.open(`https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        });
      }
    })
    .catch(err => {
      console.warn('Failed to load banner:', err);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBanner);
} else {
  initBanner();
}

