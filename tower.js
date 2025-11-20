// ==========================================
// ANIM'CONNECT - HOURGLASS TOWER
// Application SPA
// ==========================================

// État global de l'application
const TowerState = {
    worlds: [],
    sagas: [],
    currentPage: 'tower',
    currentWorld: null,
    currentSaga: null
};

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initNavigation();
    navigateTo('tower');
});

// ==========================================
// CHARGEMENT DES DONNÉES
// ==========================================
async function loadData() {
    try {
        // Charger les mondes
        const worldsResponse = await fetch('data/worlds.json');
        const worldsData = await worldsResponse.json();
        TowerState.worlds = worldsData.worlds;

        // Charger les sagas
        const sagasResponse = await fetch('data/sagas.json');
        const sagasData = await sagasResponse.json();
        TowerState.sagas = sagasData.sagas;

        console.log('Données chargées avec succès');
        console.log('Mondes:', TowerState.worlds.length);
        console.log('Sagas:', TowerState.sagas.length);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
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

    // Navigation par logo (retour à la tour)
    const logo = document.getElementById('logo-home');
    if (logo) {
        logo.addEventListener('click', () => navigateTo('tower'));
    }
}

function navigateTo(page, params = {}) {
    TowerState.currentPage = page;

    // Mettre à jour l'état actif du menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Rendre la page appropriée
    const app = document.getElementById('app');

    switch(page) {
        case 'tower':
            app.innerHTML = renderTowerPage();
            initTowerHandlers();
            break;
        case 'worlds':
            app.innerHTML = renderWorldsPage();
            initWorldsHandlers();
            break;
        case 'sagas':
            app.innerHTML = renderSagasPage();
            initSagasHandlers();
            break;
        case 'about':
            app.innerHTML = renderAboutPage();
            break;
        case 'world-detail':
            app.innerHTML = renderWorldDetailPage(params.worldId);
            initWorldDetailHandlers();
            break;
        case 'saga-detail':
            app.innerHTML = renderSagaDetailPage(params.sagaId);
            initSagaDetailHandlers();
            break;
        default:
            app.innerHTML = renderTowerPage();
            initTowerHandlers();
    }

    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// RENDU DES PAGES
// ==========================================

// PAGE TOWER (HOME)
function renderTowerPage() {
    return `
        <div class="tower-page">
            <div class="tower-hero">
                <h1 class="tower-title">HOURGLASS TOWER</h1>
                <p class="tower-subtitle">Hub des Mondes Infinis</p>
                <p class="tower-description">
                    Bienvenue, voyageur. Vous entrez dans la Tour du Sablier,
                    un nexus temporel où chaque porte mène à un univers différent.
                </p>
            </div>

            <div class="tower-intro">
                <h2>⏳ Votre Voyage Commence Ici</h2>
                <p>
                    La Hourglass Tower est un hub mystique qui connecte d'innombrables réalités.
                    Chaque monde accessible depuis la Tour contient des <strong>Sagas</strong> -
                    des aventures que vous pouvez vivre de différentes manières.
                </p>
                <p>
                    Choisissez votre porte, franchissez le seuil, et découvrez les histoires
                    qui vous attendent. Chaque saga peut être vécue sous 5 formats différents :
                </p>
                <ul style="text-align: left; max-width: 700px; margin: 1rem auto; color: var(--text-secondary);">
                    <li>📖 <strong>Scénario Écrit / Livre Audio</strong> - Lisez ou écoutez l'histoire</li>
                    <li>🎮 <strong>Histoire Interactive</strong> - Un livre dont vous êtes le héros</li>
                    <li>🎲 <strong>Jeu sur Table</strong> - Jeux de société, cartes, plateau</li>
                    <li>🎭 <strong>Jeu de Rôle</strong> - Immersion narrative à une table ou dans une zone</li>
                    <li>⚔️ <strong>Grandeur Nature (GN)</strong> - Immersion totale avec costumes et décors</li>
                </ul>
            </div>

            <div class="worlds-preview">
                <h2 class="section-title">🚪 Les Portes des Mondes</h2>
                <div class="worlds-grid">
                    ${TowerState.worlds.map(world => `
                        <div class="world-door" data-world-id="${world.id}">
                            <div class="door-icon">${world.doorIcon}</div>
                            <div class="world-icon">${world.icon}</div>
                            <h3 class="world-name" style="color: ${world.color};">${world.name}</h3>
                            <p class="world-description">${world.description}</p>
                            <p class="world-ambiance">${world.ambiance}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// PAGE WORLDS
function renderWorldsPage() {
    return `
        <div class="worlds-page">
            <div class="page-header">
                <h1 class="page-title">Les Mondes de la Tour</h1>
                <p class="page-subtitle">Explorez les univers connectés par la Hourglass Tower</p>
            </div>

            <div class="worlds-grid">
                ${TowerState.worlds.map(world => {
                    const worldSagas = TowerState.sagas.filter(s => s.worldId === world.id);
                    return `
                        <div class="world-door" data-world-id="${world.id}">
                            <div class="door-icon">${world.doorIcon}</div>
                            <div class="world-icon">${world.icon}</div>
                            <h3 class="world-name" style="color: ${world.color};">${world.name}</h3>
                            <p class="world-description">${world.description}</p>
                            <p class="world-ambiance">${world.ambiance}</p>
                            <p style="margin-top: 1rem; color: var(--text-gold); font-weight: 600;">
                                ${worldSagas.length} saga${worldSagas.length > 1 ? 's' : ''} disponible${worldSagas.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// PAGE SAGAS (TOUTES)
function renderSagasPage() {
    let html = `
        <div class="sagas-page">
            <div class="page-header">
                <h1 class="page-title">Toutes les Sagas</h1>
                <p class="page-subtitle">Découvrez toutes les aventures disponibles</p>
            </div>
    `;

    // Grouper les sagas par monde
    TowerState.worlds.forEach(world => {
        const worldSagas = TowerState.sagas.filter(s => s.worldId === world.id);

        if (worldSagas.length > 0) {
            html += `
                <div class="world-section">
                    <div class="world-section-header">
                        <span style="font-size: 2rem;">${world.icon}</span>
                        <h2 style="font-family: 'Cinzel', serif; font-size: 1.8rem; color: ${world.color};">
                            ${world.name}
                        </h2>
                    </div>
                    <div class="sagas-grid">
                        ${worldSagas.map(saga => renderSagaCard(saga)).join('')}
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    return html;
}

// Fonction helper pour rendre une carte saga
function renderSagaCard(saga) {
    return `
        <div class="saga-card" data-saga-id="${saga.id}">
            <img src="${saga.image}" alt="${saga.title}" class="saga-image" onerror="this.style.display='none'">
            <div class="saga-content">
                <h3 class="saga-title">${saga.title}</h3>
                <p class="saga-subtitle">${saga.subtitle}</p>
                <p class="saga-description">${saga.shortDescription}</p>
                <div class="saga-meta">
                    ${saga.themes.map(theme => `<span class="meta-tag">${theme}</span>`).join('')}
                    <span class="meta-tag">⚡ ${saga.difficulty}</span>
                    <span class="meta-tag">👥 ${saga.ageRange}</span>
                </div>
                <button class="saga-button">Explorer cette Saga</button>
            </div>
        </div>
    `;
}

// PAGE WORLD DETAIL
function renderWorldDetailPage(worldId) {
    const world = TowerState.worlds.find(w => w.id === worldId);
    if (!world) return '<div class="error">Monde non trouvé</div>';

    const worldSagas = TowerState.sagas.filter(s => s.worldId === worldId);

    return `
        <div class="world-detail-page">
            <button class="back-button" onclick="navigateTo('worlds')">
                ← Retour aux Mondes
            </button>

            <div class="page-header">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${world.icon}</div>
                <h1 class="page-title" style="color: ${world.color};">${world.name}</h1>
                <p class="page-subtitle">${world.description}</p>
                <p style="color: var(--text-muted); font-style: italic; margin-top: 0.5rem;">
                    ${world.ambiance}
                </p>
            </div>

            <h2 class="section-title">Sagas de ce monde</h2>
            <div class="sagas-grid">
                ${worldSagas.map(saga => renderSagaCard(saga)).join('')}
            </div>
        </div>
    `;
}

// PAGE SAGA DETAIL
function renderSagaDetailPage(sagaId) {
    const saga = TowerState.sagas.find(s => s.id === sagaId);
    if (!saga) return '<div class="error">Saga non trouvée</div>';

    const world = TowerState.worlds.find(w => w.id === saga.worldId);

    return `
        <div class="saga-detail-page">
            <button class="back-button" onclick="navigateTo('sagas')">
                ← Retour aux Sagas
            </button>

            <div class="saga-detail-header">
                <h1 class="saga-detail-title">${saga.title}</h1>
                <p class="saga-detail-subtitle">${saga.subtitle}</p>
                <div style="margin: 1.5rem 0; display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;">
                    ${saga.themes.map(theme => `<span class="meta-tag">${theme}</span>`).join('')}
                    <span class="meta-tag">⚡ ${saga.difficulty}</span>
                    <span class="meta-tag">👥 ${saga.ageRange}</span>
                    <span class="meta-tag" style="color: ${world.color};">🌍 ${world.name}</span>
                </div>
                <p class="saga-detail-description">${saga.longDescription}</p>
            </div>

            <h2 class="section-title">🎭 Choisissez Votre Format</h2>
            <div class="formats-grid">
                ${renderFormatCard('Scénario Écrit', '📖', saga.formats.written)}
                ${renderFormatCard('Histoire Interactive', '🎮', saga.formats.interactive)}
                ${renderFormatCard('Jeu sur Table', '🎲', saga.formats.tabletop)}
                ${renderFormatCard('Jeu de Rôle', '🎭', saga.formats.roleplay)}
                ${renderFormatCard('Grandeur Nature', '⚔️', saga.formats.larp)}
            </div>

            <div class="info-section" style="margin-top: 2rem;">
                <h2>📜 À propos de cette Saga</h2>
                <p>
                    <strong>${saga.title}</strong> est une aventure ${saga.difficulty.toLowerCase()}
                    recommandée pour un public ${saga.ageRange}. Cette saga explore les thèmes de
                    ${saga.themes.join(', ').toLowerCase()}.
                </p>
                <p>
                    Que vous préfériez lire une histoire, vivre une aventure interactive, jouer autour d'une table,
                    incarner un personnage en jeu de rôle, ou vous immerger totalement dans un grandeur nature,
                    cette saga offre une expérience adaptée à vos envies.
                </p>
            </div>
        </div>
    `;
}

// Helper pour rendre une carte de format
function renderFormatCard(name, icon, formatData) {
    const isAvailable = formatData.available;
    const unavailableClass = !isAvailable ? 'unavailable' : '';

    return `
        <div class="format-card ${unavailableClass}">
            <div class="format-header">
                <span class="format-name">${name}</span>
                <span class="format-icon">${icon}</span>
            </div>
            ${isAvailable ? `
                <div class="format-duration">⏱️ ${formatData.duration}</div>
                ${formatData.players ? `<div class="format-players">👥 ${formatData.players}</div>` : ''}
                <p class="format-description">${formatData.description}</p>
            ` : `
                <p class="format-description" style="color: var(--text-muted);">
                    Format non disponible pour cette saga
                </p>
            `}
        </div>
    `;
}

// PAGE ABOUT
function renderAboutPage() {
    return `
        <div class="about-page">
            <div class="page-header">
                <h1 class="page-title">À propos d'ANIM'CONNECT</h1>
                <p class="page-subtitle">La Hourglass Tower - Hub des Mondes Infinis</p>
            </div>

            <div class="info-section">
                <h2>⏳ Qu'est-ce que la Hourglass Tower ?</h2>
                <p>
                    La <strong>Hourglass Tower</strong> (Tour du Sablier) est un nexus temporel mystique,
                    un hub qui connecte d'innombrables univers à travers le temps et l'espace.
                    Comme un site de streaming pour les réalités alternatives, elle héberge des portails
                    menant vers différents mondes, chacun contenant ses propres histoires et aventures.
                </p>
                <p>
                    En tant que <strong>Voyageur</strong>, vous avez le privilège rare de franchir ces portes
                    et d'explorer les sagas qui se déroulent dans chaque monde.
                </p>
            </div>

            <div class="info-section">
                <h2>🌍 Les Mondes</h2>
                <p>
                    Chaque monde accessible depuis la Tour possède sa propre identité, ses règles,
                    et son atmosphère unique :
                </p>
                <ul>
                    <li><strong>⚔️ Royaume des Légendes</strong> - Magie ancienne, chevaliers et dragons</li>
                    <li><strong>🌐 Nexus Cybernétique</strong> - Futur dystopique, hackers et IA</li>
                    <li><strong>🔍 Archives des Énigmes</strong> - Mystères, enquêtes et secrets</li>
                    <li><strong>🗺️ Terres Inexplorées</strong> - Aventure, exploration et survie</li>
                    <li><strong>🎨 Atelier des Créateurs</strong> - Art, créativité et imagination</li>
                </ul>
            </div>

            <div class="info-section">
                <h2>📚 Les Sagas</h2>
                <p>
                    Les <strong>Sagas</strong> sont les histoires qui se déroulent dans chaque monde.
                    Ce ne sont pas de simples récits passifs - ce sont des expériences que vous pouvez
                    vivre activement de plusieurs manières.
                </p>
                <h3>Les 5 Formats d'Expérience</h3>
                <p>Chaque saga peut être vécue selon vos préférences :</p>
                <ul>
                    <li>
                        <strong>📖 Scénario Écrit / Livre Audio</strong><br>
                        Lisez ou écoutez l'histoire de manière classique. Parfait pour découvrir
                        l'univers et l'intrigue à votre rythme.
                    </li>
                    <li>
                        <strong>🎮 Histoire Interactive</strong><br>
                        Un livre dont vous êtes le héros moderne. Vos choix influencent le déroulement
                        de l'histoire et mènent à différentes fins possibles.
                    </li>
                    <li>
                        <strong>🎲 Jeu sur Table</strong><br>
                        Jeux de société, jeux de cartes, ou jeux de plateau qui transforment
                        la saga en expérience ludique partagée.
                    </li>
                    <li>
                        <strong>🎭 Jeu de Rôle (JDR)</strong><br>
                        Incarnez un personnage et vivez l'aventure autour d'une table avec un
                        Maître de Jeu, ou dans une zone dédiée pour plus d'immersion.
                    </li>
                    <li>
                        <strong>⚔️ Grandeur Nature (GN)</strong><br>
                        Immersion totale avec costumes, décors, et zones de jeu. Vivez réellement
                        l'aventure dans le monde physique.
                    </li>
                </ul>
            </div>

            <div class="info-section">
                <h2>🎯 Comment Utiliser ANIM'CONNECT ?</h2>
                <h3>1. Choisissez un Monde</h3>
                <p>
                    Explorez les différents mondes accessibles depuis la Hourglass Tower.
                    Chaque porte mène vers un univers unique avec son ambiance propre.
                </p>
                <h3>2. Découvrez les Sagas</h3>
                <p>
                    Parcourez les sagas disponibles dans chaque monde. Lisez les descriptions,
                    consultez les thèmes, et trouvez l'aventure qui vous inspire.
                </p>
                <h3>3. Sélectionnez Votre Format</h3>
                <p>
                    Chaque saga propose jusqu'à 5 formats différents. Choisissez celui qui
                    correspond à vos envies du moment : lecture tranquille, jeu interactif,
                    soirée entre amis, ou immersion totale.
                </p>
                <h3>4. Vivez l'Aventure</h3>
                <p>
                    Plongez dans l'histoire et vivez-la selon le format choisi. Chaque
                    expérience est conçue pour être mémorable et engageante.
                </p>
            </div>

            <div class="info-section">
                <h2>💡 Philosophie du Projet</h2>
                <p>
                    ANIM'CONNECT est né d'une conviction : les histoires sont plus riches
                    quand elles peuvent être vécues de multiples façons. Une même saga
                    peut être une lecture paisible le soir, un jeu familial le week-end,
                    ou une aventure épique grandeur nature.
                </p>
                <p>
                    La <strong>Hourglass Tower</strong> symbolise cette flexibilité temporelle :
                    le temps s'écoule différemment dans chaque monde, et chaque format
                    offre une perspective unique sur la même histoire.
                </p>
                <p>
                    Nous croyons que l'animation ludique doit être accessible, inclusive,
                    et adaptable aux envies de chacun. C'est pourquoi chaque saga est
                    pensée dès le départ pour exister sous plusieurs formes.
                </p>
            </div>

            <div class="info-section">
                <h2>🎨 Crédits</h2>
                <p>
                    <strong>ANIM'CONNECT - Hourglass Tower</strong><br>
                    Portfolio interactif d'animation ludique<br>
                    Design inspiré de l'art cyberpunk et des circuits électroniques
                </p>
                <p style="margin-top: 1rem; color: var(--text-muted);">
                    Images fournies par Unsplash<br>
                    Polices : Orbitron, Cinzel, Inter
                </p>
            </div>
        </div>
    `;
}

// ==========================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ==========================================

function initTowerHandlers() {
    // Gestion des clics sur les portes de mondes
    document.querySelectorAll('.world-door').forEach(door => {
        door.addEventListener('click', () => {
            const worldId = door.dataset.worldId;
            navigateTo('world-detail', { worldId });
        });
    });
}

function initWorldsHandlers() {
    // Gestion des clics sur les portes de mondes
    document.querySelectorAll('.world-door').forEach(door => {
        door.addEventListener('click', () => {
            const worldId = door.dataset.worldId;
            navigateTo('world-detail', { worldId });
        });
    });
}

function initSagasHandlers() {
    // Gestion des clics sur les cartes de sagas
    document.querySelectorAll('.saga-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Empêcher le clic si c'est sur le bouton
            if (e.target.classList.contains('saga-button')) {
                return;
            }
            const sagaId = card.dataset.sagaId;
            navigateTo('saga-detail', { sagaId });
        });
    });

    // Gestion des boutons de saga
    document.querySelectorAll('.saga-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.saga-card');
            const sagaId = card.dataset.sagaId;
            navigateTo('saga-detail', { sagaId });
        });
    });
}

function initWorldDetailHandlers() {
    initSagasHandlers();
}

function initSagaDetailHandlers() {
    // Les cartes de format pourraient avoir des actions futures
}

// ==========================================
// EXPOSITION GLOBALE
// ==========================================
window.navigateTo = navigateTo;
window.TowerState = TowerState;
