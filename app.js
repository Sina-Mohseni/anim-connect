// ==========================================
// ANIM'CONNECT - Application SPA
// ==========================================

// …tat global de l'application
const AppState = {
    categories: [],
    projects: [],
    personas: {},
    demoTypes: [],
    currentPage: 'home',
    currentProject: null,
    currentPersona: null,
    currentDemoType: null,
    chatMessages: [],
    settings: {
        primaryColor: localStorage.getItem('primaryColor') || '#00d4ff'
    }
};

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initNavigation();
    applyTheme();
    navigateTo('home');
});

// ==========================================
// CHARGEMENT DES DONN…ES
// ==========================================
async function loadData() {
    try {
        // Charger les catÈgories
        const categoriesResponse = await fetch('data/categories.json');
        const categoriesData = await categoriesResponse.json();
        AppState.categories = categoriesData.categories;

        // Charger les projets
        const projectsResponse = await fetch('data/projects.json');
        const projectsData = await projectsResponse.json();
        AppState.projects = projectsData.projects;

        // Charger les types de dÈmo
        const demoTypesResponse = await fetch('data/demo-types.json');
        const demoTypesData = await demoTypesResponse.json();
        AppState.demoTypes = demoTypesData.demoTypes;

        // Charger tous les personas
        const personaIds = [
            'strategiste', 'conteur', 'guide', 'explorateur', 'mysterieux',
            'educateur', 'enthousiaste', 'artiste', 'scientifique', 'aventurier', 'createur'
        ];

        for (const id of personaIds) {
            const response = await fetch(`data/personas/${id}.json`);
            AppState.personas[id] = await response.json();
        }

    } catch (error) {
        console.error('Erreur lors du chargement des donnÈes:', error);
    }
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    // Navigation par boutons de menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Navigation par logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => navigateTo('home'));
    }
}

function navigateTo(page, params = {}) {
    AppState.currentPage = page;

    // Mettre ‡ jour l'Ètat actif du menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Rendre la page appropriÈe
    const app = document.getElementById('app');

    switch(page) {
        case 'home':
            app.innerHTML = renderHomePage();
            break;
        case 'centre':
            app.innerHTML = renderCentrePage();
            break;
        case 'projets':
            app.innerHTML = renderProjetsPage();
            break;
        case 'parametres':
            app.innerHTML = renderParametresPage();
            initParametresHandlers();
            break;
        case 'fiche':
            app.innerHTML = renderFichePage(params.projectId);
            initFicheHandlers();
            break;
        case 'demo':
            app.innerHTML = renderDemoPage(params.projectId);
            initDemoHandlers(params.projectId);
            break;
        case 'chat':
            app.innerHTML = renderChatPage();
            initChatHandlers();
            break;
        default:
            app.innerHTML = renderHomePage();
    }

    // Scroll en haut de la page
    window.scrollTo(0, 0);
}

// ==========================================
// RENDU DES PAGES
// ==========================================

