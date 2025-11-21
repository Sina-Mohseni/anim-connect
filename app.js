// ==========================================
// HOURGLASS GATE - JavaScript Interactions
// ==========================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initCameraLog();
    initNavigation();
    initAnimations();
    initStatCounters();
    initFormHandler();
    initScrollEffects();
});

// ==========================================
// Particles Background
// ==========================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;
    const connectionDistance = 150;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00d9ff' : '#ffa500';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawConnections();

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==========================================
// Camera Log - Time & Date
// ==========================================
function initCameraLog() {
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    const fileElement = document.getElementById('fileNumber');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();

        dateElement.textContent = `${month}.${day}.${year}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Random file number updates
    setInterval(() => {
        const randomFile = Math.floor(Math.random() * 9999);
        fileElement.textContent = String(randomFile).padStart(4, '0') + '-B';
    }, 10000);
}

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// Scroll Animations
// ==========================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and timeline items
    const animatedElements = document.querySelectorAll('.portal-card, .timeline-item, .info-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================
// Stat Counters Animation
// ==========================================
function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    let animated = false;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.hero-stats'));

    function animateCounters() {
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

// ==========================================
// Portal Card Interactions
// ==========================================
const portalCards = document.querySelectorAll('.portal-card');

portalCards.forEach(card => {
    const button = card.querySelector('.card-button');

    button.addEventListener('click', function(e) {
        e.stopPropagation();

        const portalType = card.getAttribute('data-portal');

        // Create activation effect
        createActivationEffect(card);

        // Show activation message
        setTimeout(() => {
            showNotification(`Portail ${portalType.toUpperCase()} activé avec succès!`);
        }, 500);
    });

    // 3D tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function() {
        card.style.transform = '';
    });
});

// ==========================================
// Activation Effect
// ==========================================
function createActivationEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');

    ripple.style.position = 'fixed';
    ripple.style.left = rect.left + 'px';
    ripple.style.top = rect.top + 'px';
    ripple.style.width = rect.width + 'px';
    ripple.style.height = rect.height + 'px';
    ripple.style.border = '2px solid #00d9ff';
    ripple.style.borderRadius = '0';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.animation = 'pulse-border 0.6s ease-out';

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-border {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.1);
            opacity: 0;
        }
    }

    .notification {
        position: fixed;
        top: 120px;
        right: 20px;
        background: rgba(5, 8, 22, 0.95);
        border: 2px solid #00d9ff;
        padding: 20px 30px;
        color: #00d9ff;
        font-weight: bold;
        letter-spacing: 1px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 2.7s;
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Notification System
// ==========================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==========================================
// Form Handler
// ==========================================
function initFormHandler() {
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            console.log('Form submitted:', data);

            // Show success message
            showNotification('Transmission envoyée avec succès!');

            // Reset form
            form.reset();

            // Add glitch effect to form
            form.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                form.style.animation = '';
            }, 300);
        });
    }
}

// ==========================================
// Scroll Effects
// ==========================================
function initScrollEffects() {
    let lastScroll = 0;
    const nav = document.querySelector('.main-nav');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.boxShadow = '0 5px 30px rgba(0, 217, 255, 0.5)';
        } else {
            nav.style.boxShadow = '0 5px 30px rgba(0, 217, 255, 0.2)';
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// CTA Button Effect
// ==========================================
const ctaButton = document.querySelector('.cta-button');

if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        // Create expanding circle effect
        const circle = document.createElement('div');
        circle.style.position = 'fixed';
        circle.style.left = '50%';
        circle.style.top = '50%';
        circle.style.transform = 'translate(-50%, -50%)';
        circle.style.width = '0';
        circle.style.height = '0';
        circle.style.borderRadius = '50%';
        circle.style.background = 'rgba(0, 217, 255, 0.3)';
        circle.style.pointerEvents = 'none';
        circle.style.zIndex = '9999';
        circle.style.transition = 'all 0.6s ease-out';

        document.body.appendChild(circle);

        setTimeout(() => {
            circle.style.width = '2000px';
            circle.style.height = '2000px';
            circle.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            circle.remove();
        }, 600);

        // Show initialization message
        showNotification('Séquence d\'initialisation démarrée...');

        // Scroll to portals section
        setTimeout(() => {
            document.querySelector('#portals').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    });
}

// ==========================================
// Random Glitch Effect on Hero Title
// ==========================================
const heroTitle = document.querySelector('.hero-title');

if (heroTitle) {
    setInterval(() => {
        if (Math.random() > 0.7) {
            heroTitle.style.animation = 'none';
            setTimeout(() => {
                heroTitle.style.animation = 'glitch 3s infinite';
            }, 10);
        }
    }, 5000);
}

// ==========================================
// Keyboard Shortcuts
// ==========================================
document.addEventListener('keydown', function(e) {
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }

    // Press 'P' to go to portals
    if (e.key === 'p' || e.key === 'P') {
        document.querySelector('#portals').scrollIntoView({ behavior: 'smooth' });
    }

    // Press 'A' to go to archives
    if (e.key === 'a' || e.key === 'A') {
        document.querySelector('#archives').scrollIntoView({ behavior: 'smooth' });
    }

    // Press 'C' to go to contact
    if (e.key === 'c' || e.key === 'C') {
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c HOURGLASS GATE ', 'background: #00d9ff; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Bienvenue dans le portail temporel ', 'color: #00d9ff; font-size: 14px;');
console.log('%c Utilisez H, P, A, C pour naviguer ', 'color: #ffa500; font-size: 12px;');
