// Enhanced E-commerce Features - Taaibosch Organics

document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initCartDrawer();
    initQuickView();
    initShopFilters();
    initTrustBadges();
});

// ============================================
// 1. IMAGE LAZY LOADING
// ============================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img.lazy-image').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img.lazy-image').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

// ============================================
// 2. CART DRAWER (SLIDE-OUT)
// ============================================
function initCartDrawer() {
    const cartIcon = document.querySelector('.shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCartDrawer();
        });
    }
}

function showCartDrawer() {
    // Remove existing drawer if present
    const existingDrawer = document.querySelector('.cart-drawer');
    if (existingDrawer) {
        existingDrawer.remove();
    }

    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
        <div class="cart-drawer-overlay"></div>
        <div class="cart-drawer-content">
            <div class="cart-drawer-header">
                <h3>
                    <i class="fas fa-shopping-cart"></i>
                    Shopping Cart
                    <span class="cart-item-count">(${cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                </h3>
                <button class="cart-drawer-close" aria-label="Close cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-drawer-body">
                ${cart.items.length === 0 ? `
                    <div class="empty-cart-drawer">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="/shop/" class="btn btn-primary">Continue Shopping</a>
                    </div>
                ` : `
                    <div class="cart-items-list">
                        ${cart.items.map(item => `
                            <div class="cart-item-drawer" data-item-id="${item.id}">
                                <div class="cart-item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="cart-item-info">
                                    <h4>${item.name}</h4>
                                    <p class="cart-item-desc">${item.description || ''}</p>
                                    <div class="cart-item-controls">
                                        <div class="quantity-controls">
                                            <button class="qty-btn qty-decrease" data-product-id="${item.id}">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <input type="number" class="qty-input" value="${item.quantity}" min="1" data-product-id="${item.id}" readonly>
                                            <button class="qty-btn qty-increase" data-product-id="${item.id}">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="cart-item-price">
                                            R${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Remove item">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-drawer-summary">
                        <div class="cart-summary-row">
                            <span>Subtotal:</span>
                            <span>R${cart.total.toFixed(2)}</span>
                        </div>
                        <div class="cart-summary-row">
                            <span>Shipping:</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div class="cart-summary-row total">
                            <span>Total:</span>
                            <span>R${cart.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="cart-drawer-actions">
                        <button class="btn btn-outline btn-block" onclick="clearCart()">
                            <i class="fas fa-trash"></i>
                            Clear Cart
                        </button>
                        <button class="btn btn-primary btn-block" onclick="deliveryOptions.showDeliveryModal()">
                            <i class="fas fa-check"></i>
                            Proceed to Checkout
                        </button>
                        <a href="https://wa.me/27645022066?text=${encodeURIComponent(cart.checkoutMessage())}" class="btn btn-success btn-block" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            Checkout via WhatsApp
                        </a>
                    </div>
                `}
            </div>
        </div>
    `;

    document.body.appendChild(drawer);
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
        drawer.classList.add('active');
    }, 10);

    // Close handlers
    drawer.querySelector('.cart-drawer-close').addEventListener('click', closeCartDrawer);
    drawer.querySelector('.cart-drawer-overlay').addEventListener('click', closeCartDrawer);

    // Remove item handlers
    drawer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            cart.removeItem(productId);
            updateCartDrawer();
        });
    });

    // Quantity controls
    drawer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const isIncrease = this.classList.contains('qty-increase');
            const item = cart.items.find(i => i.id == productId);
            
            if (item) {
                if (isIncrease) {
                    cart.updateQuantity(productId, item.quantity + 1);
                } else if (item.quantity > 1) {
                    cart.updateQuantity(productId, item.quantity - 1);
                }
                updateCartDrawer();
            }
        });
    });
}

function closeCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
        drawer.classList.remove('active');
        setTimeout(() => {
            drawer.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function updateCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
        showCartDrawer();
    }
}

// ============================================
// 3. PRODUCT QUICK VIEW
// ============================================
function initQuickView() {
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            if (productCard) {
                showQuickView(productCard);
            }
        });
    });
}

