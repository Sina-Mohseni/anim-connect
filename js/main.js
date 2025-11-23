// ============================================
// FICHIER PRINCIPAL - INITIALISATION
// ============================================

// Fonction d'initialisation principale
async function init() {
    try {
        console.log('🚀 Initialisation d\'Anim\'Connect...');

        // 1. Charger toutes les données
        await loadAllData();

        // 2. Initialiser la navigation
        Navigation.init();

        // 3. Initialiser les modals
        Modal.init();

        // 4. Initialiser les animations
        Animations.init();

        // 5. Afficher la page d'accueil
        Navigation.showPage('accueil');

        console.log('✅ Anim\'Connect initialisé avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Une erreur est survenue lors du chargement de l\'application.');
    }
}

// Charger toutes les données
async function loadAllData() {
    try {
        console.log('📦 Chargement des données...');

        // Charger les données en parallèle
        const [author, worlds, epochs, sagas, projects] = await Promise.all([
            Utils.loadJSON(CONFIG.DATA_PATHS.author),
            Utils.loadJSON(CONFIG.DATA_PATHS.worlds),
            Utils.loadJSON(CONFIG.DATA_PATHS.epochs),
            Utils.loadJSON(CONFIG.DATA_PATHS.sagas),
            Utils.loadJSON(CONFIG.DATA_PATHS.projects)
        ]);

        // Stocker dans l'état global
        STATE.data.author = author;
        STATE.data.worlds = worlds || [];
        STATE.data.epochs = epochs || [];
        STATE.data.sagas = sagas || [];
        STATE.data.projects = projects || [];

        // Charger les personas
        const personasPromises = CONFIG.PERSONAS_FILES.map(file =>
            Utils.loadJSON(CONFIG.PERSONAS_PATH + file)
        );
        STATE.data.personas = await Promise.all(personasPromises);

        console.log('✅ Données chargées:', {
            worlds: STATE.data.worlds.length,
            epochs: STATE.data.epochs.length,
            sagas: STATE.data.sagas.length,
            projects: STATE.data.projects.length,
            personas: STATE.data.personas.length
        });

    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        throw error;
    }
}

// Afficher une erreur
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-card);
        border: 2px solid var(--neon-pink);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        text-align: center;
        z-index: 10000;
        max-width: 500px;
    `;

    errorDiv.innerHTML = `
        <h2 style="color: var(--neon-pink); margin-bottom: var(--spacing-md);">
            ⚠️ Erreur
        </h2>
        <p style="color: var(--text-secondary);">
            ${message}
        </p>
        <button class="btn btn-primary" onclick="location.reload()" style="margin-top: var(--spacing-lg);">
            Recharger la page
        </button>
    `;

    document.body.appendChild(errorDiv);
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error);
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejetée:', event.reason);
});

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Message de bienvenue dans la console
console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║        ANIM'CONNECT                   ║
║    THE HOURGLASS PROJECT              ║
║                                       ║
║    Créé avec ❤️ par ELRAND AVICENNA  ║
║                                       ║
╚═══════════════════════════════════════╝
`);
