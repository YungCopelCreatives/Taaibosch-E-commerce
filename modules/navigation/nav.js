// modules/navigation/nav.js

const NAV_HEADER_PATH = "modules/navigation/header.html";

async function injectHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const html = await fetch(NAV_HEADER_PATH).then(r => r.text());
  header.innerHTML = html;
  navLogic();
}

function navLogic() {
  // Mobile menu toggle
  const openBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');
  if (openBtn && mobileMenu) {
    openBtn.onclick = () => {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      mobileMenu.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Lock body scroll
      focusTrap(mobileMenu);
    };
    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      mobileMenu.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Unlock body scroll
      openBtn.focus();
    };
    if (closeBtn) {
      closeBtn.onclick = closeMenu;
    }
    // Close on overlay click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  }
  // Skip link visible on focus
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('focus', () => skip.classList.add('block'));
    skip.addEventListener('blur', () => skip.classList.remove('block'));
  }
  // Active link highlighter
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
  navLinks.forEach(link => {
    if(link.href && window.location.pathname === new URL(link.href).pathname) {
      link.classList.add('text-primary', 'font-bold');
      link.setAttribute('aria-current','page');
    }
  });
  // Focus trap for mobile
  function focusTrap(menu) {
    const focusable = menu.querySelectorAll('a, input, button');
    if (!focusable.length) return;
    let first = focusable[0];
    let last = focusable[focusable.length-1];
    menu.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
      if (e.key === 'Escape') {
        menu.classList.add('hidden');
        menu.setAttribute('aria-expanded', 'false');
        openBtn && openBtn.focus();
      }
    });
    first.focus();
  }
  // Mobile & desktop search
  [document.getElementById('nav-search'), document.getElementById('mobile-nav-search')].forEach(input => {
    if (input) {
      input.addEventListener('input', e => {
        const evt = new CustomEvent('nav:search', { detail: { query: input.value }});
        window.dispatchEvent(evt);
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectHeader);
} else {
  injectHeader();
}
