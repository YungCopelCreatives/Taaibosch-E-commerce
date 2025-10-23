// Performance Optimization JavaScript
// Image lazy loading, compression, and analytics integration

document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading implementation
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        // Observe all images with loading="lazy"
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Image compression for uploads (if needed)
    function compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                // Send to analytics if needed
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        'custom_parameter': loadTime
                    });
                }
            }, 0);
        });
    }

    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = [
            'assets/img/logo.png',
            'assets/img/hero-bg.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    preloadCriticalImages();

    // Optimize scroll performance
    let ticking = false;
    function updateScrollPosition() {
        // Add scroll-based optimizations here
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });

    // Cart performance optimization with Taaibosch green theme
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state with green theme
            this.classList.add('loading');
            this.textContent = 'Adding...';
            this.style.background = '#A7C7A0';
            this.style.color = '#1E4D2B';
            
            // Simulate async operation
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = 'Added to Cart';
                this.style.background = '#1E4D2B';
                this.style.color = '#F5F9F5';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '#1E4D2B';
                    this.style.color = '#F5F9F5';
                }, 2000);
            }, 1000);
        });
    });

    // Page loader with Taaibosch green theme
    function showPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'taaibosch-loader';
        loader.innerHTML = `
            <div class="taaibosch-spinner"></div>
            <div class="taaibosch-loader-text">Loading Taaibosch Organics...</div>
            <div class="taaibosch-loader-subtext">Natural Wellness from Cape Town</div>
        `;
        document.body.appendChild(loader);
    }

    function hidePageLoader() {
        const loader = document.querySelector('.taaibosch-loader');
        if (loader) {
            loader.remove();
        }
    }

    // Newsletter form optimization with Taaibosch green theme
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state with green theme
            this.classList.add('loading');
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                submitBtn.style.background = '#A7C7A0';
                submitBtn.style.color = '#1E4D2B';
            }
            
            // Simulate async operation
            setTimeout(() => {
                this.classList.remove('loading');
                if (submitBtn) {
                    submitBtn.textContent = 'Subscribed!';
                    submitBtn.style.background = '#1E4D2B';
                    submitBtn.style.color = '#F5F9F5';
                    setTimeout(() => {
                        submitBtn.textContent = 'Subscribe';
                        submitBtn.disabled = false;
                        submitBtn.style.background = '#1E4D2B';
                        submitBtn.style.color = '#F5F9F5';
                    }, 2000);
                }
            }, 1500);
        });
    });

    // Show loader on page load
    showPageLoader();
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(hidePageLoader, 500);
    });
});

// Service Worker registration for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