function showQuickView(productCard) {
    const name = productCard.querySelector('.product-name')?.textContent || 'Product';
    const price = productCard.querySelector('.product-price')?.textContent || 'R0';
    const description = productCard.querySelector('.product-description')?.textContent || '';
    const image = productCard.querySelector('img')?.src || '';
    const rating = productCard.querySelector('.product-rating')?.innerHTML || '';

    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-overlay"></div>
        <div class="quick-view-content">
            <button class="quick-view-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="quick-view-info">
                    <h2>${name}</h2>
                    ${rating ? `<div class="quick-view-rating">${rating}</div>` : ''}
                    <div class="quick-view-price">${price}</div>
                    <p class="quick-view-description">${description}</p>
                    <div class="quick-view-features">
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>92+ Minerals</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Wildcrafted</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Organic Certified</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Vegan Friendly</span>
                        </div>
                    </div>
                    <div class="quick-view-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn qty-decrease" data-action="decrease">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="qty-input" value="1" min="1" id="qv-quantity">
                            <button class="qty-btn qty-increase" data-action="increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn btn-primary btn-lg add-to-cart-quick" data-product-card="${productCard.dataset.productCard || ''}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                    <div class="quick-view-trust">
                        <div class="trust-item">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Free shipping on orders over R500</span>
                        </div>
                        <div class="trust-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure checkout</span>
                        </div>
                        <div class="trust-item">
                            <i class="fas fa-undo"></i>
                            <span>30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Close handlers
    modal.querySelector('.quick-view-close').addEventListener('click', () => closeQuickView(modal));
    modal.querySelector('.quick-view-overlay').addEventListener('click', () => closeQuickView(modal));

    // Quantity controls
    modal.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = modal.querySelector('#qv-quantity');
            let qty = parseInt(input.value);
            if (this.dataset.action === 'increase') {
                qty++;
            } else if (qty > 1) {
                qty--;
            }
            input.value = qty;
        });
    });

    // Add to cart
    modal.querySelector('.add-to-cart-quick').addEventListener('click', function() {
        const productData = getProductData(productCard);
        const quantity = parseInt(modal.querySelector('#qv-quantity').value);
        productData.quantity = quantity;
        
        for (let i = 0; i < quantity; i++) {
            cart.addItem(productData);
        }
        
        closeQuickView(modal);
        showCartDrawer();
    });
}

function closeQuickView(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

// ============================================
// 4. ENHANCED SHOP FILTERS
// ============================================
function initShopFilters() {
    const filterToggle = document.querySelector('.filter-toggle-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterOverlay = document.querySelector('.filter-overlay');
    const closeFilters = document.querySelector('.close-filters');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    const searchInput = document.querySelector('#product-search');
    const clearSearchBtn = document.querySelector('.clear-search');

    // Toggle filter sidebar
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.add('active');
            filterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close filters
    if (closeFilters) {
        closeFilters.addEventListener('click', closeFilterSidebar);
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (cb.value === 'all') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            document.querySelector('input[name="sort"][value="default"]').checked = true;
            document.getElementById('min-price').value = 0;
            document.getElementById('max-price').value = 500;
            applyFilters();
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const hasValue = this.value.length > 0;
            if (clearSearchBtn) {
                clearSearchBtn.style.display = hasValue ? 'block' : 'none';
            }
            applyFilters();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            applyFilters();
        });
    }

    // Filter change handlers
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.value === 'all' && this.checked) {
                document.querySelectorAll('input[name="category"]').forEach(c => {
                    if (c.value !== 'all') c.checked = false;
                });
            } else if (this.checked) {
                document.querySelector('input[name="category"][value="all"]').checked = false;
            }
            applyFilters();
        });
    });

    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    // Price filter
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const priceSlider = document.getElementById('price-slider');

    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            maxPrice.value = this.value;
            applyFilters();
        });
    }

    if (minPrice) {
        minPrice.addEventListener('change', applyFilters);
    }

    if (maxPrice) {
        maxPrice.addEventListener('change', function() {
            priceSlider.value = this.value;
            applyFilters();
        });
    }
}

