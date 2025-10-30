// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Initialize EmailJS with your Public Key
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
emailjs.init('YOUR_PUBLIC_KEY'); // Get this from EmailJS dashboard

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    const getQuoteBtn = document.querySelector('.btn-primary');
    const servicesBtn = document.querySelector('.btn-secondary');
    
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (servicesBtn) {
        servicesBtn.addEventListener('click', () => {
            document.getElementById('services').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Simulate form submission (replace with actual form handling)
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Quote Form Handling
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const quoteData = {};
        formData.forEach((value, key) => {
            quoteData[key] = value;
        });
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            to_email: 'akhiljaz@gmail.com',
            from_name: quoteData.name,
            from_email: quoteData.email,
            company: quoteData.company || 'N/A',
            phone: quoteData.phone,
            service_type: quoteData.service,
            freight_type: quoteData['freight-type'],
            weight: quoteData.weight,
            dimensions: quoteData.dimensions || 'N/A',
            pickup_location: quoteData.pickup,
            delivery_location: quoteData.delivery,
            pickup_date: quoteData['pickup-date'],
            delivery_date: quoteData['delivery-date'] || 'Flexible',
            special_requirements: quoteData.special || 'None',
            insurance: quoteData.insurance ? 'Yes' : 'No',
            recurring: quoteData.recurring ? 'Yes' : 'No',
            subject: 'New Quote Request - Logium Transport Inc'
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            showNotification('Quote request sent successfully! We\'ll email you within 24 hours with a customized quote.', 'success');
            quoteForm.reset();
        }, function(error) {
            console.error('FAILED...', error);
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            showNotification('Failed to send quote request. Please try again or call us directly.', 'error');
        });
    });
    
    // Real-time validation for quote form
    const quoteInputs = quoteForm.querySelectorAll('input, select, textarea');
    quoteInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                const value = this.value.trim();
                if (!value) {
                    this.style.borderColor = '#ef4444';
                } else if (this.type === 'email' && !isValidEmail(value)) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '#10b981';
                }
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
        });
    });

    // Set minimum date for pickup date to today
    const pickupDateInput = document.getElementById('quote-pickup-date');
    if (pickupDateInput) {
        const today = new Date().toISOString().split('T')[0];
        pickupDateInput.setAttribute('min', today);
    }

    // Set minimum delivery date based on pickup date
    const deliveryDateInput = document.getElementById('quote-delivery-date');
    if (pickupDateInput && deliveryDateInput) {
        pickupDateInput.addEventListener('change', function() {
            deliveryDateInput.setAttribute('min', this.value);
            if (deliveryDateInput.value && deliveryDateInput.value < this.value) {
                deliveryDateInput.value = '';
            }
        });
    }
}

// Notification system
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
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Reset opacity for animated elements
    const animatedElements = document.querySelectorAll('.service-card, .fleet-card, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current + (element.dataset.suffix || '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const counter = entry.target.querySelector('h3');
            const text = counter.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            // Only animate if there's a valid number
            if (!isNaN(number) && number > 0) {
                const suffix = text.replace(/\d/g, '');
                counter.dataset.suffix = suffix;
                animateCounter(counter, number);
            }
            
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Fleet card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const fleetCards = document.querySelectorAll('.fleet-card');
    
    fleetCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
                img.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
});

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Remove previous error styling
        input.style.borderColor = '';
        
        if (!value) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced contact form with validation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
            this.reset();
        }, 2000);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                const value = this.value.trim();
                if (!value) {
                    this.style.borderColor = '#ef4444';
                } else if (this.type === 'email' && !isValidEmail(value)) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '#10b981';
                }
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElement = document.querySelector('.hero-image img');
    
    if (parallaxElement && scrolled < window.innerHeight) {
        const speed = scrolled * 0.5;
        parallaxElement.style.transform = `translateY(${speed}px)`;
    }
});

// Loading animation on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add loaded class styles
const loadedStyles = `
    .loaded .hero-title,
    .loaded .hero-subtitle,
    .loaded .hero-buttons {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = loadedStyles;
document.head.appendChild(styleSheet);