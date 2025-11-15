// modules/testimonials/testimonials.js

const TESTIMONIALS_URL = 'data/testimonials.json';

async function initTestimonials() {
  const section = document.getElementById('testimonials');
  if (!section) return;
  
  try {
    const testimonials = await fetch(TESTIMONIALS_URL).then(r => r.json());
    
    section.innerHTML = `
      <div class="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="testimonials-grid">
            ${testimonials.map((test, idx) => `
              <div class="bg-white p-6 rounded-lg shadow-md" role="article" aria-label="Testimonial from ${test.name}">
                <div class="flex items-center mb-4">
                  <img src="${test.avatar || '/assets/img/avaters/avatar1.png'}" alt="${test.name}" class="w-12 h-12 rounded-full mr-3" loading="lazy">
                  <div>
                    <h3 class="font-semibold">${test.name}</h3>
                    <div class="flex text-yellow-400">
                      ${'★'.repeat(test.rating || 5)}
                    </div>
                  </div>
                </div>
                <p class="text-gray-700">"${test.text}"</p>
                <p class="text-sm text-gray-500 mt-4">${formatDate(test.date)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    console.warn('Failed to load testimonials:', e);
    section.innerHTML = '<div class="text-center py-16"><p>Loading testimonials...</p></div>';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTestimonials);
} else {
  initTestimonials();
}

