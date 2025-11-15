// modules/courier-slider/courier-slider.js

const LOGO_IMAGES = [
  'assets/img/company-logos/1.png',
  'assets/img/company-logos/2.png',
  'assets/img/company-logos/3.png',
  'assets/img/company-logos/4.png',
  'assets/img/company-logos/5.png'
];

async function initCourierSlider() {
  const section = document.getElementById('courier-slider-section');
  if (!section) return;

  // Load slider HTML
  try {
    const html = await fetch('modules/courier-slider/courier-slider.html').then(r => r.text());
    section.innerHTML = html;
    
    const sliderTrack = document.getElementById('courier-slider-track');
    if (!sliderTrack) return;

    // Create logo elements
    const logos = LOGO_IMAGES.map(img => {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'flex-shrink-0 flex items-center justify-center';
      logoDiv.innerHTML = `
        <img src="${img}" alt="Courier Partner Logo" class="h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" loading="lazy">
      `;
      return logoDiv;
    });

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos];
    
    duplicatedLogos.forEach(logo => {
      sliderTrack.appendChild(logo);
    });

    // Add CSS animation
    const styleId = 'courier-slider-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes infinite-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        
        .infinite-slider-track {
          animation: infinite-slide 30s linear infinite;
          width: fit-content;
        }
        
        .infinite-slider-container:hover .infinite-slider-track {
          animation-play-state: paused;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .infinite-slider-track {
            animation: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  } catch (err) {
    console.warn('Failed to load courier slider:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCourierSlider);
} else {
  initCourierSlider();
}

