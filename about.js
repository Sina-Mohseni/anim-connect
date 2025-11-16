// ===================================
// Chargement des données À propos
// ===================================
let aboutData = null;

document.addEventListener('DOMContentLoaded', () => {
    chargerDonneesAbout();
    // Gérer l'ancre dans l'URL pour scroller vers une catégorie
    if (window.location.hash) {
        setTimeout(() => {
            const element = document.querySelector(window.location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});

async function chargerDonneesAbout() {
    try {
        const response = await fetch('about-data.json');
        aboutData = await response.json();

        afficherAuteur();
        afficherPresentation();
        afficherCategories();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        afficherErreur();
    }
}

// ===================================
// Section Auteur
// ===================================
function afficherAuteur() {
    const container = document.getElementById('authorContent');
    if (!container || !aboutData) return;

    const { auteur } = aboutData;

    container.innerHTML = `
        <div class="author-header">
            <div class="author-avatar">
                <span class="avatar-icon">${auteur.photo}</span>
            </div>
            <div class="author-info">
                <h2 class="author-name">${auteur.nom}</h2>
                <p class="author-bio">${auteur.bio}</p>
            </div>
        </div>

        <div class="personas-section">
            <h3 class="personas-title">Les Personas d'${auteur.nom.split(' ')[0]}</h3>
            <p class="personas-subtitle">Découvrez les différentes facettes et compétences qui composent l'univers d'Anim'Connect</p>

            <div class="personas-grid">
                ${auteur.personas.map(persona => `
                    <div class="persona-card">
                        <div class="persona-icon">${persona.icon}</div>
                        <h4 class="persona-name">${persona.nom}</h4>
                        <p class="persona-description">${persona.description}</p>
                        <div class="persona-competences">
                            ${persona.competences.map(comp => `
                                <span class="competence-tag">${comp}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===================================
// Section Présentation
// ===================================
function afficherPresentation() {
    const container = document.getElementById('presentationContent');
    if (!container || !aboutData) return;

    const { presentation } = aboutData;

    container.innerHTML = `
        <div class="presentation-main">
            <h2 class="presentation-title">${presentation.titre}</h2>
            <p class="presentation-description">${presentation.description}</p>
        </div>

        <div class="values-grid">
            ${presentation.valeurs.map(valeur => `
                <div class="value-card">
                    <div class="value-icon">${valeur.icon}</div>
                    <h3 class="value-title">${valeur.titre}</h3>
                    <p class="value-description">${valeur.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// ===================================
// Section Catégories
// ===================================
function afficherCategories() {
    const container = document.getElementById('categoriesContent');
    if (!container || !aboutData) return;

    const { categories } = aboutData;

    container.innerHTML = categories.map(categorie => `
        <div class="category-section" id="${categorie.id}">
            <div class="category-header">
                <div class="category-header-content">
                    <div class="category-icon-large">${categorie.icon}</div>
                    <div>
                        <h3 class="category-title">${categorie.nom}</h3>
                        <p class="category-description">${categorie.description}</p>
                    </div>
                </div>
            </div>

            <div class="projects-grid">
                ${categorie.projets.map(projet => `
                    <div class="project-card">
                        <div class="project-header">
                            <h4 class="project-title">${projet.titre}</h4>
                            <span class="project-public-badge">${projet.public}</span>
                        </div>
                        <p class="project-description">${projet.description}</p>
                        <div class="project-footer">
                            <span class="project-duration">
                                <span class="duration-icon">⏱️</span>
                                ${projet.duree}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===================================
// Gestion des erreurs
// ===================================
function afficherErreur() {
    const containers = [
        document.getElementById('authorContent'),
        document.getElementById('presentationContent'),
        document.getElementById('categoriesContent')
    ];

    const messageErreur = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les données. Veuillez réessayer.</p>
        </div>
    `;

    containers.forEach(container => {
        if (container) {
            container.innerHTML = messageErreur;
        }
    });
}
