/* ============================================
   StudentUnion.im - Bioreform-Style Animations
   - City carousel (rotating cities)
   - Tag carousel (rotating adjectives)
   - Animated counters (count up on scroll)
   - Logo carousel (seamless infinite scroll)
   - Fade-in on scroll
   - Mobile navigation
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on links
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // City Carousel (Hero Section)
    // ============================================
    const cityCarousel = document.getElementById('city-carousel');

    if (cityCarousel) {
        const cities = cityCarousel.querySelectorAll('.city-item');
        let currentCityIndex = 0;

        function rotateCities() {
            // Fade out current
            cities[currentCityIndex].classList.remove('active');

            // Move to next city (loop back to start)
            currentCityIndex = (currentCityIndex + 1) % cities.length;

            // Fade in next
            cities[currentCityIndex].classList.add('active');
        }

        // Rotate every 2.5 seconds
        setInterval(rotateCities, 2500);
    }

    // ============================================
    // Tag Carousel (Hero Section)
    // ============================================
    const tagCarousel = document.getElementById('tag-carousel');

    if (tagCarousel) {
        const tags = tagCarousel.querySelectorAll('.tag-item');
        let currentTagIndex = 0;

        function rotateTags() {
            // Fade out current
            tags[currentTagIndex].classList.remove('active');

            // Move to next tag (loop back to start)
            currentTagIndex = (currentTagIndex + 1) % tags.length;

            // Fade in next
            tags[currentTagIndex].classList.add('active');
        }

        // Rotate every 2 seconds
        setInterval(rotateTags, 2000);
    }

    // ============================================
    // Animated Counter (Count Up on Scroll)
    // ============================================
    function animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 2000; // 2 seconds
        const isDecimal = target % 1 !== 0;

        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(function() {
            start += increment;

            if (start >= target) {
                start = target;
                clearInterval(timer);
            }

            let displayValue = isDecimal ? start.toFixed(1) : Math.floor(start);

            // Add commas for thousands
            if (!isDecimal && start >= 1000) {
                displayValue = displayValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            element.textContent = prefix + displayValue + suffix;
        }, 16);
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all metric numbers
    document.querySelectorAll('.metric-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ============================================
    // Fade-in on Scroll Animation
    // ============================================
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        fadeInObserver.observe(element);
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Waitlist Form Handler
    // ============================================
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('#email-input');
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
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';

            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                showFormMessage('Thank you! We\'ll notify you when we relaunch.', 'success');
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Optional: Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'engagement',
                        'event_label': email
                    });
                }

                console.log('Email submitted:', email);
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

    // ============================================
    // Logo Carousel (Infinite Scroll)
    // ============================================
    // The CSS animation handles the scrolling,
    // but we can add pause on hover functionality
    const logoCarousel = document.getElementById('logo-carousel');

    if (logoCarousel) {
        const logoTrack = logoCarousel.querySelector('.logo-track');

        logoCarousel.addEventListener('mouseenter', function() {
            logoTrack.style.animationPlayState = 'paused';
        });

        logoCarousel.addEventListener('mouseleave', function() {
            logoTrack.style.animationPlayState = 'running';
        });
    }

    // ============================================
    // Accessibility: Focus Trap for Mobile Menu
    // ============================================
    if (navLinks) {
        navLinks.addEventListener('keydown', function(e) {
            if (!navLinks.classList.contains('active')) return;

            if (e.key === 'Escape') {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Performance: Lazy Load Images
    // ============================================
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

    // ============================================
    // Console Easter Egg
    // ============================================
    console.log('%c👋 Hello Developer!', 'font-size: 24px; font-weight: bold; color: #ffcc00;');
    console.log('%cInterested in our mission?', 'font-size: 16px; color: #025ad3;');
    console.log('%cEmail: ceo@studentunion.im', 'font-size: 14px; color: #232323;');

    // ============================================
    // Performance Monitoring (Optional)
    // ============================================
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint (LCP)
        try {
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

            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP not supported
        }

        // Monitor First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'FID', {
                            event_category: 'Performance',
                            value: Math.round(entry.processingStart - entry.startTime),
                            event_label: 'First Input Delay'
                        });
                    }
                });
            });

            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // FID not supported
        }
    }

    // ============================================
    // Gallery Carousel - Seamless Infinite Scroll (CSS Animation)
    // ============================================
    // No JavaScript needed - using pure CSS animation
    // Pause on hover is handled by CSS :hover pseudo-class

    // ============================================
    // Waitlist Modal Handler
    // ============================================
    const openModalBtn = document.getElementById('open-waitlist-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('waitlist-modal');
    const modalForm = document.getElementById('waitlist-modal-form');
    const modalFormMessage = document.getElementById('modal-form-message');

    // Open modal
    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus first input
            const firstInput = modalForm.querySelector('input[type="email"]');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        });
    }

    // Close modal function
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';

            // Reset form message
            if (modalFormMessage) {
                modalFormMessage.style.display = 'none';
                modalFormMessage.className = 'form-message';
            }
        }
    }

    // Close on close button click
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click (outside modal content)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Modal form submission
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('#modal-email');
            const userTypeInputs = this.querySelectorAll('input[name="userType"]');
            const additionalInfoInput = this.querySelector('#modal-info');
            const submitButton = this.querySelector('button[type="submit"]');

            const email = emailInput.value.trim();
            let userType = '';

            // Get selected user type
            userTypeInputs.forEach(input => {
                if (input.checked) {
                    userType = input.value;
                }
            });

            const additionalInfo = additionalInfoInput.value.trim();

            // Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showModalMessage('Please enter a valid email address', 'error');
                return;
            }

            if (!userType) {
                showModalMessage('Please select whether you are a student or business', 'error');
                return;
            }

            // Disable submit button
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';

            // Google Forms integration
            // Replace FORM_ID with your actual Google Form ID
            // Replace entry IDs with your actual form field IDs
            const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/FORM_ID_PLACEHOLDER/formResponse';

            // Create form data for Google Forms
            const formData = new FormData();
            formData.append('entry.EMAIL_ENTRY_ID_PLACEHOLDER', email); // Email field
            formData.append('entry.USERTYPE_ENTRY_ID_PLACEHOLDER', userType); // User type (student/business)
            if (additionalInfo) {
                formData.append('entry.ADDITIONAL_INFO_ENTRY_ID_PLACEHOLDER', additionalInfo); // Optional info
            }

            // Submit to Google Forms
            fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Forms
                body: formData
            }).then(function() {
                // Success (no-cors means we can't read response, but submission works)
                showModalMessage('🎉 You\'re on the list! We\'ll notify you when we relaunch.', 'success');

                // Reset form
                modalForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'engagement',
                        'event_label': userType,
                        'value': email
                    });
                }

                console.log('Waitlist submitted to Google Forms');

                // Close modal after 2 seconds
                setTimeout(closeModal, 2000);
            }).catch(function(error) {
                // Error handling
                console.error('Form submission error:', error);
                showModalMessage('Something went wrong. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }

    function showModalMessage(message, type) {
        if (modalFormMessage) {
            modalFormMessage.textContent = message;
            modalFormMessage.className = 'form-message ' + type;
            modalFormMessage.style.display = 'block';

            // Hide error messages after 5 seconds, but keep success messages visible
            if (type === 'error') {
                setTimeout(function() {
                    modalFormMessage.style.display = 'none';
                }, 5000);
            }
        }
    }

    // ============================================
    // Initialize on Page Load
    // ============================================
    window.addEventListener('load', function() {
        // Trigger any initial animations here if needed
        console.log('StudentUnion.im loaded successfully!');
    });

})();
