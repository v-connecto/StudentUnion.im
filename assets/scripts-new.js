// ====================================
// StudentUnion.im - Modern Landing Page Scripts
// Animations, Interactions, and Functionality
// ====================================

(function() {
    'use strict';

    // ====================================
    // Mobile Navigation Toggle
    // ====================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ====================================
    // Navbar Scroll Effect
    // ====================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ====================================
    // Animated Counters
    // ====================================
    function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        const isDecimal = target % 1 !== 0;

        const timer = setInterval(function() {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            let displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
            element.textContent = prefix + displayValue + suffix;
        }, 16);
    }

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                const target = parseFloat(entry.target.dataset.target);
                const prefix = entry.target.dataset.prefix || '';
                const suffix = entry.target.dataset.suffix || '';

                animateCounter(entry.target, target, 2000, prefix, suffix);
            }
        });
    }, { threshold: 0.5 });

    // Observe all counter elements
    document.querySelectorAll('.stat-number, .metric-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ====================================
    // Fade In on Scroll Animation
    // ====================================
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-scroll').forEach(element => {
        fadeInObserver.observe(element);
    });

    // ====================================
    // Smooth Scrolling for Anchor Links
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#" or "#!"
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // Waitlist Form Handler
    // ====================================
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                // Success message
                showFormMessage('Thank you! We\'ll notify you when we relaunch.', 'success');
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.textContent = 'Get Early Access';

                // Send to Google Form or other service
                // For now, we'll just log it
                console.log('Email submitted:', email);

                // Optional: Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'engagement',
                        'event_label': email
                    });
                }
            }, 1000);
        });
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(function() {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // ====================================
    // Performance: Lazy Load Images
    // ====================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ====================================
    // Accessibility: Focus Trap for Mobile Menu
    // ====================================
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        navMenu.addEventListener('keydown', function(e) {
            if (!navMenu.classList.contains('active')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
                document.body.style.overflow = '';
            }
        });
    }

    // ====================================
    // Hero Stats Animation on Page Load
    // ====================================
    window.addEventListener('load', function() {
        // Animate hero stats
        const heroStats = document.querySelectorAll('.hero .stat-number');
        heroStats.forEach(stat => {
            const target = parseFloat(stat.dataset.target);
            const prefix = stat.dataset.prefix || '';
            const suffix = stat.dataset.suffix || '';

            setTimeout(function() {
                animateCounter(stat, target, 2000, prefix, suffix);
            }, 300);
        });
    });

    // ====================================
    // Easter Egg: Konami Code
    // ====================================
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiPattern.join(',')) {
            console.log('🎉 Konami Code activated! You found the easter egg!');
            // Optional: Add special animation or feature
            document.body.style.animation = 'rainbow 2s ease-in-out';
        }
    });

    // ====================================
    // Console Message
    // ====================================
    console.log('%c👋 Hello Developer!', 'font-size: 24px; font-weight: bold; color: #ffcc00;');
    console.log('%cInterested in joining our mission?', 'font-size: 16px; color: #025ad3;');
    console.log('%cEmail us at: ceo@studentunion.im', 'font-size: 14px; color: #232323;');

    // ====================================
    // Performance Monitoring (Optional)
    // ====================================
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];

            if (typeof gtag !== 'undefined') {
                gtag('event', 'LCP', {
                    event_category: 'Performance',
                    value: Math.round(lastEntry.startTime),
                    event_label: 'Largest Contentful Paint'
                });
            }
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP not supported
        }

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'FID', {
                        event_category: 'Performance',
                        value: Math.round(entry.processingStart - entry.startTime),
                        event_label: 'First Input Delay'
                    });
                }
            });
        });

        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // FID not supported
        }
    }

    // ====================================
    // Cumulative Layout Shift (CLS) Monitoring
    // ====================================
    if ('PerformanceObserver' in window) {
        let clsScore = 0;

        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            }
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // CLS not supported
        }

        // Report CLS on page unload
        window.addEventListener('beforeunload', () => {
            if (typeof gtag !== 'undefined' && clsScore > 0) {
                gtag('event', 'CLS', {
                    event_category: 'Performance',
                    value: Math.round(clsScore * 1000),
                    event_label: 'Cumulative Layout Shift'
                });
            }
        });
    }

})();
