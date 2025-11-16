// ===================================
// Single Page Application
// Anim'Connect
// ===================================

let aboutData = null;
let currentPage = 'home';

// ===================================
// Initialisation
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadData();
});

// ===================================
// Chargement des données
// ===================================
async function loadData() {
    try {
        const response = await fetch('about-data.json');
        aboutData = await response.json();

        // Charger les catégories sur la page d'accueil
        renderHomeCategories();
        renderActivitiesCategories();

        // Charger la page À propos
        renderAboutPage();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);

            // Fermer le menu mobile
            navMenu.classList.remove('active');
        });
    });
}

function navigateTo(page) {
    // Cacher toutes les vues
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    // Afficher la vue demandée
    const targetView = document.getElementById(`${page}-view`);
    if (targetView) {
        targetView.classList.add('active');
        currentPage = page;

        // Mettre à jour la navigation active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Scroll en haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showCategory(categoryId) {
    const category = aboutData.categories.find(c => c.id === categoryId);
    if (!category) return;

    const categoryDetail = document.getElementById('categoryDetail');
    categoryDetail.innerHTML = `
        <div class="category-header">
            <div class="category-header-icon">${category.icon}</div>
            <h2 class="section-title">${category.nom}</h2>
            <p class="category-description">${category.description}</p>
        </div>

        <button class="btn btn-secondary" onclick="navigateTo('activities')" style="margin-bottom: 2rem;">
            ← Retour aux catégories
        </button>

        <div class="projects-grid">
            ${category.projets.map(projet => `
                <div class="project-card">
                    <div class="project-header">
                        <h4 class="project-title">${projet.titre}</h4>
                        <span class="project-badge">${projet.public}</span>
                    </div>
                    <p class="project-description">${projet.description}</p>
                    <div class="project-duration">
                        <span>⏱️</span>
                        <span>${projet.duree}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    navigateTo('category');
}

// ===================================
// Rendu des catégories
// ===================================
function renderHomeCategories() {
    if (!aboutData) return;

    const container = document.getElementById('homeCategoriesGrid');
    container.innerHTML = aboutData.categories.map(cat => `
        <div class="category-card" onclick="showCategory('${cat.id}')">
            <div class="category-icon">${cat.icon}</div>
            <h3 class="category-name">${cat.nom}</h3>
        </div>
    `).join('');
}

function renderActivitiesCategories() {
    if (!aboutData) return;

    const container = document.getElementById('activitiesCategoriesGrid');
    container.innerHTML = aboutData.categories.map(cat => `
        <div class="category-card" onclick="showCategory('${cat.id}')">
            <div class="category-icon">${cat.icon}</div>
            <h3 class="category-name">${cat.nom}</h3>
        </div>
    `).join('');
}

// ===================================
// Rendu de la page À propos
// ===================================
function renderAboutPage() {
    if (!aboutData) return;

    const { auteur, presentation } = aboutData;

    // Auteur
    const authorCard = document.getElementById('authorCard');
    authorCard.innerHTML = `
        <div class="author-avatar">${auteur.photo}</div>
        <h3 class="author-name">${auteur.nom}</h3>
        <p class="author-bio">${auteur.bio}</p>
    `;

    // Personas
    const personasGrid = document.getElementById('personasGrid');
    personasGrid.innerHTML = auteur.personas.map(persona => `
        <div class="persona-card">
            <span class="persona-emoji">${persona.emoji}</span>
            <h4 class="persona-name">${persona.nom}</h4>
            <p class="persona-description">${persona.description}</p>
            <p class="persona-citation">"${persona.citation}"</p>
            <div class="persona-competences">
                ${persona.competences.map(comp => `
                    <span class="competence-tag">${comp}</span>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Présentation
    const presentationSection = document.getElementById('presentationSection');
    presentationSection.innerHTML = `
        <div class="section-header">
            <h2 class="section-title">${presentation.titre}</h2>
            <p class="section-subtitle" style="max-width: 900px;">${presentation.description}</p>
        </div>
    `;

    // Valeurs
    const valuesGrid = document.getElementById('valuesGrid');
    valuesGrid.innerHTML = presentation.valeurs.map(valeur => `
        <div class="value-card">
            <div class="value-icon">${valeur.icon}</div>
            <h4 class="value-title">${valeur.titre}</h4>
            <p class="value-description">${valeur.description}</p>
        </div>
    `).join('');
}
