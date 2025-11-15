// ===================================
// État de l'application
// ===================================
let activites = [];
let filtresActifs = {
    public: [],
    categorie: [],
    structure: [],
    duree: []
};

// ===================================
// Initialisation
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    chargerActivites();
    initFiltres();
    initModal();
    initAnimations();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Menu mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navigation smooth scroll et active state
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Mettre à jour l'état actif
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Fermer le menu mobile
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Scroll effect pour la navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer pour l'état actif de navigation
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => navObserver.observe(section));
}

// ===================================
// Chargement des activités
// ===================================
async function chargerActivites() {
    try {
        const response = await fetch('activites.json');
        const data = await response.json();
        activites = data.activites;

        afficherActivites(activites);
        updateStatActivites();
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        afficherErreur();
    }
}

function afficherActivites(activitesAffichees) {
    const grid = document.getElementById('activitiesGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) return;

    if (activitesAffichees.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = activitesAffichees.map(activite => `
        <div class="activity-card fade-in-up" data-id="${activite.id}">
            <div class="activity-image">
                <span style="position: relative; z-index: 1;">${activite.icon}</span>
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <h3 class="activity-title">${activite.titre}</h3>
                    <p class="activity-description">${activite.description}</p>
                </div>
                <div class="activity-tags">
                    <span class="tag primary">${getCategorieNom(activite.categorie)}</span>
                    <span class="tag">${activite.dureeTexte}</span>
                    <span class="tag">${activite.participants} pers.</span>
                </div>
                <div class="activity-footer">
                    <div class="activity-info">
                        <span>👥 ${getPublicLabel(activite.public)}</span>
                    </div>
                    <div class="activity-cta">
                        <button class="btn-icon" onclick="ouvrirModal(${activite.id})" title="Voir les détails">
                            👁️
                        </button>
                        <button class="btn-icon" onclick="lancerAventure(${activite.id})" title="Vivre l'aventure">
                            🎮
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategorieNom(categorieId) {
    const categories = {
        'arts-plastiques': 'Arts Plastiques',
        'grands-jeux': 'Grands Jeux',
        'sportif': 'Sportif',
        'culturel': 'Culturel',
        'scientifique': 'Scientifique',
        'cuisine': 'Cuisine',
        'nature': 'Nature',
        'musique': 'Musique',
        'theatre': 'Théâtre',
        'jeux-societe': 'Jeux de Société'
    };
    return categories[categorieId] || categorieId;
}

function getPublicLabel(publics) {
    const labels = {
        'maternelle': 'Mat.',
        'elementaire': 'Élém.',
        'college': 'Collège',
        'lycee': 'Lycée',
        'adultes': 'Adultes'
    };
    return publics.map(p => labels[p] || p).join(', ');
}

function afficherErreur() {
    const grid = document.getElementById('activitiesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les activités. Veuillez réessayer.</p>
            </div>
        `;
    }
}

// ===================================
// Système de filtres
// ===================================
function initFiltres() {
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    const resetButton = document.getElementById('resetFilters');
    const checkboxes = document.querySelectorAll('.filter-checkbox');

    // Toggle du panneau de filtres
    if (filterToggle && filtersPanel) {
        filterToggle.addEventListener('click', () => {
            filtersPanel.classList.toggle('active');
        });
    }

    // Écouteurs sur les checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const type = e.target.name;
            const value = e.target.value;

            if (e.target.checked) {
                if (!filtresActifs[type].includes(value)) {
                    filtresActifs[type].push(value);
                }
            } else {
                filtresActifs[type] = filtresActifs[type].filter(v => v !== value);
            }

            appliquerFiltres();
            updateFilterCount();
        });
    });

    // Bouton de réinitialisation
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Décocher toutes les cases
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Réinitialiser les filtres
            filtresActifs = {
                public: [],
                categorie: [],
                structure: [],
                duree: []
            };

            appliquerFiltres();
            updateFilterCount();
        });
    }
}