function closeFilterSidebar() {
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterOverlay = document.querySelector('.filter-overlay');
    if (filterSidebar) {
        filterSidebar.classList.remove('active');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function applyFilters() {
    const searchQuery = document.querySelector('#product-search')?.value.toLowerCase() || '';
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('min-price')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price')?.value) || 500;
    const sortBy = document.querySelector('input[name="sort"]:checked')?.value || 'default';

    const productCards = Array.from(document.querySelectorAll('[data-product-card]'));
    let visibleCount = 0;

    productCards.forEach(card => {
        const name = (card.dataset.productName || '').toLowerCase();
        const tags = (card.dataset.productTags || '').toLowerCase();
        const price = parseFloat(card.dataset.productPrice) || 0;
        const category = card.dataset.productCategory || '';

        const matchesSearch = !searchQuery || name.includes(searchQuery) || tags.includes(searchQuery);
        const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(category);
        const matchesPrice = price >= minPrice && price <= maxPrice;

        if (matchesSearch && matchesCategory && matchesPrice) {
            card.style.display = '';
            card.classList.remove('filtered-out');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('filtered-out');
        }
    });

    // Sort products
    if (sortBy !== 'default') {
        const visibleCards = productCards.filter(card => !card.classList.contains('filtered-out'));
        const sortedCards = [...visibleCards].sort((a, b) => {
            switch(sortBy) {
                case 'price-low':
                    return (parseFloat(a.dataset.productPrice) || 0) - (parseFloat(b.dataset.productPrice) || 0);
                case 'price-high':
                    return (parseFloat(b.dataset.productPrice) || 0) - (parseFloat(a.dataset.productPrice) || 0);
                case 'name-asc':
                    return (a.dataset.productName || '').localeCompare(b.dataset.productName || '');
                default:
                    return 0;
            }
        });

        const grid = document.getElementById('product-grid');
        sortedCards.forEach(card => grid.appendChild(card));
    }

    // Update feedback
    const feedback = document.querySelector('[data-filter-feedback]');
    if (feedback) {
        if (visibleCount === 0) {
            feedback.textContent = 'No products found. Try adjusting your filters.';
        } else if (visibleCount === productCards.length) {
            feedback.textContent = `Showing all ${visibleCount} products`;
        } else {
            feedback.textContent = `Showing ${visibleCount} of ${productCards.length} products`;
        }
    }
}

// ============================================
// 5. TRUST BADGES & SOCIAL PROOF
// ============================================
function initTrustBadges() {
    // Add trust badges to checkout page
    if (document.querySelector('.checkout-page')) {
        addCheckoutTrustBadges();
    }

    // Add social proof to product cards
    addProductSocialProof();
}

function addCheckoutTrustBadges() {
    const checkoutSection = document.querySelector('.checkout-section') || document.querySelector('section');
    if (checkoutSection) {
        const trustBadges = document.createElement('div');
        trustBadges.className = 'trust-badges-section';
        trustBadges.innerHTML = `
            <div class="trust-badges-grid">
                <div class="trust-badge">
                    <i class="fas fa-shield-alt"></i>
                    <span>Secure Payment</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-truck"></i>
                    <span>Free Shipping Over R500</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-undo"></i>
                    <span>30-Day Returns</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-star"></i>
                    <span>4.8/5 Rating</span>
                </div>
            </div>
        `;
        checkoutSection.insertBefore(trustBadges, checkoutSection.firstChild);
    }
}

function addProductSocialProof() {
    // This would typically come from a backend, but for demo purposes:
    const socialProofData = {
        'gel-original': { sales: 1247, reviews: 24 },
        'gel-berry': { sales: 892, reviews: 18 },
        'gel-strawberry': { sales: 1103, reviews: 22 }
    };

    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.querySelector('.quick-view-btn')?.dataset.productId;
        if (productId && socialProofData[productId]) {
            const proof = document.createElement('div');
            proof.className = 'social-proof';
            proof.innerHTML = `
                <span class="proof-text">
                    <i class="fas fa-fire"></i>
                    ${socialProofData[productId].sales}+ sold this month
                </span>
            `;
            card.querySelector('.product-info')?.appendChild(proof);
        }
    });
}

// Extend cart object with checkout message
if (typeof cart !== 'undefined') {
    cart.checkoutMessage = function() {
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
        return message;
    };
}

// Auto-update product cards without data attributes
function updateProductCardsAttributes() {
    document.querySelectorAll('.product-card:not([data-product-card])').forEach(card => {
        const name = card.querySelector('.product-name')?.textContent || '';
        const priceText = card.querySelector('.product-price')?.textContent || '0';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
        
        // Determine category from name
        let category = 'all';
        const nameLower = name.toLowerCase();
        if (nameLower.includes('gel')) category = 'gels';
        else if (nameLower.includes('gumm')) category = 'gummies';
        else if (nameLower.includes('raw')) category = 'raw';
        else if (nameLower.includes('capsule') || nameLower.includes('supplement')) category = 'supplements';
        
        // Set attributes
        card.setAttribute('data-product-card', '');
        card.setAttribute('data-product-name', name);
        card.setAttribute('data-product-price', price);
        card.setAttribute('data-product-category', category);
        
        // Add tags
        const tags = [category, ...nameLower.split(' ')].filter(t => t.length > 2).join(',');
        card.setAttribute('data-product-tags', tags);
        
        // Add lazy loading to images
        const img = card.querySelector('img');
        if (img && !img.classList.contains('lazy-image')) {
            img.classList.add('lazy-image');
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
            }
        }
        
        // Add quick view button if not present
        const productImage = card.querySelector('.product-image');
        if (productImage && !productImage.querySelector('.quick-view-btn')) {
            const actions = productImage.querySelector('.product-actions') || document.createElement('div');
            actions.className = 'product-actions';
            
            if (!actions.querySelector('.quick-view-btn')) {
                const quickViewBtn = document.createElement('button');
                quickViewBtn.className = 'product-action-btn quick-view-btn';
                quickViewBtn.setAttribute('data-product-id', name.toLowerCase().replace(/\s+/g, '-'));
                quickViewBtn.setAttribute('aria-label', 'Quick view');
                quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
                actions.appendChild(quickViewBtn);
            }
            
            if (!productImage.querySelector('.product-actions')) {
                productImage.appendChild(actions);
            }
        }
    });
    
    // Re-initialize quick view for new buttons
    initQuickView();
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateProductCardsAttributes, 100);
});