// PAGE HOME
function renderHomePage() {
    return `
        <div class="home-page fade-in">
            <div class="hero-section">
                <h1 class="hero-title">Anim'Connect</h1>
                <p class="hero-subtitle">Explorez un univers de jeux, d'activitÈs et d'aventures interactives</p>
            </div>

            <div class="categories-grid">
                ${AppState.categories.map(cat => `
                    <div class="category-card" onclick="navigateTo('projets')">
                        <div class="category-icon">${cat.icon}</div>
                        <h3 class="category-name">${cat.name}</h3>
                        <p class="category-description">${cat.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// PAGE PROJETS
function renderProjetsPage() {
    let html = '<div class="projets-page"><h1 class="page-title">Tous nos Projets</h1>';

    AppState.categories.forEach(category => {
        const categoryProjects = AppState.projects.filter(p => p.categoryId === category.id);

        if (categoryProjects.length > 0) {
            html += `
                <div class="category-section">
                    <div class="section-header">
                        <span class="section-icon">${category.icon}</span>
                        <h2 class="section-title">${category.name}</h2>
                    </div>
                    <div class="subcategories">
            `;

            category.subcategories.forEach(subcat => {
                const subcatProjects = categoryProjects.filter(p => p.subcategoryId === subcat.id);

                if (subcatProjects.length > 0) {
                    html += `
                        <div class="subcategory">
                            <h3 class="subcategory-title">${subcat.name}</h3>
                            <div class="projects-grid">
                                ${subcatProjects.map(project => `
                                    <div class="project-card">
                                        <img src="${project.image}" alt="${project.title}" class="project-image">
                                        <div class="project-content">
                                            <h4 class="project-title">${project.title}</h4>
                                            <p class="project-description">${project.shortDescription}</p>
                                            <div class="project-actions">
                                                <button class="btn" onclick="navigateTo('fiche', {projectId: '${project.id}'})">
                                                    =À Fiche
                                                </button>
                                                <button class="btn btn-primary" onclick="navigateTo('demo', {projectId: '${project.id}'})">
                                                    <Æ DÈmo
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            });

            html += '</div></div>';
        }
    });

    html += '</div>';
    return html;
}

// PAGE FICHE
function renderFichePage(projectId) {
    const project = AppState.projects.find(p => p.id === projectId);
    if (!project) return '<div class="error">Projet non trouvÈ</div>';

    const fiche = project.fiche;

    return `
        <div class="fiche-page">
            <button class="back-button" onclick="navigateTo('projets')">
                ê Retour aux projets
            </button>

            <div class="fiche-header">
                <h1 class="fiche-titre">${fiche.titre}</h1>
                <p class="fiche-sous-titre">${fiche.sousTitre}</p>
            </div>

            <div class="fiche-section">
                <h3>=÷ PrÈsentation</h3>
                <p>${fiche.presentation}</p>
            </div>

            <div class="fiche-section">
                <h3>=  Informations</h3>
                <div class="fiche-meta">
                    <div class="meta-item">
                        <div class="meta-label">¬ge</div>
                        <div class="meta-value">${fiche.age}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Joueurs</div>
                        <div class="meta-value">${fiche.joueurs}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">DurÈe</div>
                        <div class="meta-value">${fiche.duree}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">DifficultÈ</div>
                        <div class="meta-value">${fiche.difficulte}</div>
                    </div>
                </div>
            </div>

            <div class="fiche-section">
                <h3>=‹ RËgles</h3>
                <p>${fiche.regle}</p>
            </div>

            <div class="fiche-section">
                <h3>=° Apports</h3>
                <ul>
                    ${fiche.apports.map(apport => `<li>${apport}</li>`).join('')}
                </ul>
            </div>

            <div class="fiche-section">
                <h3>=≈ FrÈquence</h3>
                <p>${fiche.frequence}</p>
            </div>

            <div class="fiche-section">
                <h3>=≠ Remarques</h3>
                <p>${fiche.remarques}</p>
            </div>

            <div class="fiche-section">
                <h3> Auteur</h3>
                <p>${fiche.auteur}</p>
            </div>

            <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; margin-top: 2rem;" onclick="navigateTo('demo', {projectId: '${projectId}'})">
                <Æ Lancer une DÈmo Interactive
            </button>
        </div>
    `;
}

// PAGE DEMO (sÈlection persona et type)
function renderDemoPage(projectId) {
    const project = AppState.projects.find(p => p.id === projectId);
    if (!project) return '<div class="error">Projet non trouvÈ</div>';

    return `
        <div class="demo-page">
            <button class="back-button" onclick="navigateTo('fiche', {projectId: '${projectId}'})">
                ê Retour ‡ la fiche
            </button>

            <h1 class="page-title">Configurer votre DÈmo</h1>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 2rem;">
                Projet : <strong style="color: var(--primary-color);">${project.title}</strong>
            </p>

            <div class="demo-selection">
                <div class="selection-section">
                    <h2 class="selection-title">1. Choisissez votre Persona</h2>
                    <div class="personas-grid" id="personas-grid">
                        ${Object.values(AppState.personas).map(persona => `
                            <div class="persona-card" data-persona-id="${persona.id}">
                                <div class="persona-avatar">${persona.avatar}</div>
                                <div class="persona-name">${persona.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="selection-section">
                    <h2 class="selection-title">2. Choisissez le Type de DÈmo</h2>
                    <div class="demo-types-grid" id="demo-types-grid">
                        ${AppState.demoTypes.map(type => `
                            <div class="demo-type-card" data-type-id="${type.id}">
                                <div class="demo-type-header">
                                    <span class="demo-type-icon">${type.icon}</span>
                                    <span class="demo-type-name">${type.name}</span>
                                </div>
                                <p class="demo-type-description">${type.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="start-demo-button" id="start-demo-btn" disabled>
                    DÈmarrer la DÈmo
                </button>
            </div>
        </div>
    `;
}

// PAGE CHAT
function renderChatPage() {
    const project = AppState.currentProject;
    const persona = AppState.currentPersona;
    const demoType = AppState.currentDemoType;

    return `
        <div class="chat-page">
            <div class="chat-header">
                <button class="back-button" onclick="navigateTo('demo', {projectId: '${project.id}'})">
                    ê Retour
                </button>
                <div class="chat-persona-info">
                    <div class="chat-persona-avatar" style="border-color: ${persona.color};">
                        ${persona.avatar}
                    </div>
                    <div class="chat-persona-details">
                        <h3>${persona.name}</h3>
                        <p>${project.title} - ${demoType.name}</p>
                    </div>
                </div>
            </div>

            <div class="chat-messages" id="chat-messages">
                <!-- Les messages seront ajoutÈs ici dynamiquement -->
            </div>

            <div class="chat-input-area">
                <textarea
                    class="chat-input"
                    id="chat-input"
                    placeholder="Tapez votre message..."
                    rows="1"
                ></textarea>
                <button class="send-button" id="send-button">
                    Envoyer
                </button>
            </div>
        </div>
    `;
}

// PAGE CENTRE
function renderCentrePage() {
    return `
        <div class="centre-page fade-in">
            <h1 class="page-title">Centre d'Information</h1>

            <div class="info-card">
                <h2>¿ propos d'Anim'Connect</h2>
                <p>
                    Anim'Connect est une plateforme interactive dÈdiÈe ‡ l'animation ludique et crÈative.
                    Nous proposons une large gamme de jeux, activitÈs, ateliers et contenus crÈatifs pour tous les ‚ges.
                </p>

                <h3>Notre Mission</h3>
                <p>
                    Rendre l'animation accessible, interactive et passionnante gr‚ce ‡ des outils modernes
                    et des expÈriences personnalisÈes avec nos personas IA.
                </p>

                <h3>Nos CatÈgories</h3>
                <ul>
                    <li><strong>Jeux de sociÈtÈ</strong> : Des jeux de plateau, de cartes et de stratÈgie</li>
                    <li><strong>ActivitÈs</strong> : ActivitÈs artistiques, sportives et Èducatives</li>
                    <li><strong>Jeux de RÙles</strong> : Aventures immersives dans divers univers</li>
                    <li><strong>Ateliers</strong> : Formations et crÈations collectives</li>
                    <li><strong>ScËnes</strong> : Contenus multimÈdias (histoires, vidÈos, musiques, audios)</li>
                </ul>
            </div>

            <div class="info-card">
                <h2>Comment utiliser le site ?</h2>

                <h3>1. Explorer les Projets</h3>
                <p>
                    Parcourez nos projets classÈs par catÈgories et sous-catÈgories.
                    Chaque projet dispose d'une fiche complËte (SPAADRAFRA) dÈtaillant toutes les informations.
                </p>

                <h3>2. Consulter les Fiches</h3>
                <p>
                    Cliquez sur "Fiche" pour accÈder aux dÈtails complets : rËgles, durÈe, ‚ge, apports pÈdagogiques, etc.
                </p>

                <h3>3. Lancer une DÈmo Interactive</h3>
                <p>
                    Choisissez un persona IA qui vous guidera selon sa personnalitÈ unique.
                    SÈlectionnez ensuite le type de dÈmo souhaitÈ parmi 6 options diffÈrentes.
                </p>

                <h3>4. Interagir avec les Personas</h3>
                <p>
                    Nos 11 personas ont chacun leur style : Le StratËge, Le Conteur, Le Guide,
                    L'Explorateur, Le MystÈrieux, L'…ducateur, L'Enthousiaste, L'Artiste,
                    Le Scientifique, L'Aventurier et Le CrÈateur.
                </p>
            </div>

            <div class="info-card">
                <h2>Les Types de DÈmo</h2>
                <ul>
                    <li><strong>Rappel complet</strong> : RÈsumÈ structurÈ de la fiche</li>
                    <li><strong>En savoir plus</strong> : Informations supplÈmentaires au-del‡ de la fiche</li>
                    <li><strong>Histoire</strong> : Vivre le projet comme un rÈcit narratif</li>
                    <li><strong>Histoire interactive</strong> : Participer avec vos propres choix</li>
                    <li><strong>Variante</strong> : Explorer d'autres versions du projet</li>
                    <li><strong>PersonnalisÈ</strong> : CrÈer votre version sur mesure</li>
                </ul>
            </div>

            <div class="info-card">
                <h2>Personnalisation</h2>
                <p>
                    Rendez-vous dans les ParamËtres pour personnaliser l'apparence du site
                    en choisissant votre couleur dominante prÈfÈrÈe.
                </p>
            </div>
        </div>
    `;
}

// PAGE PARAM»TRES
function renderParametresPage() {
    const colorPresets = [
        { name: 'Cyan', color: '#00d4ff', dark: '#0099cc', light: '#33ddff' },
        { name: 'Violet', color: '#a855f7', dark: '#7c3aed', light: '#c084fc' },
        { name: 'Vert', color: '#10b981', dark: '#059669', light: '#34d399' },
        { name: 'Rose', color: '#ec4899', dark: '#db2777', light: '#f472b6' },
        { name: 'Orange', color: '#f59e0b', dark: '#d97706', light: '#fbbf24' },
        { name: 'Rouge', color: '#ef4444', dark: '#dc2626', light: '#f87171' },
        { name: 'Bleu', color: '#3b82f6', dark: '#2563eb', light: '#60a5fa' },
        { name: 'Jaune', color: '#eab308', dark: '#ca8a04', light: '#facc15' }
    ];

    return `
        <div class="parametres-page fade-in">
            <h1 class="page-title">ParamËtres</h1>

            <div class="settings-section">
                <h2>Couleur Dominante</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                    Choisissez la couleur principale du site selon vos prÈfÈrences
                </p>

                <div class="color-presets">
                    ${colorPresets.map(preset => `
                        <div class="color-preset ${preset.color === AppState.settings.primaryColor ? 'active' : ''}"
                             data-color="${preset.color}"
                             data-dark="${preset.dark}"
                             data-light="${preset.light}">
                            <div class="color-circle" style="background: ${preset.color};"></div>
                            <div class="color-name">${preset.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="settings-section">
                <h2>¿ propos</h2>
                <p style="color: var(--text-secondary);">
                    Anim'Connect - Version 2.0<br>
                    Plateforme interactive d'animation ludique<br>
                    © 2024 Tous droits rÈservÈs
                </p>
            </div>
        </div>
    `;
}

// ==========================================
// GESTIONNAIRES D'…V…NEMENTS
// ==========================================

function initFicheHandlers() {
    // DÈj‡ gÈrÈ par onclick dans le HTML
}

function initDemoHandlers(projectId) {
    const project = AppState.projects.find(p => p.id === projectId);
    const startBtn = document.getElementById('start-demo-btn');

    let selectedPersona = null;
    let selectedDemoType = null;

    // Gestion de la sÈlection des personas
    document.querySelectorAll('.persona-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.persona-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPersona = card.dataset.personaId;
            updateStartButton();
        });
    });

    // Gestion de la sÈlection du type de dÈmo
    document.querySelectorAll('.demo-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.demo-type-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedDemoType = card.dataset.typeId;
            updateStartButton();
        });
    });

    function updateStartButton() {
        if (selectedPersona && selectedDemoType) {
            startBtn.disabled = false;
            startBtn.onclick = () => startDemo(projectId, selectedPersona, selectedDemoType);
        }
    }
}

function startDemo(projectId, personaId, demoTypeId) {
    AppState.currentProject = AppState.projects.find(p => p.id === projectId);
    AppState.currentPersona = AppState.personas[personaId];
    AppState.currentDemoType = AppState.demoTypes.find(t => t.id === demoTypeId);
    AppState.chatMessages = [];

    navigateTo('chat');
}

function initChatHandlers() {
    const messagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Afficher le message de bienvenue du persona
    const greeting = AppState.currentPersona.greeting[AppState.currentDemoType.id];
    addMessage('persona', greeting);

    // Gestion de l'envoi de messages
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('user', message);
            chatInput.value = '';
            chatInput.style.height = 'auto';

            // Simuler une rÈponse du persona (dÈlai pour effet rÈaliste)
            setTimeout(() => {
                const response = generatePersonaResponse(message);
                addMessage('persona', response);
            }, 1000 + Math.random() * 1000);
        }
    };

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize du textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });
}

function addMessage(type, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    const avatar = type === 'user' ? '=d' : AppState.currentPersona.avatar;

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-bubble">${text}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    AppState.chatMessages.push({ type, text, timestamp: Date.now() });
}

function generatePersonaResponse(userMessage) {
    // Simulation simplifiÈe de rÈponse IA basÈe sur le persona et le projet
    const persona = AppState.currentPersona;
    const project = AppState.currentProject;
    const demoType = AppState.currentDemoType;

    // RÈponses contextuelles basÈes sur les mots-clÈs
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('rËgle') || lowerMessage.includes('comment')) {
        return `${persona.name === 'Le Guide' ? 'Avec plaisir !' : 'Bien s˚r !'} Les rËgles de ${project.title} sont : ${project.fiche.regle}`;
    }

    if (lowerMessage.includes('durÈe') || lowerMessage.includes('temps')) {
        return `La durÈe de ${project.title} est de ${project.fiche.duree}. ${persona.name === 'L\'Enthousiaste' ? 'C\'est parfait pour passer un bon moment !' : 'C\'est une durÈe idÈale pour ce type d\'activitÈ.'}`;
    }

    if (lowerMessage.includes('joueur')) {
        return `${project.title} se joue ‡ ${project.fiche.joueurs}. ${persona.name === 'Le StratËge' ? 'Un nombre optimal pour une bonne dynamique de jeu.' : ''}`;
    }

    if (lowerMessage.includes('merci')) {
        return `${persona.name === 'L\'Enthousiaste' ? 'De rien ! C\'est un plaisir !' : 'Je vous en prie ! N\'hÈsitez pas si vous avez d\'autres questions.'}`;
    }

    // RÈponses par dÈfaut selon le type de dÈmo
    if (demoType.id === 'recap') {
        return `Voici un ÈlÈment clÈ de ${project.title} : ${project.fiche.apports[0]}. ${persona.name === 'L\'…ducateur' ? 'C\'est un apport pÈdagogique important.' : ''}`;
    }

    if (demoType.id === 'story') {
        return `Laissez-moi vous raconter... ${project.fiche.presentation} ${persona.name === 'Le Conteur' ? 'Et ce n\'est que le dÈbut de l\'aventure !' : ''}`;
    }

    // RÈponse gÈnÈrique adaptÈe au persona
    const genericResponses = {
        'strategiste': `Analysons cela ensemble. Concernant ${project.title}, je dirais que c'est une excellente question qui mÈrite une rÈponse structurÈe.`,
        'conteur': `Ah, quelle merveilleuse question ! Laissez-moi vous conter comment ${project.title} peut transformer votre expÈrience...`,
        'guide': `Je vais vous aider avec Áa ! Pour ${project.title}, voici ce que je vous recommande de savoir...`,
        'explorateur': `Excellente curiositÈ ! Explorons ensemble les facettes de ${project.title} !`,
        'mysterieux': `IntÈressant... Vous touchez l‡ ‡ quelque chose d'important concernant ${project.title}...`,
        'educateur': `Bonne question ! Cela nous permet d'approfondir notre comprÈhension de ${project.title}.`,
        'enthousiaste': `Wow ! Super question ! ${project.title} est vraiment incroyable pour Áa !`,
        'artiste': `Quelle belle interrogation... ${project.title} est comme une Suvre d'art ‡ dÈcouvrir...`,
        'scientifique': `IntÈressant. Analysons factuellement les caractÈristiques de ${project.title}.`,
        'aventurier': `En avant ! DÈcouvrons ensemble les secrets de ${project.title} !`,
        'createur': `Bonne idÈe ! ${project.title} offre plein de possibilitÈs crÈatives ‡ explorer.`
    };

    return genericResponses[persona.id] || `Merci pour votre message ‡ propos de ${project.title}. Comment puis-je vous aider davantage ?`;
}

function initParametresHandlers() {
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            const dark = preset.dataset.dark;
            const light = preset.dataset.light;

            // Mettre ‡ jour les variables CSS
            document.documentElement.style.setProperty('--primary-color', color);
            document.documentElement.style.setProperty('--primary-dark', dark);
            document.documentElement.style.setProperty('--primary-light', light);

            // Sauvegarder dans localStorage
            localStorage.setItem('primaryColor', color);
            localStorage.setItem('primaryDark', dark);
            localStorage.setItem('primaryLight', light);

            AppState.settings.primaryColor = color;

            // Mettre ‡ jour l'UI
            document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
}

// ==========================================
// TH»ME
// ==========================================
function applyTheme() {
    const primaryColor = localStorage.getItem('primaryColor');
    const primaryDark = localStorage.getItem('primaryDark');
    const primaryLight = localStorage.getItem('primaryLight');

    if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--primary-dark', primaryDark);
        document.documentElement.style.setProperty('--primary-light', primaryLight);
    }
}

// ==========================================
// EXPOSITION GLOBALE
// ==========================================
window.navigateTo = navigateTo;
window.AppState = AppState;
