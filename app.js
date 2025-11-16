// ====================================
// ANIM'CONNECT - Application SPA
// ====================================

// État global de l'application
const AppState = {
    categories: null,
    projets: null,
    personas: {},
    currentRoute: 'home',
    currentTheme: localStorage.getItem('theme') || 'blue',
    chatHistory: [],
    currentProjet: null,
    currentPersona: null,
    currentDemoType: null
};

// ====================================
// INITIALISATION
// ====================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initRouter();
    initNavigation();
    applyTheme(AppState.currentTheme);
});

// ====================================
// CHARGEMENT DES DONNÉES
// ====================================

async function loadData() {
    try {
        // Charger les catégories
        const categoriesRes = await fetch('data/categories.json');
        AppState.categories = await categoriesRes.json();

        // Charger les projets
        const projetsRes = await fetch('data/projets.json');
        AppState.projets = await projetsRes.json();

        // Charger les personas
        const personaIds = [
            'animateur-ludique',
            'pedagogue-patient',
            'conteur-imaginatif',
            'comedien-expressif',
            'meneur-charismatique',
            'artiste-inspire'
        ];

        for (const id of personaIds) {
            const res = await fetch(`data/personas/${id}.json`);
            AppState.personas[id] = await res.json();
        }

        console.log('Données chargées avec succès');
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// ====================================
// SYSTÈME DE ROUTING
// ====================================

function initRouter() {
    // Écouter les changements d'URL
    window.addEventListener('hashchange', handleRoute);

    // Charger la route initiale
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [route, ...params] = hash.split('/');

    AppState.currentRoute = route;
    updateActiveNav(route);

    // Router vers la bonne page
    switch (route) {
        case 'home':
            renderHome();
            break;
        case 'centre':
            renderCentre();
            break;
        case 'projets':
            renderProjets();
            break;
        case 'parametres':
            renderParametres();
            break;
        case 'fiche':
            renderFiche(params[0]);
            break;
        case 'demo-select':
            renderDemoSelect(params[0]);
            break;
        case 'demo-chat':
            renderDemoChat(params[0], params[1], params[2]);
            break;
        default:
            renderHome();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function navigateTo(route) {
    window.location.hash = route;
}

// ====================================
// NAVIGATION
// ====================================

function initNavigation() {
    // Ajouter les événements de clic aux items de navigation
    document.querySelectorAll('[data-route]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = item.getAttribute('data-route');
            navigateTo(route);
        });
    });
}

function updateActiveNav(currentRoute) {
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-route') === currentRoute) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ====================================
// PAGE: HOME
// ====================================

function renderHome() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">🎨 Anim'Connect</h1>
                <p class="hero-subtitle">Votre plateforme d'animation interactive avec intelligence artificielle</p>
                <p class="hero-description">
                    Découvrez des projets d'animation innovants et vivez-les à travers des expériences
                    interactives guidées par des personas IA uniques.
                </p>
                <div class="hero-cta">
                    <button class="btn btn-primary" onclick="navigateTo('projets')">
                        Explorer les Projets
                    </button>
                    <button class="btn btn-secondary" onclick="navigateTo('centre')">
                        En savoir plus
                    </button>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="section-title">Catégories de Projets</h2>
                <div class="categories-grid" id="homeCategoriesGrid"></div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container">
                <h2 class="section-title">Comment ça fonctionne ?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📁</div>
                        <h3>1. Choisissez un Projet</h3>
                        <p>Parcourez nos catégories et sélectionnez un projet qui vous intéresse</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎭</div>
                        <h3>2. Sélectionnez un Persona</h3>
                        <p>Choisissez le guide IA qui correspond à votre style d'apprentissage</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💬</div>
                        <h3>3. Vivez l'Expérience</h3>
                        <p>Interagissez avec votre persona et explorez le projet de manière immersive</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Charger les catégories
    renderHomeCategories();
}

function renderHomeCategories() {
    const grid = document.getElementById('homeCategoriesGrid');
    if (!grid || !AppState.categories) return;

    grid.innerHTML = AppState.categories.categories.map(cat => `
        <div class="category-card" onclick="navigateTo('projets')">
            <div class="category-icon">${cat.icone}</div>
            <h3 class="category-name">${cat.nom}</h3>
            <p class="category-desc">${cat.description}</p>
            <span class="category-count">${cat.sousCategories.length} sous-catégories</span>
        </div>
    `).join('');
}

// ====================================
// PAGE: CENTRE
// ====================================

function renderCentre() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <section class="section">
            <div class="container">
                <h1 class="page-title">📚 Centre d'Information</h1>
                <p class="page-subtitle">Tout ce que vous devez savoir sur Anim'Connect</p>

                <div class="info-section">
                    <h2>🎯 Notre Mission</h2>
                    <p>
                        Anim'Connect révolutionne l'animation et l'apprentissage en combinant des projets
                        d'animation éprouvés avec l'intelligence artificielle. Nous offrons une plateforme
                        interactive où chaque utilisateur peut explorer, apprendre et personnaliser des
                        activités selon ses besoins.
                    </p>
                </div>

                <div class="info-section">
                    <h2>🎭 Les Personas IA</h2>
                    <p>
                        Nos personas sont des guides intelligents, chacun avec sa propre personnalité et
                        expertise. Ils transforment la découverte de projets en expérience interactive et
                        personnalisée.
                    </p>
                    <div class="personas-grid" id="centrePersonasGrid"></div>
                </div>

                <div class="info-section">
                    <h2>📋 La Méthode SPAADRAFRA</h2>
                    <p>
                        Chaque projet est structuré selon la méthode SPAADRAFRA, un cadre complet pour
                        concevoir et animer des activités de qualité :
                    </p>
                    <ul class="spaadrafra-list">
                        <li><strong>Situation</strong> : Le contexte de l'activité</li>
                        <li><strong>Public</strong> : À qui s'adresse le projet</li>
                        <li><strong>Animation</strong> : Comment mener l'activité</li>
                        <li><strong>Attentes</strong> : Les objectifs et bénéfices</li>
                        <li><strong>Déroulement</strong> : Les étapes détaillées</li>
                        <li><strong>Ressources</strong> : Le matériel nécessaire</li>
                        <li><strong>Adaptation</strong> : Les possibilités de variation</li>
                        <li><strong>Finalité</strong> : Les objectifs pédagogiques</li>
                        <li><strong>Retour et Analyse</strong> : L'évaluation de l'activité</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h2>🎮 Types de Démo Interactive</h2>
                    <p>Pour chaque projet, vous pouvez choisir parmi 6 types d'expériences :</p>
                    <div class="demo-types-grid">
                        <div class="demo-type-card">
                            <h4>📄 Rappel Complet</h4>
                            <p>Révision détaillée de toute la fiche du projet</p>
                        </div>
                        <div class="demo-type-card">
                            <h4>🔍 En Savoir Plus</h4>
                            <p>Informations approfondies au-delà de la fiche</p>
                        </div>
                        <div class="demo-type-card">
                            <h4>📖 Histoire</h4>
                            <p>Vivre le projet comme un récit captivant</p>
                        </div>
                        <div class="demo-type-card">
                            <h4>🎲 Histoire Interactive</h4>
                            <p>Faire des choix et influencer le déroulement</p>
                        </div>
                        <div class="demo-type-card">
                            <h4>🔄 Variante</h4>
                            <p>Proposer une autre version du projet</p>
                        </div>
                        <div class="demo-type-card">
                            <h4>✨ Personnalisé</h4>
                            <p>Créer une version sur mesure</p>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h2>💡 Comment Utiliser la Plateforme</h2>
                    <ol class="usage-steps">
                        <li>Parcourez les catégories et sous-catégories de projets</li>
                        <li>Consultez la fiche SPAADRAFRA complète de chaque projet</li>
                        <li>Lancez une démo interactive en choisissant votre persona</li>
                        <li>Sélectionnez le type d'expérience que vous souhaitez vivre</li>
                        <li>Dialoguez avec le persona pour explorer le projet</li>
                        <li>Personnalisez les projets selon vos besoins</li>
                    </ol>
                </div>
            </div>
        </section>
    `;

    renderCentrePersonas();
}

function renderCentrePersonas() {
    const grid = document.getElementById('centrePersonasGrid');
    if (!grid) return;

    const personasArray = Object.values(AppState.personas);

    grid.innerHTML = personasArray.map(persona => `
        <div class="persona-card">
            <div class="persona-avatar">${persona.avatar}</div>
            <h3 class="persona-name">${persona.nom}</h3>
            <p class="persona-desc">${persona.description}</p>
        </div>
    `).join('');
}

// ====================================
// PAGE: PROJETS
// ====================================

function renderProjets() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <section class="section">
            <div class="container">
                <h1 class="page-title">📁 Catalogue de Projets</h1>
                <p class="page-subtitle">Explorez nos projets par catégories et sous-catégories</p>

                <div id="projetsContent"></div>
            </div>
        </section>
    `;

    renderProjetsContent();
}

