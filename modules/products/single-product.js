// modules/products/single-product.js

const PRODUCTS_URL = '/data/products.json';
const productSection = document.querySelector('main > section');
const detailsSection = document.getElementById('product-details');

function getSlug() {
  // Supports both query (?slug=) and product-{slug}.html filename forms
  const url = new URL(window.location.href);
  let slug = url.searchParams.get('slug');
  if (!slug) {
    // Try extracting from /shop/product-something.html
    const match = window.location.pathname.match(/product-([\w-]+)\.html/i);
    if (match) slug = match[1];
  }
  return slug;
}

async function fetchProduct(slug) {
  const prods = await fetch(PRODUCTS_URL).then(r => r.json());
  return prods.find(p => p.slug === slug);
}

function fillProduct(p) {
  // Fill IMG, TITLE, PRICE, AVAILABILITY
  productSection.querySelector('img').src = p.images?.[0] || '/assets/img/Free_Foil_Bag_Pack_PSD_Mockup.png';
  productSection.querySelector('img').alt = p.title + ' product image';
  productSection.querySelector('h1').textContent = p.title;
  productSection.querySelector('.text-primary.font-bold').innerHTML = `R${p.price}.00 <span class="text-xs text-gray-500 font-normal">${p.size || ''}</span>`;
  productSection.querySelector('p.mb-3').textContent = p.description;
  // Benefits
  const list = productSection.querySelector('ul');
  list.innerHTML = (p.benefits || []).slice(0,4).map(b=>`<li>${b}</li>`).join('');
  // --- Details ---
  if(detailsSection){
    detailsSection.querySelector('p.mb-4').textContent = p.description;
    detailsSection.querySelector('ul.list-disc.ml-6.text-sm.mb-4').innerHTML = (p.ingredients ? `<li>${p.ingredients}</li>` : '');
    detailsSection.querySelector('p.mb-3').textContent = p.usage || 'See label for usage instructions.';
    // FAQs (simple, can expand from p.faq if present)
    const faqUL = detailsSection.querySelector('ul.list-disc.ml-6.text-sm');
    if(faqUL){
      faqUL.innerHTML = (p.faqs || [
        'Is this product vegan and cruelty-free? <b>Yes!</b>',
        'Does it support thyroid/immune/energy/skin? <b>Yes, rich in minerals and actives.</b>'
      ]).map(f=>`<li>${f}</li>`).join('');
    }
    // JSON-LD Product schema injection (SEO)
    const ldscript = document.createElement('script');
    ldscript.type = 'application/ld+json';
    ldscript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      image: p.images,
      description: p.description,
      sku: p.sku,
      brand: {"@type": "Brand", name: "Taaibosch Organics"},
      offers: {
        "@type": "Offer",
        priceCurrency: "ZAR",
        price: p.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: p.availability === 'in stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    });
    document.head.appendChild(ldscript);
  }
}

function showNotFound() {
  productSection.innerHTML = '<div class="w-full text-center py-16"><h1 class="text-2xl font-bold">Product Not Found</h1><p class="my-4">Sorry, the requested product does not exist. <a href="/shop/index.html" class="text-primary underline">Back to shop</a>.</p></div>';
}

(async function init() {
  const slug = getSlug();
  if (!slug) return showNotFound();
  const p = await fetchProduct(slug);
  if (!p) return showNotFound();
  fillProduct(p);
})();
