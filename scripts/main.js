// Modern E-commerce JavaScript - Taaibosch Organics

document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initMobileMenu();
    initNewsletterForm();
    initSmoothScrolling();
    initLoadingAnimations();
    initWhatsAppIntegration();

    // Enhanced UX features
    initStickyNavbar();
    initParallaxEffects();
    initHoverEffects();
    initSkeletonLoaders();

    // E-commerce functionality
    initShoppingCart();
    initProductInteractions();
    initSearchFunctionality();
    initFloatingWhatsApp();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');

            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                this.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                this.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking on nav links
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Sticky Navbar with Scroll Effect
function initStickyNavbar() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add/remove sticky class
            if (scrollTop > 100) {
                header.classList.add('sticky-active');
            } else {
                header.classList.remove('sticky-active');
            }

            // Shrink effect
            if (scrollTop > 200) {
                header.classList.add('navbar-shrink');
            } else {
                header.classList.remove('navbar-shrink');
            }

            lastScrollTop = scrollTop;
        }, 16));
    }
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg, .hero');

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        }, 16));
    }
}

// Enhanced Hover Effects
function initHoverEffects() {
    // Product card hover effects
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Card hover reveal WhatsApp CTA
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const whatsappHint = this.querySelector('.whatsapp-hint');
            if (whatsappHint) {
                whatsappHint.style.opacity = '1';
                whatsappHint.style.transform = 'translateY(0)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const whatsappHint = this.querySelector('.whatsapp-hint');
            if (whatsappHint) {
                whatsappHint.style.opacity = '0';
                whatsappHint.style.transform = 'translateY(10px)';
            }
        });
    });
}

// Skeleton Loaders
function initSkeletonLoaders() {
    // Show skeletons initially
    showSkeletons();

    // Simulate loading delay, then replace with content
    setTimeout(() => {
        hideSkeletons();
        revealContent();
    }, 1500);
}

function showSkeletons() {
    // Product grid skeletons
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="product-card skeleton">
                <div class="product-image skeleton-shimmer"></div>
                <div class="product-info">
                    <div class="skeleton-line skeleton-shimmer" style="height: 20px; width: 80%; margin-bottom: 10px;"></div>
                    <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 100%; margin-bottom: 5px;"></div>
                    <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 60%; margin-bottom: 15px;"></div>
                    <div class="skeleton-line skeleton-shimmer" style="height: 40px; width: 100%;"></div>
                </div>
            </div>
        `.repeat(3);
    }

    // Category grid skeletons
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        categoryGrid.innerHTML = `
            <div class="category-card skeleton">
                <div class="skeleton-circle skeleton-shimmer" style="width: 80px; height: 80px; margin: 0 auto 20px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 24px; width: 70%; margin: 0 auto 10px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 16px; width: 90%; margin: 0 auto 15px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 20px; width: 50%; margin: 0 auto;"></div>
            </div>
        `.repeat(5);
    }

    // Testimonial grid skeletons
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid) {
        testimonialGrid.innerHTML = `
            <div class="testimonial-card skeleton">
                <div class="skeleton-line skeleton-shimmer" style="height: 16px; width: 20%; margin: 0 auto 15px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 90%; margin: 0 auto 8px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 80%; margin: 0 auto 8px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 95%; margin: 0 auto 8px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 70%; margin: 0 auto 20px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 18px; width: 40%; margin: 0 auto 5px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="height: 14px; width: 30%; margin: 0 auto;"></div>
            </div>
        `.repeat(3);
    }
}

function hideSkeletons() {
    document.querySelectorAll('.skeleton').forEach(skeleton => {
        skeleton.classList.add('fade-out');
        setTimeout(() => {
            skeleton.remove();
        }, 300);
    });
}

function revealContent() {
    document.querySelectorAll('.loading').forEach(element => {
        element.classList.remove('loading');
    });
}

// Shopping Cart System
let cart = {
    items: [],
    total: 0,

    addItem: function(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.calculateTotal();
        this.updateCartDisplay();
        this.saveCart();
        this.showCartNotification(product);
    },

    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.calculateTotal();
        this.updateCartDisplay();
        this.saveCart();
    },

    updateQuantity: function(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.calculateTotal();
            this.updateCartDisplay();
            this.saveCart();
        }
    },

    calculateTotal: function() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateCartDisplay: function() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total');

        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (cartTotal) {
            cartTotal.textContent = `R${this.total.toFixed(2)}`;
        }
    },

    saveCart: function() {
        localStorage.setItem('taaibosch-cart', JSON.stringify(this.items));
    },

    loadCart: function() {
        const savedCart = localStorage.getItem('taaibosch-cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.calculateTotal();
            this.updateCartDisplay();
        }
    },

    // WhatsApp checkout with full details
    checkoutViaWhatsApp: function() {
        if (this.items.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        let message = '🌿 *Taaibosch Organics Order*\n\n';
        message += 'Hello! I would like to place an order:\n\n';

        message += '*Order Details:*\n';
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: R${item.price}\n`;
            message += `   Subtotal: R${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        message += `*Total: R${this.total.toFixed(2)}*\n\n`;
        message += 'Please confirm availability and delivery details.\n';
        message += 'Thank you! 💚';

        const whatsappUrl = `https://wa.me/27645022066?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_checkout', {
                'event_category': 'ecommerce',
                'event_label': 'cart_checkout',
                'value': this.total
            });
        }
    }
};

