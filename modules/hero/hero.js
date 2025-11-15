// modules/hero/hero.js

const PRODUCTS_URL = '/data/products.json';

async function initHero() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  
  try {
    const products = await fetch(PRODUCTS_URL).then(r => r.json());
    // Get 2-3 flagship products (best-seller or first 3)
    const featured = products.filter(p => p.badge === 'best-seller').slice(0, 3);
    if (featured.length === 0) featured.push(...products.slice(0, 3));
    
    heroSection.innerHTML = `
      <div class="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        <div class="absolute inset-0 hero-bg-pattern opacity-10"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Taaibosch Organics</h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-700">Premium Alkaline Wellness for Clear Skin, Energy & Longevity</p>
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <a href="/shop/index.html" class="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105">Shop Now</a>
            <a href="/about/index.html" class="px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-lg shadow hover:bg-green-50 transition">Learn More</a>
          </div>
          ${featured.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              ${featured.map((prod, idx) => `
                <div class="hero-product-card bg-white rounded-xl shadow-lg p-6 transform transition hover:scale-105" style="animation-delay: ${idx * 0.1}s">
                  <img src="${prod.images?.[0] || '/assets/img/Free_Foil_Bag_Pack_PSD_Mockup.png'}" alt="${prod.title}" class="w-full h-48 object-cover rounded mb-4" loading="lazy">
                  <h3 class="font-bold text-lg mb-2">${prod.title}</h3>
                  <p class="text-primary font-semibold mb-4">R${prod.price}</p>
                  <a href="/shop/product-${prod.slug}.html" class="block text-center py-2 px-4 bg-primary text-white rounded hover:bg-green-700">View Product</a>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Scroll expansion effect (IntersectionObserver)
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroSection.style.transform = 'scale(1)';
            heroSection.style.opacity = '1';
          } else {
            heroSection.style.transform = 'scale(0.95)';
            heroSection.style.opacity = '0.8';
          }
        });
      }, { threshold: 0.5 });
      observer.observe(heroSection);
    }
  } catch (e) {
    console.warn('Failed to load hero products:', e);
    heroSection.innerHTML = `
      <div class="bg-gradient-to-br from-green-50 to-green-100 py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">Taaibosch Organics</h1>
        <p class="text-xl mb-8">Premium Alkaline Wellness</p>
        <a href="/shop/index.html" class="px-8 py-4 bg-primary text-white font-bold rounded-lg">Shop Now</a>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero);
} else {
  initHero();
}

