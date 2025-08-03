// Amazon Clone - Complete JavaScript Functionality
class AmazonClone {
    constructor() {
        this.cartCount = 0;
        this.searchHistory = [];
        this.isMenuOpen = false;
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.initGSAPAnimations();
        this.setupEventListeners();
        this.initializeComponents();
        this.loadUserData();
    }

    // GSAP Animation System
    initGSAPAnimations() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Initial page load animations
        this.playInitialAnimations();
        
        // Setup scroll-triggered animations
        this.setupScrollAnimations();
    }

    playInitialAnimations() {
        // Create timeline for coordinated animations
        const tl = gsap.timeline();

        // Navbar slide down
        tl.from('nav', {
            duration: 1,
            y: -100,
            opacity: 0,
            ease: 'power3.out'
        })

        // Hero section fade in
        .from('.hero-content', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.5')

        // Product cards staggered entrance
        .from('.product-card', {
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: {
                amount: 0.8,
                from: 'start'
            },
            ease: 'back.out(1.7)'
        }, '-=0.3')

        // Full sections animation
        .from('.full-section', {
            duration: 1,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.4');
    }

    setupScrollAnimations() {
        // Animate sections on scroll
        gsap.utils.toArray('.full-section').forEach((section, index) => {
            gsap.from(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => this.animateSection(section),
                    onLeave: () => this.resetSection(section)
                },
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });

        // Parallax effect for hero section
        gsap.to('.hero-section', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    animateSection(section) {
        gsap.to(section, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    resetSection(section) {
        gsap.to(section, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Mobile menu
        this.setupMobileMenu();
        
        // Search functionality
        this.setupSearch();
        
        // Cart functionality
        this.setupCart();
        
        // Navigation interactions
        this.setupNavigation();
        
        // Product interactions
        this.setupProductInteractions();
        
        // Footer interactions
        this.setupFooter();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Window events
        this.setupWindowEvents();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.createElement('div');
        
        mobileMenuOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden mobile-overlay';
        document.body.appendChild(mobileMenuOverlay);

        mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        mobileMenuOverlay.addEventListener('click', () => this.closeMobileMenu());
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (!this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        mobileMenu.classList.remove('hidden');
        overlay.classList.remove('hidden');
        this.isMenuOpen = true;
        
        // Animate menu in
        gsap.fromTo(mobileMenu, 
            { x: -300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
        
        gsap.fromTo(overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        // Animate menu out
        gsap.to(mobileMenu, {
            x: -300,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                mobileMenu.classList.add('hidden');
            }
        });
        
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                overlay.classList.add('hidden');
            }
        });
        
        this.isMenuOpen = false;
        document.body.style.overflow = '';
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.querySelector('.search-bar');
        
        // Search input focus effects
        searchInput?.addEventListener('focus', () => {
            gsap.to(searchBar, {
                duration: 0.3,
                scale: 1.02,
                boxShadow: '0 0 20px rgba(255, 153, 0, 0.3)',
                ease: 'power2.out'
            });
        });

        searchInput?.addEventListener('blur', () => {
            gsap.to(searchBar, {
                duration: 0.3,
                scale: 1,
                boxShadow: 'none',
                ease: 'power2.out'
            });
        });

        // Search functionality
        searchBtn?.addEventListener('click', () => this.performSearch());
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Search suggestions (simulate)
        searchInput?.addEventListener('input', (e) => {
            this.handleSearchSuggestions(e.target.value);
        });
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const query = searchInput?.value.trim();

        if (!query) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }

        // Animate search button
        gsap.to(searchBtn, {
            duration: 0.2,
            scale: 0.95,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Add to search history
        this.addToSearchHistory(query);

        // Simulate search (replace with actual search logic)
        this.showNotification(`Searching for: ${query}`, 'info');
        
        // Show loading state
        this.showSearchLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideSearchLoading();
            this.displaySearchResults(query);
        }, 1500);
    }

    handleSearchSuggestions(query) {
        if (query.length < 2) return;
        
        // Simulate search suggestions
        const suggestions = [
            'iPhone 15', 'Samsung Galaxy', 'MacBook Pro', 'AirPods',
            'PlayStation 5', 'Nintendo Switch', 'iPad Pro', 'Apple Watch'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

        this.showSearchSuggestions(suggestions);
    }

    showSearchSuggestions(suggestions) {
        // Create or update suggestions dropdown
        let dropdown = document.querySelector('.search-suggestions');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-suggestions absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-50 hidden';
            document.querySelector('.search-bar').parentNode.appendChild(dropdown);
        }

        if (suggestions.length > 0) {
            dropdown.innerHTML = suggestions.map(suggestion => 
                `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">${suggestion}</div>`
            ).join('');
            
            dropdown.classList.remove('hidden');
            
            // Add click events to suggestions
            dropdown.querySelectorAll('div').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelector('.search-input').value = item.textContent;
                    dropdown.classList.add('hidden');
                    this.performSearch();
                });
            });
        } else {
            dropdown.classList.add('hidden');
        }
    }

    showSearchLoading() {
        const searchBtn = document.querySelector('.search-btn');
        const originalContent = searchBtn.innerHTML;
        
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i>';
        searchBtn.disabled = true;
        
        // Store original content for restoration
        searchBtn.dataset.originalContent = originalContent;
    }

    hideSearchLoading() {
        const searchBtn = document.querySelector('.search-btn');
        searchBtn.innerHTML = searchBtn.dataset.originalContent;
        searchBtn.disabled = false;
    }

    displaySearchResults(query) {
        // This would typically redirect to search results page
        // For demo, we'll show a modal
        this.showNotification(`Found results for: ${query}`, 'success');
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10 searches
            this.saveToLocalStorage('searchHistory', this.searchHistory);
        }
    }

    setupCart() {
        const cartIcon = document.querySelector('.cart-icon');
        const cartCountElement = document.querySelector('.cart-count');
        
        // Add click event to cart
        cartIcon?.addEventListener('click', () => this.openCart());
        
        // Initialize cart count
        this.updateCartDisplay();
    }

    addToCart(productId = null, quantity = 1) {
        this.cartCount += quantity;
        
        // Animate cart icon
        const cartIcon = document.querySelector('.cart-icon');
        gsap.to(cartIcon, {
            duration: 0.3,
            scale: 1.2,
            yoyo: true,
            repeat: 1,
            ease: 'elastic.out(1, 0.3)'
        });

        // Update cart display
        this.updateCartDisplay();
        
        // Show notification
        this.showNotification(`Item added to cart!`, 'success');
        
        // Save to localStorage
        this.saveCartData();
    }

    updateCartDisplay() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.cartCount;
            
            // Animate count update
            gsap.fromTo(cartCountElement, 
                { scale: 1.5, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    }

    openCart() {
        // Simulate cart opening
        this.showNotification(`Cart has ${this.cartCount} items`, 'info');
        
        // Animate cart icon
        gsap.to('.cart-icon', {
            duration: 0.4,
            rotation: 360,
            ease: 'power2.inOut'
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: target,
                        ease: 'power2.inOut'
                    });
                }
            });
        });

        // Back to top functionality
        const backToTop = document.querySelector('.back-to-top');
        backToTop?.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: 0,
                ease: 'power3.inOut'
            });
        });

        // Show/hide back to top based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                gsap.to(backToTop, { opacity: 1, duration: 0.3 });
            } else {
                gsap.to(backToTop, { opacity: 0.7, duration: 0.3 });
            }
        });
    }

    setupProductInteractions() {
        // Product card hover animations
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    ease: 'power3.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    ease: 'power3.out'
                });
            });

            // Add click event for product cards
            card.addEventListener('click', () => {
                this.openProductDetails(card);
            });
        });

        // Product image hover effects
        document.querySelectorAll('.product-image, [class*="smbox"], [class*="toybox"], [class*="fubox"]').forEach(img => {
            img.addEventListener('mouseenter', () => {
                gsap.to(img, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });

            img.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });

        // "See more" links
        document.querySelectorAll('.seemore, [class*="seemore"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMoreProducts(link);
            });
        });
    }

    openProductDetails(productCard) {
        // Animate card selection
        gsap.to(productCard, {
            duration: 0.3,
            scale: 0.98,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Show product modal (simplified)
        const productTitle = productCard.querySelector('h3')?.textContent || 'Product';
        this.showNotification(`Opening: ${productTitle}`, 'info');
        
        // Add to cart button simulation
        setTimeout(() => {
            if (confirm('Add this item to cart?')) {
                this.addToCart();
            }
        }, 500);
    }

    showMoreProducts(link) {
        // Animate the link
        gsap.to(link, {
            duration: 0.3,
            scale: 0.95,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Simulate loading more products
        this.showNotification('Loading more products...', 'info');
    }

    setupFooter() {
        // Animate footer links
        document.querySelectorAll('footer a').forEach(link => {
            link.classList.add('footer-link');
            
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    duration: 0.3,
                    color: '#FF9900',
                    x: 5,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    duration: 0.3,
                    color: '#cccccc',
                    x: 0,
                    ease: 'power2.out'
                });
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Search shortcut (Ctrl/Cmd + K)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.search-input')?.focus();
            }
            
            // Cart shortcut (Ctrl/Cmd + Shift + C)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.openCart();
            }
        });
    }

    setupWindowEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Connection lost', 'warning');
        });
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    pauseAnimations() {
        gsap.globalTimeline.pause();
    }

    resumeAnimations() {
        gsap.globalTimeline.resume();
    }

    // Utility Functions
    initializeComponents() {
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
    }

    initTooltips() {
        // Add tooltips to interactive elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            this.addTooltip(element);
        });
    }

    addTooltip(element) {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-800 text-white p-2 rounded text-sm z-50 tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            gsap.fromTo(tooltip, 
                { opacity: 0, y: 5 },
                { opacity: 1, y: 0, duration: 0.2 }
            );
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                gsap.to(tooltip, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => tooltip.remove()
                });
            }
        });
    }

    initLazyLoading() {
        // Implement intersection observer for lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }

    initPerformanceMonitoring() {
        // Monitor performance metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 notification notification-${type}`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button class="ml-4 text-xl">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.fromTo(notification,
            { x: 400, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
        
        // Auto remove after 3 seconds
        setTimeout(() => this.removeNotification(notification), 3000);
        
        // Close button
        notification.querySelector('button').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        gsap.to(notification, {
            x: 400,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => notification.remove()
        });
    }

    // Data Management
    loadUserData() {
        // Load cart count from localStorage
        const savedCartCount = this.getFromLocalStorage('cartCount');
        if (savedCartCount) {
            this.cartCount = parseInt(savedCartCount);
            this.updateCartDisplay();
        }

        // Load search history
        const savedSearchHistory = this.getFromLocalStorage('searchHistory');
        if (savedSearchHistory) {
            this.searchHistory = savedSearchHistory;
        }
    }

    saveCartData() {
        this.saveToLocalStorage('cartCount', this.cartCount);
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            return null;
        }
    }

    // Public API methods
    search(query) {
        document.querySelector('.search-input').value = query;
        this.performSearch();
    }

    addProductToCart(productId, quantity = 1) {
        this.addToCart(productId, quantity);
    }

    openMobileMenuPublic() {
        this.openMobileMenu();
    }

    closeMobileMenuPublic() {
        this.closeMobileMenu();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.amazonClone = new AmazonClone();
    
    // Add global helper functions
    window.addToCart = () => amazonClone.addToCart();
    window.searchProduct = (query) => amazonClone.search(query);
    
    console.log('Amazon Clone initialized successfully!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmazonClone;
}

// End of sandip.js
// This file contains the complete JavaScript functionality for the Amazon Clone project.