// Initialize cart
cart.loadCart();

// Enhanced Product Interactions
function initProductInteractions() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn, .btn[href*="cart"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productCard = this.closest('.product-card, .category-card');
            if (productCard) {
                const productData = getProductData(productCard);
                cart.addItem(productData);
            }
        });
    });

    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const productId = this.dataset.productId;
            const quantityInput = document.querySelector(`[data-product-id="${productId}"] .quantity-input`);

            let currentQuantity = parseInt(quantityInput.value);

            if (action === 'increase') {
                currentQuantity++;
            } else if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
            }

            quantityInput.value = currentQuantity;
            cart.updateQuantity(productId, currentQuantity);
        });
    });

    // Cart icon click
    const cartIcon = document.querySelector('.shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }
}

// Get product data from card
function getProductData(productCard) {
    const name = productCard.querySelector('.product-name, .category-card h3')?.textContent || 'Product';
    const priceText = productCard.querySelector('.product-price, .price-range')?.textContent || '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const image = productCard.querySelector('img')?.src || '';
    const description = productCard.querySelector('.product-description, .category-card p')?.textContent || '';

    return {
        id: Date.now() + Math.random(),
        name,
        price,
        image,
        description
    };
}

// Show cart notification
function showCartNotification(product) {
    showNotification(`${product.name} added to cart!`, 'success');

    // Update cart preview if exists
    updateCartPreview();
}

