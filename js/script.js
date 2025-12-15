// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Enhanced navbar background on scroll with smooth transition
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        navbar.style.padding = '0.8rem 0';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        navbar.style.padding = '1.2rem 0';
    }

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Enhanced contact form handling with better UX
const contactForm = document.getElementById('contactForm');

// Add input animation effects
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Simple validation with better feedback
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission with enhanced animation
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    submitButton.style.transform = 'scale(0.95)';

    // Simulate API call delay
    setTimeout(() => {
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.transform = 'scale(1)';

        // Add success animation to form
        contactForm.style.animation = 'successPulse 0.6s ease';
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 600);
    }, 2000);
});

// Custom notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.2rem 1.8rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 4000);
}

// Enhanced scroll animations with stagger effect
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add stagger delay based on position
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animated');
            }, delay);

            // Unobserve after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and feature items with stagger effect
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .expertise-item');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        el.dataset.delay = index * 100; // Stagger delay
        observer.observe(el);
    });

    // Add scroll-triggered animations for section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(header);
    });
});

// Enhanced mouse tracking for interactive effects
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .feature-item, .expertise-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Enhanced parallax effect for multiple elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const heroCircles = document.querySelectorAll('.hero-circle');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }

    // Parallax for background circles
    heroCircles.forEach((circle, index) => {
        const speed = 0.1 + (index * 0.05);
        circle.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed * 0.5}px)`;
    });

    // Subtle parallax for floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const speed = 0.05 + (index * 0.01);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.6s ease;
    }

    body.loaded {
        opacity: 1;
    }

    .service-card,
    .feature-item,
    .expertise-item {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes successPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }

    /* Scroll progress bar */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #0d4b76, #0a3d5f, #0d4b76);
        background-size: 200% auto;
        z-index: 10001;
        transition: width 0.1s ease;
        animation: gradientMove 3s linear infinite;
    }

    @keyframes gradientMove {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 200% 50%;
        }
    }
`;
document.head.appendChild(style);

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

