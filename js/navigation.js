// ============================================
// NAVIGATION ENTRE PAGES
// ============================================

const Navigation = {
    // Initialiser la navigation
    init() {
        this.setupLogoClick();
        this.setupNavButtons();
        this.showPage('accueil');
    },

    // Configurer le clic sur le logo
    setupLogoClick() {
        const logo = document.querySelector('.logo-container');
        if (logo) {
            logo.addEventListener('click', () => {
                this.showPage('accueil');
                this.updateActiveButton(null);
            });
        }
    },

    // Configurer les boutons de navigation
    setupNavButtons() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = button.getAttribute('data-page');
                this.showPage(page);
                this.updateActiveButton(button);
            });
        });
    },

    // Afficher une page
    showPage(pageName) {
        // Cacher toutes les pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Afficher la page demandée
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
            STATE.currentPage = pageName;

            // Charger le contenu de la page si nécessaire
            this.loadPageContent(pageName);
        }
    },

    // Mettre à jour le bouton actif
    updateActiveButton(activeButton) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
        if (activeButton) {
            activeButton.classList.add('active');
        }
    },

    // Charger le contenu d'une page
    loadPageContent(pageName) {
        switch(pageName) {
            case 'accueil':
                this.loadHomePage();
                break;
            case 'personas':
                Personas.load();
                break;
            case 'projets':
                Projects.loadWorlds();
                break;
        }
    },

    // Charger la page d'accueil
    loadHomePage() {
        // Animer les statistiques
        if (STATE.data.worlds.length > 0) {
            const statWorlds = document.getElementById('stat-worlds');
            const statEpochs = document.getElementById('stat-epochs');
            const statProjects = document.getElementById('stat-projects');

            if (statWorlds) Utils.animateCounter(statWorlds, STATE.data.worlds.length);
            if (statEpochs) Utils.animateCounter(statEpochs, STATE.data.epochs.length);
            if (statProjects) Utils.animateCounter(statProjects, STATE.data.projects.length);
        }
    }
};