// Update cart preview in header
function updateCartPreview() {
    const cartPreview = document.querySelector('.cart-preview');
    if (cartPreview && cart.items.length > 0) {
        cartPreview.innerHTML = `
            <div class="cart-preview-content">
                <h4>Cart (${cart.items.length} items)</h4>
                ${cart.items.slice(0, 3).map(item => `
                    <div class="cart-item-preview">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-quantity">Qty: ${item.quantity}</span>
                        </div>
                        <span class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                ${cart.items.length > 3 ? `<p class="cart-more">...and ${cart.items.length - 3} more items</p>` : ''}
                <div class="cart-preview-actions">
                    <button class="btn btn-outline btn-sm" onclick="showCartModal()">View Cart</button>
                    <button class="btn btn-primary btn-sm" onclick="cart.checkoutViaWhatsApp()">Checkout</button>
                </div>
            </div>
        `;
        cartPreview.style.display = 'block';
    }
}

// Cart Modal
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3>Shopping Cart</h3>
                <button class="cart-modal-close">&times;</button>
            </div>
            <div class="cart-modal-body">
                ${cart.items.length === 0 ? `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                ` : `
                    <div class="cart-items">
                        ${cart.items.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>${item.description}</p>
                                    <div class="cart-item-controls">
                                        <div class="quantity-controls">
                                            <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                                            <input type="number" class="quantity-input" value="${item.quantity}" data-product-id="${item.id}" readonly>
                                            <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                                        </div>
                                        <span class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button class="remove-item" data-product-id="${item.id}">&times;</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-summary">
                        <div class="cart-total">
                            <strong>Total: R${cart.total.toFixed(2)}</strong>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-outline" onclick="clearCart()">Clear Cart</button>
                            <button class="btn btn-primary" onclick="cart.checkoutViaWhatsApp()">Order via WhatsApp</button>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;

    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.cart-modal-content').style.transform = 'scale(1)';
    }, 10);

    // Close functionality
    modal.querySelector('.cart-modal-close').addEventListener('click', closeCartModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCartModal();
        }
    });

    // Remove item functionality
    modal.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            cart.removeItem(productId);
            this.closest('.cart-item').remove();

            if (cart.items.length === 0) {
                modal.querySelector('.cart-modal-body').innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `;
            }
        });
    });

    // Quantity controls in modal
    modal.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const productId = this.dataset.productId;
            const quantityInput = modal.querySelector(`[data-product-id="${productId}"] .quantity-input`);

            let currentQuantity = parseInt(quantityInput.value);

            if (action === 'increase') {
                currentQuantity++;
            } else if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
            }

            quantityInput.value = currentQuantity;
            cart.updateQuantity(productId, currentQuantity);
            updateCartModalTotal();
        });
    });
}

function closeCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function updateCartModalTotal() {
    const totalElement = document.querySelector('.cart-total strong');
    if (totalElement) {
        totalElement.textContent = `Total: R${cart.total.toFixed(2)}`;
    }
}

function clearCart() {
    cart.items = [];
    cart.total = 0;
    cart.updateCartDisplay();
    cart.saveCart();
    closeCartModal();
    showNotification('Cart cleared!', 'info');
}

// Enhanced Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button');
            const email = emailInput.value.trim();

            // Basic email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const originalContent = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                submitButton.style.background = 'var(--success)';
                showNotification('Thank you for subscribing!', 'success');

                // Reset form after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalContent;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                    this.reset();
                }, 2000);
            }, 1000);
        });
    }
}

// Floating WhatsApp Button
function initFloatingWhatsApp() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        // Add pulse animation
        setInterval(() => {
            whatsappFloat.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                whatsappFloat.style.animation = '';
            }, 1000);
        }, 5000);

        // Scroll behavior
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            if (scrolled > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'scale(1)';
            } else {
                whatsappFloat.style.opacity = '0.8';
                whatsappFloat.style.transform = 'scale(0.9)';
            }
        }, 16));
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading Animations with Intersection Observer
function initLoadingAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for loading animation
    document.querySelectorAll('.product-card, .category-card, .testimonial-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced WhatsApp Integration
function initWhatsAppIntegration() {
    // Track WhatsApp clicks for analytics
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track WhatsApp interaction
            const message = this.getAttribute('data-message') || 'WhatsApp order';
            console.log(`WhatsApp clicked: ${message}`);

            // You can integrate with analytics here
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': message
                });
            }
        });
    });

    // Add pre-filled WhatsApp messages
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        const url = new URL(link.href);
        const currentText = url.searchParams.get('text') || '';

        // If no custom message, add default
        if (!currentText) {
            url.searchParams.set('text', 'Hi Taaibosch Organics! I would like to place an order.');
            link.href = url.toString();
        }
    });
}

// Search Functionality
function initSearchFunctionality() {
    // Add search functionality to search buttons/links
    document.querySelectorAll('a[href*="search"], .search-bar-icon').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();

            // For now, show a placeholder
            const searchQuery = prompt('What are you looking for?');
            if (searchQuery) {
                showNotification(`Searching for: ${searchQuery}`, 'info');
                // Here you would implement actual search functionality
                console.log(`Search query: ${searchQuery}`);
            }
        });
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary-green)'};
        color: var(--white);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .skeleton-shimmer {
        background: linear-gradient(90deg, var(--background-light) 25%, var(--secondary-green) 50%, var(--background-light) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .skeleton-line {
        border-radius: 4px;
        margin-bottom: 8px;
    }

    .skeleton-circle {
        border-radius: 50%;
    }

    .fade-out {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    }

    .cart-modal-content {
        background: var(--white);
        border-radius: var(--border-radius-lg);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .cart-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-lg);
        border-bottom: 1px solid #eee;
    }

    .cart-modal-close {
        background: none;
        border: none;
        font-size: var(--font-size-xl);
        cursor: pointer;
        color: var(--text-light);
    }

    .cart-modal-body {
        padding: var(--space-lg);
    }

    .empty-cart {
        text-align: center;
        padding: var(--space-3xl);
    }

    .empty-cart i {
        font-size: 3rem;
        color: var(--text-light);
        margin-bottom: var(--space-md);
    }

    .cart-item {
        display: flex;
        gap: var(--space-md);
        padding: var(--space-md);
        border-bottom: 1px solid #eee;
        align-items: center;
    }

    .cart-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item h4 {
        margin-bottom: var(--space-xs);
        color: var(--primary-green);
    }

    .cart-item p {
        font-size: var(--font-size-sm);
        color: var(--text-light);
        margin-bottom: var(--space-xs);
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
    }

    .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid var(--secondary-green);
        background: var(--white);
        color: var(--primary-green);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quantity-input {
        width: 50px;
        text-align: center;
        border: 1px solid var(--secondary-green);
        border-radius: var(--border-radius);
        padding: 5px;
    }

    .remove-item {
        background: var(--danger);
        color: var(--white);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
    }

    .cart-summary {
        margin-top: var(--space-lg);
        padding-top: var(--space-md);
        border-top: 2px solid var(--primary-green);
    }

    .cart-total {
        text-align: right;
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-md);
    }

    .cart-actions {
        display: flex;
        gap: var(--space-md);
        justify-content: flex-end;
    }

    .btn-sm {
        padding: var(--space-xs) var(--space-md);
        font-size: var(--font-size-sm);
    }

    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--danger);
        color: var(--white);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }

    .sticky-active {
        box-shadow: var(--shadow-md);
    }

    .navbar-shrink {
        transform: translateY(-50%);
    }

    .navbar-shrink .logo-text {
        font-size: var(--font-size-lg);
    }

    .navbar-shrink .logo img {
        height: 35px;
    }

    .whatsapp-hint {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: var(--primary-green);
        color: var(--white);
        padding: 5px 10px;
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        white-space: nowrap;
        opacity: 0;
        transition: var(--transition-normal);
    }

    .whatsapp-hint::before {
        content: '';
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid var(--primary-green);
    }

    .parallax-bg {
        transform: translateZ(0);
        will-change: transform;
    }
`;

document.head.appendChild(style);
