// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Animate bars
        const bars = mobileMenu.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (mobileMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translateY(6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translateY(-6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '1';
            }
        });
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = mobileMenu.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '1';
            });
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced navbar on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Add input animation effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simple validation
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

        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        setTimeout(() => {
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }, 2000);
    });
}

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
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.95rem;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 4000);
}

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.dataset.delay = index * 100;
        observer.observe(card);
    });

    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card-modern');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.dataset.delay = index * 100;
        observer.observe(card);
    });

    // Animate process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        step.dataset.delay = index * 150;
        observer.observe(step);
    });

    // Animate expertise items
    const expertiseItems = document.querySelectorAll('.expertise-item');
    expertiseItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.dataset.delay = index * 100;
        observer.observe(item);
    });

    // Animate value items
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.dataset.delay = index * 100;
        observer.observe(item);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isPercentage = target.toString().includes('%');
    const numericTarget = parseInt(target);

    const timer = setInterval(() => {
        start += increment;
        if (start >= numericTarget) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (isPercentage ? '%' : '+');
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const targetValue = statNumber.textContent;
                statNumber.dataset.animated = 'true';
                animateCounter(statNumber, targetValue);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add CSS for page load
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .nav-menu.active {
        display: flex;
        position: fixed;
        left: 0;
        top: 70px;
        width: 100%;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 2rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        gap: 1.5rem;
    }

    @media (min-width: 1025px) {
        .nav-menu.active {
            position: static;
            flex-direction: row;
            background: transparent;
            padding: 0;
            box-shadow: none;
        }
    }
`;
document.head.appendChild(style);

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0d4b76, #0ea5e9);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});
