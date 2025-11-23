// ============================================
// CONFIGURATION GLOBALE
// ============================================

const CONFIG = {
    // Chemins des données
    DATA_PATHS: {
        author: '/data/author.json',
        worlds: '/data/worlds.json',
        epochs: '/data/epochs.json',
        sagas: '/data/sagas.json',
        projects: '/data/projects.json'
    },

    // Chemins des personas
    PERSONAS_PATH: '/data/personas/',

    // Liste des fichiers personas
    PERSONAS_FILES: [
        'marcus-aventurier.json',
        'liora-mysterieuse.json',
        'kai-stratege.json',
        'nova-scientifique.json',
        'theo-conteur.json',
        'zara-artiste.json',
        'rex-guide.json',
        'elena-educatrice.json',
        'axel-explorateur.json',
        'maya-enthousiaste.json'
    ],

    // Configuration des animations
    ANIMATION: {
        fadeInDuration: 500,
        slideInDuration: 300,
        hoverDelay: 100
    },

    // Configuration du chat
    CHAT: {
        typingSpeed: 50,
        responseDelay: 1000
    },

    // Messages de bienvenue par défaut pour chaque persona
    PERSONA_GREETINGS: {
        'marcus-aventurier': "Salut ! Prêt pour l'aventure ? Je suis Marcus, et je vais te parler de ce projet d'action. Qu'est-ce que tu veux savoir ?",
        'liora-mysterieuse': "Bienvenue... Les mystères de ce projet sont nombreux. Je suis Liora, et je peux t'en révéler les secrets. Que cherches-tu ?",
        'kai-stratege': "Bonjour. Je suis Kai, et j'analyse les aspects stratégiques de ce projet. Comment puis-je t'aider à planifier ?",
        'nova-scientifique': "Salutations ! Je suis Nova. Les aspects scientifiques et techniques de ce projet sont fascinants. Que veux-tu découvrir ?",
        'theo-conteur': "Ah, bienvenue ami ! Je suis Théo, conteur d'histoires. Laisse-moi te narrer les merveilles de ce projet...",
        'zara-artiste': "Bonjour ! Zara à ton service. L'esthétique et l'ambiance de ce projet sont exceptionnelles. Parlons-en !",
        'rex-guide': "Bonjour voyageur ! Je suis Rex, ton guide. Je peux t'orienter dans tous les aspects de ce projet. Par où veux-tu commencer ?",
        'elena-educatrice': "Bonjour ! Je suis Elena. Ce projet recèle de nombreux enseignements. Que souhaites-tu apprendre ?",
        'axel-explorateur': "Hey ! Axel ici. Ce projet cache des trésors à explorer. Prêt pour la découverte ?",
        'maya-enthousiaste': "Coucou ! C'est Maya ! Je suis trop excitée de te parler de ce projet incroyable ! Qu'est-ce que tu veux savoir ?"
    }
};

// État global de l'application
const STATE = {
    currentPage: 'accueil',
    currentWorld: null,
    currentEpoch: null,
    currentSaga: null,
    currentProject: null,
    selectedOptions: {
        difficulty: 'normal',
        mode: 'coop',
        zone: 'piece'
    },
    data: {
        author: null,
        personas: [],
        worlds: [],
        epochs: [],
        sagas: [],
        projects: []
    },
    chat: {
        currentPersona: null,
        projectContext: null,
        messages: []
    }
};

// Utilitaires
const Utils = {
    // Charger un fichier JSON
    async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${path}:`, error);
            return null;
        }
    },

    // Formater le temps
    formatTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    },

    // Animer un compteur
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    },

    // Créer un élément avec classes et attributs
    createElement(tag, classes = [], attributes = {}, content = '') {
        const element = document.createElement(tag);
        if (classes.length) element.classList.add(...classes);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        if (content) element.textContent = content;
        return element;
    }
};
