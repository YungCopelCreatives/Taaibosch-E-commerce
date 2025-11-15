// modules/products/bestsellers.js

const PRODUCTS_URL = '/data/products.json';
const CARD_TEMPLATE_URL = '/modules/products/product-card.html';

async function initBestsellers() {
  const section = document.getElementById('bestsellers');
  if (!section) return;
  
  try {
    const products = await fetch(PRODUCTS_URL).then(r => r.json());
    const template = await fetch(CARD_TEMPLATE_URL).then(r => r.text());
    
    // Get bestsellers (badge: best-seller) or top 6 products
    const bestsellers = products.filter(p => p.badge === 'best-seller').slice(0, 6);
    const display = bestsellers.length > 0 ? bestsellers : products.slice(0, 6);
    
    section.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Proven Bestsellers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="bestsellers-grid">
          ${display.map(prod => renderCard(prod, template)).join('')}
        </div>
        <div class="text-center mt-12">
          <a href="/shop/index.html" class="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow hover:bg-green-700 transition">View All Products</a>
        </div>
      </div>
    `;
  } catch (e) {
    console.warn('Failed to load bestsellers:', e);
    section.innerHTML = '<div class="text-center py-16"><p>Loading products...</p></div>';
  }
}

function renderCard(prod, template) {
  let html = template;
  const image = prod.images && prod.images[0] ? prod.images[0] : '/assets/img/Free_Foil_Bag_Pack_PSD_Mockup.png';
  const badge = prod.badge ? prod.badge.replace(/-/g,' ') : '';
  
  html = html.replace(/\{\{image\}\}/g, image);
  html = html.replace(/\{\{title\}\}/g, prod.title);
  html = html.replace(/\{\{price\}\}/g, prod.price);
  html = html.replace(/\{\{slug\}\}/g, prod.slug);
  html = html.replace(/\{\{availability\}\}/g, prod.availability);
  html = html.replace(/\{\{size\}\}/g, prod.size || '');
  
  if (badge) {
    html = html.replace(/\{\{#if badge\}\}([\s\S]*?)\{\{\/if\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#if badge\}\}([\s\S]*?)\{\{\/if\}\}/g, '');
  }
  
  if (prod.benefits && prod.benefits.length > 0) {
    const benefitsHtml = prod.benefits.slice(0, 3).map(b => `<li>${b}</li>`).join('');
    html = html.replace(/\{\{#benefits\}\}([\s\S]*?)\{\{\/benefits\}\}/g, benefitsHtml);
  } else {
    html = html.replace(/\{\{#benefits\}\}([\s\S]*?)\{\{\/benefits\}\}/g, '');
  }
  
  html = html.replace(/\{\{badge\}\}/g, badge);
  html = html.replace(/class="product-card/, `class="product-card" data-product-id="${prod.id}"`);
  
  return html;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBestsellers);
} else {
  initBestsellers();
}