function appliquerFiltres() {
    let activitesFiltrees = [...activites];

    // Appliquer chaque type de filtre
    Object.keys(filtresActifs).forEach(type => {
        if (filtresActifs[type].length > 0) {
            activitesFiltrees = activitesFiltrees.filter(activite => {
                // Pour les publics, vérifier si au moins un correspond
                if (type === 'public') {
                    return activite.public.some(p => filtresActifs[type].includes(p));
                }
                // Pour les autres, vérifier la correspondance directe
                else if (Array.isArray(activite[type])) {
                    return activite[type].some(item => filtresActifs[type].includes(item));
                } else {
                    return filtresActifs[type].includes(activite[type]);
                }
            });
        }
    });

    afficherActivites(activitesFiltrees);
}

function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    const total = Object.values(filtresActifs).reduce((sum, arr) => sum + arr.length, 0);

    if (filterCount) {
        if (total > 0) {
            filterCount.textContent = total;
            filterCount.style.display = 'inline-flex';
        } else {
            filterCount.style.display = 'none';
        }
    }
}

// ===================================
// Modal
// ===================================
function initModal() {
    const modal = document.getElementById('activityModal');
    const overlay = document.getElementById('modalOverlay');

    if (overlay) {
        overlay.addEventListener('click', fermerModal);
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            fermerModal();
        }
    });
}

