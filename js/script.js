// City Clothing - Complete JavaScript Functionality

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedPromo = null;

// Product Data for Quick View
const productData = {
    1: {
        name: "Urban Shirt",
        price: 299,
        category: "Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A stylish urban shirt perfect for casual outings and everyday wear. Made from premium cotton for maximum comfort.",
        features: [
            "100% Premium Cotton",
            "Machine Washable",
            "Available in multiple colors",
            "Regular fit"
        ]
    },
    2: {
        name: "Leather Jacket",
        price: 899,
        category: "Jackets",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A classic leather jacket that never goes out of style. Perfect for adding an edge to any outfit.",
        features: [
            "Genuine Leather",
            "Inner lining for comfort",
            "Multiple pockets",
            "Available in black and brown"
        ]
    },
    3: {
        name: "City Sneakers",
        price: 499,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Comfortable and stylish sneakers designed for urban living. Perfect for all-day wear.",
        features: [
            "Breathable mesh upper",
            "Cushioned insole",
            "Durable rubber sole",
            "Available in multiple colors"
        ]
    },
    4: {
        name: "Fashion Hat",
        price: 199,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A trendy hat to complete your urban look. Adjustable for perfect fit.",
        features: [
            "Adjustable strap",
            "Premium materials",
            "One size fits most",
            "Multiple color options"
        ]
    },
    5: {
        name: "Slim Jeans",
        price: 349,
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Slim-fit jeans that offer both style and comfort. Perfect for casual and semi-formal occasions.",
        features: [
            "Stretch denim",
            "Slim fit",
            "Multiple washes available",
            "Machine washable"
        ]
    },
    6: {
        name: "Urban Hoodie",
        price: 399,
        category: "Shirts",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A comfortable and stylish hoodie perfect for casual urban wear.",
        features: [
            "Premium cotton blend",
            "Kangaroo pocket",
            "Ribbed cuffs and hem",
            "Available in multiple colors"
        ]
    },
    7: {
        name: "Bomber Jacket",
        price: 799,
        category: "Jackets",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A classic bomber jacket with modern urban styling.",
        features: [
            "Ribbed collar and cuffs",
            "Multiple pockets",
            "Lightweight yet warm",
            "Available in multiple colors"
        ]
    },
    8: {
        name: "Classic Sneakers",
        price: 459,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Timeless sneakers that combine comfort with urban style.",
        features: [
            "Premium leather upper",
            "Cushioned insole",
            "Durable rubber outsole",
            "Available in multiple colors"
        ]
    }
};

// Promo Codes
const promoCodes = {
    'WELCOME10': 0.1,  // 10% off
    'SAVE15': 0.15,    // 15% off
    'FREESHIP': 'free-shipping' // Free shipping
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCart();
    initializeProductPages();
    initializeForms();
    initializeModals();
    
    // NEW: Initialize enhanced features
    initializeAccordion();
    initializeLightbox();
    initializeSearch();
    initializeFullPageCart();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== CART FUNCTIONALITY =====
function initializeCart() {
    updateCartDisplay();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            addToCart(name, price, image);
        });
    });
}

