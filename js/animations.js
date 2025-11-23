// ============================================
// ANIMATIONS ET EFFETS VISUELS
// ============================================

const Animations = {
    // Initialiser les animations
    init() {
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.animateOnScroll();
    },

    // Effets au scroll
    setupScrollEffects() {
        let lastScroll = 0;
        const header = document.querySelector('.main-header');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Animation du header
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll vers le bas
                if (header) {
                    header.style.transform = 'translateY(-100%)';
                }
            } else {
                // Scroll vers le haut
                if (header) {
                    header.style.transform = 'translateY(0)';
                }
            }

            lastScroll = currentScroll;
        });
    },

    // Effets au survol
    setupHoverEffects() {
        // Effet de parallaxe sur les cartes
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.card, .world-card, .epoch-card, .saga-card, .project-card, .persona-card');

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                // Appliquer l'effet seulement au survol
                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                } else {
                    card.style.transform = '';
                }
            });
        });
    },

    // Animer les éléments au scroll
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observer tous les éléments qui doivent être animés
        const observeElements = () => {
            const elements = document.querySelectorAll('.card, .world-card, .epoch-card, .saga-card, .project-card, .persona-card, .concept-card');

            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });
        };

        // Observer initialement et après chaque changement de page
        setTimeout(observeElements, 100);

        // Re-observer quand le contenu change
        const contentObserver = new MutationObserver(observeElements);
        const projectsContainer = document.getElementById('projects-container');
        const personasContainer = document.getElementById('personas-container');

        if (projectsContainer) {
            contentObserver.observe(projectsContainer, { childList: true, subtree: true });
        }

        if (personasContainer) {
            contentObserver.observe(personasContainer, { childList: true, subtree: true });
        }
    },

    // Effet de particules pour le fond (optionnel)
    createParticles() {
        const particleCount = 50;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'var(--neon-blue)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.opacity = Math.random();
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.zIndex = '0';
            particle.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out`;

            document.body.appendChild(particle);
            particles.push(particle);
        }

        // Ajouter l'animation CSS pour les particules
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                }
                50% {
                    transform: translateY(-10px) translateX(-10px);
                }
                75% {
                    transform: translateY(-30px) translateX(5px);
                }
            }
        `;
        document.head.appendChild(style);
    },

    // Animation de typing pour le texte
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    },

    // Effet de glitch sur le titre
    glitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';

        let iterations = 0;
        const maxIterations = 20;

        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');

            iterations += 1;

            if (iterations > maxIterations) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 30);
    },

    // Animer les compteurs
    animateCounters() {
        const counters = document.querySelectorAll('.stat-value');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            Utils.animateCounter(counter, target, 2000);
        });
    }
};