function ouvrirModal(activiteId) {
    const activite = activites.find(a => a.id === activiteId);
    if (!activite) return;

    const modal = document.getElementById('activityModal');
    const modalContent = document.getElementById('modalContent');

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div class="modal-header">
            <div>
                <h2 class="modal-title">${activite.icon} ${activite.titre}</h2>
                <div class="activity-tags" style="margin-top: 1rem;">
                    <span class="tag primary">${getCategorieNom(activite.categorie)}</span>
                    <span class="tag">${activite.dureeTexte}</span>
                    <span class="tag">${activite.participants} participants</span>
                </div>
            </div>
            <button class="modal-close" onclick="fermerModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="modal-section">
                <h3>Description</h3>
                <p>${activite.description}</p>
            </div>

            <div class="modal-section">
                <h3>Public concerné</h3>
                <p>${activite.public.map(p => getPublicFullLabel(p)).join(', ')}</p>
            </div>

            <div class="modal-section">
                <h3>Objectifs pédagogiques</h3>
                <ul>
                    ${activite.objectifs.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>Matériel nécessaire</h3>
                <ul>
                    ${activite.materiel.map(mat => `<li>${mat}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>Déroulement</h3>
                <ul>
                    ${activite.deroulement.map(etape => `<li>${etape}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>Conseils pratiques</h3>
                <p>${activite.conseils}</p>
            </div>

            <div class="modal-section">
                <button class="btn btn-primary" onclick="lancerAventure(${activite.id}); fermerModal();">
                    🎮 Vivre cette activité en mode aventure
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fermerModal() {
    const modal = document.getElementById('activityModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function getPublicFullLabel(publicId) {
    const labels = {
        'maternelle': 'Maternelle (PS, MS, GS)',
        'elementaire': 'Élémentaire (CP-CM2)',
        'college': 'Collège',
        'lycee': 'Lycée',
        'adultes': 'Adultes'
    };
    return labels[publicId] || publicId;
}

// ===================================
// Système d'aventure IA
// ===================================
function lancerAventure(activiteId) {
    const activite = activites.find(a => a.id === activiteId);
    if (!activite || !activite.aventure) return;

    const adventureDemo = document.getElementById('adventureDemo');
    if (!adventureDemo) return;

    // Scroll vers la section aventure
    document.getElementById('aventure').scrollIntoView({ behavior: 'smooth' });

    // Afficher l'interface d'aventure
    setTimeout(() => {
        adventureDemo.innerHTML = `
            <div class="adventure-interface">
                <div class="adventure-header">
                    <h3>${activite.icon} ${activite.titre}</h3>
                    <button class="btn-icon" onclick="quitterAventure()">✕</button>
                </div>
                <div class="adventure-story" id="adventureStory">
                    <div class="story-message narrator">
                        <p>${activite.aventure.intro}</p>
                    </div>
                </div>
                <div class="adventure-choices" id="adventureChoices">
                    ${genererChoix(activite.aventure.scenarios[0])}
                </div>
                <div class="adventure-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 10%"></div>
                    </div>
                    <p class="progress-text">Étape 1/${activite.aventure.scenarios.length + 2}</p>
                </div>
            </div>
        `;

        // Stocker l'activité en cours
        window.currentAdventure = {
            activite: activite,
            etapeIndex: 0,
            choixFaits: []
        };
    }, 500);
}

function genererChoix(scenario) {
    if (!scenario || !scenario.choix) return '';

    return `
        <div class="story-question">
            <p>${scenario.texte}</p>
        </div>
        <div class="choices-list">
            ${scenario.choix.map((choix, index) => `
                <button class="choice-btn" onclick="fairechoix(${index}, '${choix}')">
                    ${choix}
                </button>
            `).join('')}
        </div>
    `;
}

function fairechoix(index, choixTexte) {
    if (!window.currentAdventure) return;

    const { activite, etapeIndex, choixFaits } = window.currentAdventure;
    choixFaits.push(choixTexte);

    const storyDiv = document.getElementById('adventureStory');
    const choicesDiv = document.getElementById('adventureChoices');

    // Afficher le choix du joueur
    storyDiv.innerHTML += `
        <div class="story-message player">
            <p><strong>Vous :</strong> ${choixTexte}</p>
        </div>
    `;

    // Générer la réponse en fonction du choix
    const reponse = genererReponse(activite, etapeIndex, index, choixTexte);

    setTimeout(() => {
        storyDiv.innerHTML += `
            <div class="story-message narrator">
                <p>${reponse}</p>
            </div>
        `;
        storyDiv.scrollTop = storyDiv.scrollHeight;

        // Passer à l'étape suivante ou terminer
        if (etapeIndex < activite.aventure.scenarios.length - 1) {
            window.currentAdventure.etapeIndex++;
            const nextScenario = activite.aventure.scenarios[window.currentAdventure.etapeIndex];
            choicesDiv.innerHTML = genererChoix(nextScenario);
            updateProgress();
        } else {
            // Terminer l'aventure
            setTimeout(() => {
                terminerAventure();
            }, 2000);
        }
    }, 1000);
}

function genererReponse(activite, etape, choixIndex, choixTexte) {
    // Réponses contextuelles basées sur l'activité
    const reponses = {
        'peinture': [
            "Excellent choix ! Tu prends tes pinceaux et commences à exprimer cette émotion à travers les couleurs...",
            "Les couleurs se mélangent sur ta palette, créant des nuances surprenantes...",
            "Ta création prend forme, racontant une histoire unique..."
        ],
        'chasse': [
            `Tu t'aventures sur ${choixTexte}. Le chemin révèle des indices mystérieux...`,
            "Ton équipe découvre une nouvelle énigme ! Il faut combiner vos talents pour la résoudre...",
            "Bravo ! Vous vous rapprochez du trésor..."
        ],
        'default': [
            `Avec ${choixTexte}, une nouvelle aventure commence...`,
            "Tu progresses dans l'activité, découvrant de nouvelles facettes...",
            "Cette expérience t'apprend de nouvelles compétences..."
        ]
    };

    const categorieKey = activite.categorie.includes('arts') ? 'peinture' :
                        activite.categorie.includes('jeux') ? 'chasse' : 'default';

    const reponsesCategorie = reponses[categorieKey] || reponses.default;
    return reponsesCategorie[etape % reponsesCategorie.length];
}

function terminerAventure() {
    const choicesDiv = document.getElementById('adventureChoices');
    const { activite, choixFaits } = window.currentAdventure;

    choicesDiv.innerHTML = `
        <div class="adventure-end">
            <h3>🎉 Aventure terminée !</h3>
            <p>Félicitations ! Tu as découvert l'activité "${activite.titre}" d'une manière immersive.</p>
            <p>Tu es maintenant prêt(e) à la mettre en pratique dans la vraie vie !</p>
            <div class="end-actions">
                <button class="btn btn-primary" onclick="ouvrirModal(${activite.id})">
                    📋 Voir la fiche complète
                </button>
                <button class="btn btn-secondary" onclick="quitterAventure()">
                    🔄 Choisir une autre activité
                </button>
            </div>
        </div>
    `;

    updateProgress(100);
}

function quitterAventure() {
    const adventureDemo = document.getElementById('adventureDemo');
    if (adventureDemo) {
        adventureDemo.innerHTML = `
            <div class="demo-placeholder">
                <p>Sélectionnez une activité dans la section ci-dessus pour démarrer votre aventure</p>
                <button class="btn btn-primary" onclick="document.getElementById('activites').scrollIntoView({behavior: 'smooth'})">
                    Choisir une activité
                </button>
            </div>
        `;
    }
    window.currentAdventure = null;
}

function updateProgress(percent = null) {
    if (!window.currentAdventure) return;

    const { activite, etapeIndex } = window.currentAdventure;
    const totalEtapes = activite.aventure.scenarios.length + 2;
    const progression = percent || ((etapeIndex + 2) / totalEtapes * 100);

    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
        progressFill.style.width = `${progression}%`;
    }

    if (progressText && !percent) {
        progressText.textContent = `Étape ${etapeIndex + 2}/${totalEtapes}`;
    }
}

// ===================================
// Statistiques
// ===================================
function updateStatActivites() {
    const statElement = document.getElementById('statActivites');
    if (statElement && activites.length > 0) {
        animateNumber(statElement, 0, activites.length, 1500);
    }
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===================================
// Animations au scroll
// ===================================
function initAnimations() {
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

    // Observer sera appliqué aux éléments au fur et à mesure de leur création
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// ===================================
// Styles additionnels pour l'aventure (injectés dynamiquement)
// ===================================
const adventureStyles = `
<style>
.adventure-interface {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.adventure-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.adventure-header h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
}

.adventure-story {
    background: var(--bg-tertiary);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    min-height: 300px;
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.story-message {
    padding: 1rem;
    border-radius: var(--radius-md);
    animation: fadeInUp 0.4s ease;
}

.story-message.narrator {
    background: var(--bg-secondary);
    border-left: 3px solid var(--accent-primary);
}

.story-message.player {
    background: var(--bg-hover);
    border-left: 3px solid var(--accent-tertiary);
    margin-left: 2rem;
}

.story-message p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.adventure-choices {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
}

.story-question {
    margin-bottom: 1rem;
}

.story-question p {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 1.1rem;
}

.choices-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.choice-btn {
    padding: 1rem 1.5rem;
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    text-align: left;
}

.choice-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
    transform: translateX(0.5rem);
}

.adventure-progress {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--gradient-primary);
    transition: width 0.5s ease;
}

.progress-text {
    color: var(--text-tertiary);
    font-size: 0.875rem;
    text-align: center;
}

.adventure-end {
    text-align: center;
    padding: 2rem;
}

.adventure-end h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.adventure-end p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.6;
}

.end-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .story-message.player {
        margin-left: 1rem;
    }

    .end-actions {
        flex-direction: column;
    }
}
</style>
`;

// Injecter les styles au chargement
if (!document.getElementById('adventure-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'adventure-styles';
    styleElement.innerHTML = adventureStyles;
    document.head.appendChild(styleElement);
}
