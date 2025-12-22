// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav') && !event.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial check
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animated Counter for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate stats
                if (entry.target.classList.contains('about-stats')) {
                    statNumbers.forEach(animateCounter);
                }
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-level')) {
                    const width = entry.target.getAttribute('data-level') + '%';
                    entry.target.style.width = width;
                }
                
                // Add animation class
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.about-stats, .skill-level').forEach(el => observer.observe(el));
    
    // Form submission handler
    const contactForm = document.getElementById('projectInquiryForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            const whatsappMessage = 
`*New Project Inquiry - Roman Gathoni Portfolio*

*Name:* ${data.name}
*Email:* ${data.email}
${data.phone ? `*Phone:* ${data.phone}\n` : ''}
*Project Type:* ${data.projectType}
*Project Scope:* ${data.projectScope}
*Budget Range:* ${data.budget}

*Project Details:*
${data.message}

---
This inquiry was sent via your portfolio contact form.`;

            // URL encode the message
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/254719879928?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
            
            // Show confirmation
            const originalButtonText = contactForm.querySelector('button[type="submit"]').innerHTML;
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            submitButton.innerHTML = '<i class="fas fa-check"></i> Redirecting to WhatsApp...';
            submitButton.disabled = true;
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 3000);
            
            // Optional: Track form submission
            console.log('Form submitted:', data);
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Kenyan phone numbers
            if (value.startsWith('0')) {
                value = value.substring(1);
            }
            
            // Add space after 3 digits
            if (value.length > 3) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            }
            
            // Add space after 6 digits
            if (value.length > 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }
            
            e.target.value = value.substring(0, 12); // Limit to 12 characters
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });
    
    // Set active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // Initialize skill bar animations
    document.querySelectorAll('.skill-level').forEach(bar => {
        bar.style.width = '0%';
    });
    
    // Add loading animation
    function initLoadingAnimations() {
        // Add fade-in animation to sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    initLoadingAnimations();
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        
        // Tab key navigation trap for mobile menu
        if (navList.classList.contains('active')) {
            const focusableElements = navList.querySelectorAll('a, button');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        }
    });
    
    // Initialize with first nav link active if at top of page
    if (window.scrollY < 100) {
        navLinks[0].classList.add('active');
    }
    
    // Add performance optimization
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Update any layout-dependent calculations here
        }, 250);
    });
});