function addToCart(name, price, image) {
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Update cart totals
    updateCartTotals();
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartTotals() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('cart-total');
    const discountElement = document.getElementById('discount');
    const discountRow = document.getElementById('discount-row');
    
    if (!subtotalElement) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over R500, otherwise R50)
    let shipping = subtotal >= 500 ? 0 : 50;
    
    // Apply free shipping promo if applicable
    if (appliedPromo === 'free-shipping') {
        shipping = 0;
    }
    
    // Calculate tax (15% of subtotal)
    const tax = subtotal * 0.15;
    
    // Calculate total
    let total = subtotal + shipping + tax;
    let discountAmount = 0;
    
    // Apply percentage discount if applicable
    if (appliedPromo && appliedPromo !== 'free-shipping') {
        discountAmount = subtotal * appliedPromo;
        total -= discountAmount;
        
        // Show discount row
        discountRow.style.display = 'flex';
        discountElement.textContent = `-R${discountAmount.toFixed(2)}`;
    } else {
        // Hide discount row
        discountRow.style.display = 'none';
    }
    
    // Update display
    subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`;
    taxElement.textContent = `R${tax.toFixed(2)}`;
    totalElement.textContent = `R${total.toFixed(2)}`;
}

function applyPromoCode() {
    const promoCodeInput = document.getElementById('promo-code');
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        showNotification(`Promo code "${code}" applied successfully!`, 'success');
        updateCartTotals();
        updateFullPageCart();
    } else {
        showNotification('Invalid promo code. Please try again.', 'error');
    }
}

// ===== FULL PAGE CART FUNCTIONALITY =====
function initializeFullPageCart() {
    if (!document.getElementById('cart-items-list')) return;
    
    updateFullPageCart();
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                appliedPromo = null;
                updateFullPageCart();
                showNotification('Cart cleared successfully!', 'success');
            }
        });
    }
    
    // Promo code functionality
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoCodeInput = document.getElementById('promo-code');
    
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
        promoCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
    
    // Load recommended products
    loadRecommendedProducts();
}

function updateFullPageCart() {
    const emptyCart = document.getElementById('empty-cart');
    const cartWithItems = document.getElementById('cart-with-items');
    const cartItemsList = document.getElementById('cart-items-list');
    
    if (!emptyCart || !cartWithItems || !cartItemsList) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartWithItems.style.display = 'none';
        return;
    } else {
        emptyCart.style.display = 'none';
        cartWithItems.style.display = 'block';
    }
    
    // Render cart items
    cartItemsList.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-category">${item.category || 'Fashion'}</p>
                <p class="cart-item-price">R${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn decrease" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            increaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        });
    });
    
    // Update cart totals and counts
    updateCartTotals();
    updateCartCounts();
}

function updateCartCounts() {
    const cartItemCount = document.getElementById('cart-item-count');
    const summaryItemCount = document.getElementById('summary-item-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartItemCount) cartItemCount.textContent = totalItems;
    if (summaryItemCount) summaryItemCount.textContent = totalItems;
}

function loadRecommendedProducts() {
    const recommendedGrid = document.querySelector('.recommended-section .product-grid');
    if (!recommendedGrid) return;
    
    const recommendedProducts = [
        {
            name: "Snapback Hat",
            price: 179,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "Classic Sneakers",
            price: 459,
            category: "Footwear",
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "Urban Hoodie",
            price: 399,
            category: "Shirts",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];
    
    recommendedGrid.innerHTML = '';
    recommendedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view" data-product="recommended">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">R${product.price}.00</p>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            </div>
        `;
        recommendedGrid.appendChild(productCard);
    });
    
    // Add event listeners to recommended products
    recommendedGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            addToCart(name, price, image);
            showNotification(`${name} added to cart!`, 'success');
        });
    });
}

// ===== PRODUCT PAGES FUNCTIONALITY =====
function initializeProductPages() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Show/hide products based on filter
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const productsContainer = document.querySelector('.products-grid');
            const productCardsArray = Array.from(productCards);
            
            productCardsArray.sort((a, b) => {
                const aPrice = parseFloat(a.querySelector('.product-price').textContent.replace('R', ''));
                const aName = a.querySelector('h3').textContent;
                
                const bPrice = parseFloat(b.querySelector('.product-price').textContent.replace('R', ''));
                const bName = b.querySelector('h3').textContent;
                
                switch(sortValue) {
                    case 'price-low':
                        return aPrice - bPrice;
                    case 'price-high':
                        return bPrice - aPrice;
                    case 'name':
                        return aName.localeCompare(bName);
                    default:
                        return 0;
                }
            });
            
            // Clear and re-append sorted products
            productsContainer.innerHTML = '';
            productCardsArray.forEach(card => {
                productsContainer.appendChild(card);
            });
        });
    }
    
    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        let visibleProducts = 8;
        const allProducts = document.querySelectorAll('.product-card');
        
        // Initially hide products beyond the first 8
        allProducts.forEach((product, index) => {
            if (index >= visibleProducts) {
                product.style.display = 'none';
            }
        });
        
        loadMoreBtn.addEventListener('click', () => {
            // Show next 4 products
            visibleProducts += 4;
            
            allProducts.forEach((product, index) => {
                if (index < visibleProducts) {
                    product.style.display = 'block';
                }
            });
            
            // Hide load more button if all products are visible
            if (visibleProducts >= allProducts.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('product-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }
}

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
        
        const matches = productName.includes(searchTerm) || 
                       productCategory.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    const noResults = document.getElementById('no-results');
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResults) {
            const message = document.createElement('div');
            message.id = 'no-results';
            message.innerHTML = `<p style="text-align: center; color: #666; font-style: italic;">No products found matching "${searchTerm}"</p>`;
            document.querySelector('.products-grid').appendChild(message);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

// ===== ACCORDION FUNCTIONALITY =====
function initializeAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'faq-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        question.appendChild(toggleBtn);
        
        // Initially hide answers
        answer.style.display = 'none';
        
        toggleBtn.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('p').style.display = 'none';
                    otherItem.querySelector('.faq-toggle').innerHTML = '<i class="fas fa-chevron-down"></i>';
                }
            });
            
            // Toggle current item
            answer.style.display = isOpen ? 'none' : 'block';
            toggleBtn.innerHTML = isOpen ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-up"></i>';
        });
    });
}

// ===== LIGHTBOX FUNCTIONALITY =====
function initializeLightbox() {
    const productImages = document.querySelectorAll('.product-image img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&lt;</button>
            <img src="" alt="">
            <button class="lightbox-next">&gt;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    let currentImageIndex = 0;
    const images = Array.from(productImages);
    
    productImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });
    
    function openLightbox(src) {
        lightbox.querySelector('img').src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = images.length - 1;
        if (currentImageIndex >= images.length) currentImageIndex = 0;
        
        lightbox.querySelector('img').src = images[currentImageIndex].src;
    }
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

