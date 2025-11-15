// modules/products/shop.js

const PRODUCTS_URL = '/data/products.json';
const CARD_TEMPLATE_URL = '/modules/products/product-card.html';
const listEl = document.getElementById('product-list');
const filtersEl = document.getElementById('shop-filters');

let allProducts = [];
let template = '';
let filter = 'All';
let query = '';

async function fetchProducts() {
  allProducts = await fetch(PRODUCTS_URL).then(r=>r.json());
  template = await fetch(CARD_TEMPLATE_URL).then(r=>r.text());
}

function uniqCat(products) {
  const cats = new Set(products.map(p => p.category));
  return ['All', ...cats];
}

function renderFilters() {
  const cats = uniqCat(allProducts);
  filtersEl.innerHTML = cats
    .map(cat => `<button class="px-3 py-1 rounded ${filter===cat?'bg-primary text-white':'bg-white border border-gray-300'} font-semibold text-sm mr-2 mb-2 hover:bg-primary hover:text-white transition" data-filter="${cat}">${cat}</button>`)
    .join('');
  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      filter = btn.dataset.filter;
      renderFilters(); // Re-render filters to update active state
      renderList();
    };
  });
}

function renderList() {
  let prods = [...allProducts];
  if (filter !== 'All') prods = prods.filter(p=>p.category===filter);
  if (query.length > 1) {
    prods = prods.filter(
      p => p.title.toLowerCase().includes(query) ||
           (p.description && p.description.toLowerCase().includes(query)) );
  }
  listEl.innerHTML = prods.map(prod=>renderCard(prod)).join('');
}

function renderCard(prod) {
  let html = template;
  const image = prod.images && prod.images[0] ? prod.images[0] : '/assets/img/Free_Foil_Bag_Pack_PSD_Mockup.png';
  const badge = prod.badge ? prod.badge.replace(/-/g,' ') : '';
  
  // Replace simple placeholders
  html = html.replace(/\{\{image\}\}/g, image);
  html = html.replace(/\{\{title\}\}/g, prod.title);
  html = html.replace(/\{\{price\}\}/g, prod.price);
  html = html.replace(/\{\{slug\}\}/g, prod.slug);
  html = html.replace(/\{\{availability\}\}/g, prod.availability);
  html = html.replace(/\{\{size\}\}/g, prod.size || '');
  
  // Handle handlebars-style conditionals and loops
  // {{#if badge}}...{{/if}}
  if (badge) {
    html = html.replace(/\{\{#if badge\}\}([\s\S]*?)\{\{\/if\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#if badge\}\}([\s\S]*?)\{\{\/if\}\}/g, '');
  }
  
  // {{#benefits}}...{{/benefits}} - render all benefits
  if (prod.benefits && prod.benefits.length > 0) {
    const benefitsHtml = prod.benefits.slice(0, 3).map(b => `<li>${b}</li>`).join('');
    html = html.replace(/\{\{#benefits\}\}([\s\S]*?)\{\{\/benefits\}\}/g, benefitsHtml);
  } else {
    html = html.replace(/\{\{#benefits\}\}([\s\S]*?)\{\{\/benefits\}\}/g, '');
  }
  
  // Replace badge placeholder
  html = html.replace(/\{\{badge\}\}/g, badge);
  
  // Add data-product-id for cart functionality
  html = html.replace(/class="product-card/, `class="product-card" data-product-id="${prod.id}"`);
  
  return html;
}

function listenSearch() {
  window.addEventListener('nav:search', e => {
    query = (e.detail.query || '').toLowerCase();
    renderList();
  });
}

(async function initShop() {
  await fetchProducts();
  renderFilters();
  renderList();
  listenSearch();
})();
