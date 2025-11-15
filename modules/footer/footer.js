// modules/footer/footer.js

const FOOTER_PATH = "/modules/footer/footer.html";

async function injectFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const html = await fetch(FOOTER_PATH).then(r => r.text());
  footer.innerHTML = html;
  
  // Load WhatsApp float button on all pages
  if (!document.getElementById('whatsapp-float-btn')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/modules/whatsapp-float/whatsapp-float.js';
    document.body.appendChild(script);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFooter);
} else {
  injectFooter();
}