// ===== MODALS FUNCTIONALITY =====
function initializeModals() {
    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const overlay = document.querySelector('.overlay');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.product;
            const product = productData[productId];
            
            if (product) {
                openQuickView(product);
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeQuickView);
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeQuickView();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
}

function openQuickView(product) {
    const quickViewModal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.overlay');
    const modalBody = document.querySelector('.modal-body');
    
    if (!quickViewModal || !overlay || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <h2>${product.name}</h2>
            <p class="modal-price">R${product.price}.00</p>
            <p class="modal-category">${product.category}</p>
            <p class="modal-description">${product.description}</p>
            
            <div class="quantity-selector">
                <span>Quantity:</span>
                <button class="quantity-btn decrease-qty">-</button>
                <span class="quantity-display">1</span>
                <button class="quantity-btn increase-qty">+</button>
            </div>
            
            <div class="modal-actions">
                <button class="btn add-to-cart-modal" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-image="${product.image}">
                    Add to Cart
                </button>
                <button class="btn btn-outline">Add to Wishlist</button>
            </div>
            
            <div class="product-features">
                <h4>Product Features</h4>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Add event listeners for quantity buttons in modal
    const decreaseBtn = modalBody.querySelector('.decrease-qty');
    const increaseBtn = modalBody.querySelector('.increase-qty');
    const quantityDisplay = modalBody.querySelector('.quantity-display');
    const addToCartModal = modalBody.querySelector('.add-to-cart-modal');
    
    let quantity = 1;
    
    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });
    
    // Add to cart from modal
    addToCartModal.addEventListener('click', () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product.name, product.price, product.image);
        }
        showNotification(`${quantity} ${product.name}(s) added to cart!`, 'success');
        closeQuickView();
    });
    
    quickViewModal.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const quickViewModal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.overlay');
    
    if (quickViewModal && overlay) {
        quickViewModal.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== FORM FUNCTIONALITY =====
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Enquiry form
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const alertBox = document.getElementById('contactAlert');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showAlert('Please fill in all required fields.', 'error', alertBox);
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert('Please enter a valid email address.', 'error', alertBox);
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Save contact to localStorage
        const contact = {
            name,
            email,
            phone,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        
        let contacts = JSON.parse(localStorage.getItem('cityClothingContacts')) || [];
        contacts.push(contact);
        localStorage.setItem('cityClothingContacts', JSON.stringify(contacts));
        
        showAlert('Your message has been sent successfully! We will get back to you within 24 hours.', 'success', alertBox);
        
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleEnquirySubmit(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const enquiryType = document.getElementById('enquiryType').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const newsletter = document.getElementById('newsletter').checked;
    const alertBox = document.getElementById('enquiryAlert');
    
    // Basic validation
    if (!fullName || !email || !enquiryType || !subject || !message) {
        showAlert('Please fill in all required fields.', 'error', alertBox);
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert('Please enter a valid email address.', 'error', alertBox);
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Save enquiry to localStorage
        const enquiry = {
            fullName,
            email,
            phone,
            enquiryType,
            subject,
            message,
            newsletter,
            timestamp: new Date().toISOString()
        };
        
        let enquiries = JSON.parse(localStorage.getItem('cityClothingEnquiries')) || [];
        enquiries.push(enquiry);
        localStorage.setItem('cityClothingEnquiries', JSON.stringify(enquiries));
        
        showAlert('Thank you for your enquiry! We will get back to you within 24 hours.', 'success', alertBox);
        
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Send confirmation email (simulated)
        console.log('Confirmation email sent to:', email);
    }, 2000);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Save newsletter subscription
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
    
    showNotification('Successfully subscribed to our newsletter!', 'success');
    e.target.reset();
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        z-index: 1002;
        transition: transform 0.3s, opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showAlert(message, type, alertElement) {
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.className = `alert ${type}`;
    alertElement.style.display = 'block';
    
    // Scroll to alert
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as (XXX) XXX-XXXX for US numbers
            if (value.length <= 10) {
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
            }
            
            e.target.value = value;
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
        const proceedBtn = document.getElementById("proceed-checkout");
        const modal = document.getElementById("orderModal");
        const closeModal = document.querySelector(".modal .close");

        proceedBtn.addEventListener("click", function(e) {
            e.preventDefault(); // Prevent navigating to checkout.html

            // Clear cart items if you have a container
            const cartItemsContainer = document.querySelector(".cart-items");
            if (cartItemsContainer) cartItemsContainer.innerHTML = "";

            // Show modal
            modal.style.display = "block";
        });

        // Close modal when clicking the X
        closeModal.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Close modal when clicking outside modal content
        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    });