function renderProjetsContent() {
    const container = document.getElementById('projetsContent');
    if (!container || !AppState.categories) return;

    let html = '';

    AppState.categories.categories.forEach(categorie => {
        html += `
            <div class="category-section">
                <h2 class="category-title">${categorie.icone} ${categorie.nom}</h2>
                <p class="category-description">${categorie.description}</p>

                <div class="subcategories-grid">
        `;

        categorie.sousCategories.forEach(sousCat => {
            const projets = AppState.projets.projets.filter(
                p => p.sousCategorie === sousCat.id
            );

            html += `
                <div class="subcategory-card">
                    <h3 class="subcategory-name">${sousCat.nom}</h3>
                    <p class="subcategory-desc">${sousCat.description}</p>
                    <div class="projets-list">
            `;

            if (projets.length > 0) {
                projets.forEach(projet => {
                    html += `
                        <div class="projet-item">
                            <h4 class="projet-name">${projet.nom}</h4>
                            <p class="projet-short-desc">${projet.description}</p>
                            <div class="projet-meta">
                                <span>⏱️ ${projet.duree}</span>
                                <span>👥 ${projet.nbParticipants}</span>
                            </div>
                            <div class="projet-actions">
                                <button class="btn btn-sm btn-secondary" onclick="navigateTo('fiche/${projet.id}')">
                                    📄 Fiche
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="navigateTo('demo-select/${projet.id}')">
                                    🎮 Démo
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="no-projets">Projets à venir...</p>';
            }

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ====================================
// PAGE: PARAMÈTRES
// ====================================

function renderParametres() {
    const content = document.getElementById('app-content');

    const themes = [
        { id: 'blue', nom: 'Bleu', color: '#3b82f6' },
        { id: 'purple', nom: 'Violet', color: '#a855f7' },
        { id: 'green', nom: 'Vert', color: '#10b981' },
        { id: 'orange', nom: 'Orange', color: '#f97316' },
        { id: 'pink', nom: 'Rose', color: '#ec4899' },
        { id: 'teal', nom: 'Turquoise', color: '#14b8a6' }
    ];

    content.innerHTML = `
        <section class="section">
            <div class="container">
                <h1 class="page-title">⚙️ Paramètres</h1>
                <p class="page-subtitle">Personnalisez votre expérience</p>

                <div class="settings-section">
                    <h2>🎨 Thème de Couleur</h2>
                    <p>Choisissez la couleur dominante de l'interface</p>

                    <div class="themes-grid">
                        ${themes.map(theme => `
                            <div class="theme-option ${AppState.currentTheme === theme.id ? 'active' : ''}"
                                 onclick="changeTheme('${theme.id}')">
                                <div class="theme-color" style="background-color: ${theme.color}"></div>
                                <span class="theme-name">${theme.nom}</span>
                                ${AppState.currentTheme === theme.id ? '<span class="theme-check">✓</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}

// ====================================
// PAGE: FICHE PROJET
// ====================================

function renderFiche(projetId) {
    const projet = AppState.projets.projets.find(p => p.id === projetId);

    if (!projet) {
        renderNotFound();
        return;
    }

    const content = document.getElementById('app-content');
    const spaadrafra = projet.spaadrafra;

    content.innerHTML = `
        <section class="section">
            <div class="container">
                <button class="btn btn-secondary mb-2" onclick="navigateTo('projets')">
                    ← Retour aux projets
                </button>

                <div class="fiche-header">
                    <h1 class="fiche-title">${projet.nom}</h1>
                    <p class="fiche-description">${projet.description}</p>
                    <div class="fiche-meta">
                        <span class="meta-badge">⏱️ ${projet.duree}</span>
                        <span class="meta-badge">👥 ${projet.nbParticipants}</span>
                    </div>
                </div>

                <div class="spaadrafra-card">
                    <h2 class="spaadrafra-title">📋 Fiche SPAADRAFRA</h2>

                    <div class="spaadrafra-item">
                        <h3>📍 Situation</h3>
                        <p>${spaadrafra.situation}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>👥 Public</h3>
                        <p>${spaadrafra.public}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>🎬 Animation</h3>
                        <p>${spaadrafra.animation}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>🎯 Attentes</h3>
                        <p>${spaadrafra.attentes}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>📝 Déroulement</h3>
                        <p style="white-space: pre-line;">${spaadrafra.deroulement}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>🛠️ Ressources</h3>
                        <p>${spaadrafra.ressources}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>🔄 Adaptation</h3>
                        <p>${spaadrafra.adaptation}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>🎓 Finalité</h3>
                        <p>${spaadrafra.finalite}</p>
                    </div>

                    <div class="spaadrafra-item">
                        <h3>📊 Retour et Analyse</h3>
                        <p>${spaadrafra.retourAnalyse}</p>
                    </div>
                </div>

                <div class="fiche-actions">
                    <button class="btn btn-primary btn-lg" onclick="navigateTo('demo-select/${projet.id}')">
                        🎮 Lancer une Démo Interactive
                    </button>
                </div>
            </div>
        </section>
    `;
}

// ====================================
// PAGE: SÉLECTION DÉMO
// ====================================

function renderDemoSelect(projetId) {
    const projet = AppState.projets.projets.find(p => p.id === projetId);

    if (!projet) {
        renderNotFound();
        return;
    }

    const content = document.getElementById('app-content');

    const demoTypes = [
        { id: 'rappel', nom: 'Rappel Complet', icon: '📄', desc: 'Rappel complet de la fiche SPAADRAFRA' },
        { id: 'approfondir', nom: 'En Savoir Plus', icon: '🔍', desc: 'Informations approfondies au-delà de la fiche' },
        { id: 'histoire', nom: 'Vivre comme une Histoire', icon: '📖', desc: 'Expérience narrative immersive' },
        { id: 'interactif', nom: 'Histoire Interactive', icon: '🎲', desc: 'Faire vos propres choix dans l\'histoire' },
        { id: 'variante', nom: 'Proposer une Variante', icon: '🔄', desc: 'Créer une autre version du projet' },
        { id: 'personnalise', nom: 'Version Personnalisée', icon: '✨', desc: 'Co-créer une version sur mesure' }
    ];

    // Filtrer les personas compatibles
    const personasCompatibles = projet.personasCompatibles.map(id => AppState.personas[id]).filter(Boolean);

    content.innerHTML = `
        <section class="section">
            <div class="container">
                <button class="btn btn-secondary mb-2" onclick="navigateTo('fiche/${projet.id}')">
                    ← Retour à la fiche
                </button>

                <h1 class="page-title">🎮 Configuration de la Démo</h1>
                <h2 class="demo-projet-name">${projet.nom}</h2>

                <div class="demo-select-section">
                    <h3 class="demo-section-title">1️⃣ Choisissez votre Persona</h3>
                    <div class="personas-select-grid" id="personasSelectGrid">
                        ${personasCompatibles.map(persona => `
                            <div class="persona-select-card" data-persona="${persona.id}">
                                <div class="persona-avatar-large">${persona.avatar}</div>
                                <h4 class="persona-select-name">${persona.nom}</h4>
                                <p class="persona-select-desc">${persona.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="demo-select-section">
                    <h3 class="demo-section-title">2️⃣ Choisissez le Type de Démo</h3>
                    <div class="demo-types-select-grid" id="demoTypesSelectGrid">
                        ${demoTypes.map(type => `
                            <div class="demo-type-select-card" data-type="${type.id}">
                                <div class="demo-type-icon">${type.icon}</div>
                                <h4 class="demo-type-name">${type.nom}</h4>
                                <p class="demo-type-desc">${type.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="demo-select-actions">
                    <button class="btn btn-primary btn-lg" id="startDemoBtn" disabled>
                        🚀 Démarrer la Démo
                    </button>
                </div>
            </div>
        </section>
    `;

    // Ajouter les événements de sélection
    initDemoSelection(projetId);
}

function initDemoSelection(projetId) {
    let selectedPersona = null;
    let selectedType = null;

    // Sélection du persona
    document.querySelectorAll('.persona-select-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.persona-select-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPersona = card.getAttribute('data-persona');
            updateStartButton();
        });
    });

    // Sélection du type de démo
    document.querySelectorAll('.demo-type-select-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.demo-type-select-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedType = card.getAttribute('data-type');
            updateStartButton();
        });
    });

    function updateStartButton() {
        const btn = document.getElementById('startDemoBtn');
        if (selectedPersona && selectedType) {
            btn.disabled = false;
            btn.onclick = () => navigateTo(`demo-chat/${projetId}/${selectedPersona}/${selectedType}`);
        } else {
            btn.disabled = true;
        }
    }
}

// ====================================
// PAGE: CHAT DÉMO
// ====================================

function renderDemoChat(projetId, personaId, demoType) {
    const projet = AppState.projets.projets.find(p => p.id === projetId);
    const persona = AppState.personas[personaId];

    if (!projet || !persona) {
        renderNotFound();
        return;
    }

    AppState.currentProjet = projet;
    AppState.currentPersona = persona;
    AppState.currentDemoType = demoType;
    AppState.chatHistory = [];

    const content = document.getElementById('app-content');

    content.innerHTML = `
        <section class="chat-section">
            <div class="chat-container">
                <div class="chat-header">
                    <button class="btn-back" onclick="navigateTo('demo-select/${projetId}')">←</button>
                    <div class="chat-header-info">
                        <div class="chat-persona-avatar">${persona.avatar}</div>
                        <div>
                            <h3 class="chat-persona-name">${persona.nom}</h3>
                            <p class="chat-projet-name">${projet.nom}</p>
                        </div>
                    </div>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be added here -->
                </div>

                <div class="chat-input-container">
                    <input type="text"
                           class="chat-input"
                           id="chatInput"
                           placeholder="Écrivez votre message..."
                           onkeypress="handleChatKeyPress(event)">
                    <button class="btn-send" onclick="sendMessage()">
                        Envoyer
                    </button>
                </div>
            </div>
        </section>
    `;

    // Ajouter le message d'accueil du persona
    setTimeout(() => {
        addMessageToChat(persona.phraseAccueil, 'persona');
        addMessageToChat(generateInitialMessage(), 'persona');
    }, 300);
}

function generateInitialMessage() {
    const persona = AppState.currentPersona;
    const projet = AppState.currentProjet;
    const demoType = AppState.currentDemoType;

    const demoTypeNames = {
        'rappel': 'un rappel complet de la fiche',
        'approfondir': 'approfondir le projet',
        'histoire': 'vivre le projet comme une histoire',
        'interactif': 'une histoire interactive',
        'variante': 'explorer des variantes',
        'personnalise': 'créer une version personnalisée'
    };

    return `Nous allons explorer "${projet.nom}" ensemble ! Tu as choisi ${demoTypeNames[demoType]}. Je suis là pour te guider. Par quoi veux-tu commencer ?`;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Ajouter le message de l'utilisateur
    addMessageToChat(message, 'user');
    input.value = '';

    // Simuler une réponse du persona (dans une vraie app, ça serait un appel API)
    setTimeout(() => {
        const response = generatePersonaResponse(message);
        addMessageToChat(response, 'persona');
    }, 500);
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    if (sender === 'persona') {
        messageDiv.innerHTML = `
            <div class="message-avatar">${AppState.currentPersona.avatar}</div>
            <div class="message-content">${message}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    AppState.chatHistory.push({ sender, message });
}

function generatePersonaResponse(userMessage) {
    // Simulation simple de réponse
    // Dans une vraie application, ceci ferait appel à une API IA

    const persona = AppState.currentPersona;
    const projet = AppState.currentProjet;
    const demoType = AppState.currentDemoType;

    // Exemples de réponses basées sur le persona
    const responses = {
        'animateur-ludique': [
            `Super question ! ${userMessage} C'est exactement le genre de chose qui rend "${projet.nom}" si génial ! 🎯`,
            `J'adore ton enthousiasme ! Laisse-moi te parler de ça plus en détail... ✨`,
            `Excellente observation ! Dans ce projet, on va explorer ça ensemble ! 🚀`
        ],
        'pedagogue-patient': [
            `Bonne question. Prenons le temps d'explorer cela étape par étape. 📚`,
            `Je vois ce qui t'intéresse. Commençons par les bases... 🔍`,
            `C'est une question pertinente. Voici comment on peut l'aborder... 📖`
        ],
        'conteur-imaginatif': [
            `Ah, laisse-moi te conter cette partie de l'histoire... 📖`,
            `Imagine un instant cette scène... ${userMessage} ✨`,
            `Il était une fois, dans "${projet.nom}"... 🌟`
        ],
        'comedien-expressif': [
            `*fait un geste théâtral* OH ! Excellente question ! 🎭`,
            `*avec emphase* Laisse-moi te montrer ça de manière SPECTACULAIRE ! ✨`,
            `*chuchote dramatiquement* Tu veux savoir un secret sur ce projet ? 🎪`
        ],
        'meneur-charismatique': [
            `Bonne question, aventurier. Voici ce que tu dois savoir... ⚔️`,
            `À toi de réfléchir : que ferais-tu dans cette situation ? 🎯`,
            `Excellent. Tu commences à comprendre les enjeux. 🛡️`
        ],
        'artiste-inspire': [
            `Quelle belle question... Laisse-moi t'inspirer avec cette réponse... 🎨`,
            `Je ressens que tu cherches à explorer... C'est magnifique ! ✨`,
            `Créons ensemble cette vision... ${userMessage} 🌈`
        ]
    };

    const personaResponses = responses[persona.id] || responses['animateur-ludique'];
    const randomResponse = personaResponses[Math.floor(Math.random() * personaResponses.length)];

    return randomResponse;
}

// ====================================
// GESTION DES THÈMES
// ====================================

function changeTheme(themeId) {
    AppState.currentTheme = themeId;
    localStorage.setItem('theme', themeId);
    applyTheme(themeId);
    renderParametres(); // Re-render pour mettre à jour la sélection
}

function applyTheme(themeId) {
    const themes = {
        'blue': '#3b82f6',
        'purple': '#a855f7',
        'green': '#10b981',
        'orange': '#f97316',
        'pink': '#ec4899',
        'teal': '#14b8a6'
    };

    const color = themes[themeId] || themes['blue'];
    document.documentElement.style.setProperty('--primary-color', color);
}

// ====================================
// UTILITAIRES
// ====================================

function renderNotFound() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <section class="section">
            <div class="container">
                <div class="not-found">
                    <h1>404</h1>
                    <p>Page non trouvée</p>
                    <button class="btn btn-primary" onclick="navigateTo('home')">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </section>
    `;
}
