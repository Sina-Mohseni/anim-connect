// ============================================
// GESTION DES MODALS
// ============================================

const Modal = {
    // Initialiser les modals
    init() {
        const modal = document.getElementById('project-modal');
        const chatModal = document.getElementById('chat-modal');

        // Fermer les modals au clic sur le bouton de fermeture
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
                Chat.close();
            });
        });

        // Fermer les modals au clic en dehors du contenu
        [modal, chatModal].forEach(m => {
            if (m) {
                m.addEventListener('click', (e) => {
                    if (e.target === m) {
                        this.close();
                        Chat.close();
                    }
                });
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
                Chat.close();
            }
        });
    },

    // Ouvrir le modal de projet
    openProject(project) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) return;

        // Construire le contenu du modal
        modalBody.innerHTML = this.buildProjectContent(project);

        // Ajouter les événements pour les options
        this.setupProjectOptions(project);

        // Ajouter les événements pour les actions
        this.setupProjectActions(project);

        // Afficher le modal
        modal.classList.add('active');
    },

    // Construire le contenu du projet
    buildProjectContent(project) {
        return `
            <h2 style="color: var(--neon-orange); margin-bottom: var(--spacing-lg); text-align: center;">
                ${project.name}
            </h2>

            <div style="color: var(--text-secondary); text-align: center; margin-bottom: var(--spacing-xl);">
                <p style="font-size: var(--font-lg); line-height: 1.8;">${project.description}</p>
                <div style="display: flex; gap: var(--spacing-lg); justify-content: center; margin-top: var(--spacing-md); color: var(--neon-blue);">
                    <span>⏱️ ${project.duration}</span>
                    <span>👥 ${project.players}</span>
                </div>
            </div>

            <h3 style="color: var(--neon-cyan); margin-bottom: var(--spacing-md);">Personnalisez votre expérience :</h3>

            <div class="project-options">
                <div class="option-group">
                    <div class="option-label">Difficulté</div>
                    <div class="option-buttons">
                        <button class="option-btn ${STATE.selectedOptions.difficulty === 'facile' ? 'active' : ''}" data-option="difficulty" data-value="facile">
                            Facile
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.difficulty === 'normal' ? 'active' : ''}" data-option="difficulty" data-value="normal">
                            Normal
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.difficulty === 'difficile' ? 'active' : ''}" data-option="difficulty" data-value="difficile">
                            Difficile
                        </button>
                    </div>
                    <div style="color: var(--text-muted); font-size: var(--font-xs); margin-top: var(--spacing-xs);">
                        ${project.difficulty[STATE.selectedOptions.difficulty]}
                    </div>
                </div>

                <div class="option-group">
                    <div class="option-label">Mode de Jeu</div>
                    <div class="option-buttons">
                        <button class="option-btn ${STATE.selectedOptions.mode === 'coop' ? 'active' : ''}" data-option="mode" data-value="coop">
                            Coopératif
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.mode === 'competitif' ? 'active' : ''}" data-option="mode" data-value="competitif">
                            Compétitif
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.mode === 'semi' ? 'active' : ''}" data-option="mode" data-value="semi">
                            Semi-Coop
                        </button>
                    </div>
                    <div style="color: var(--text-muted); font-size: var(--font-xs); margin-top: var(--spacing-xs);">
                        ${project.mode[STATE.selectedOptions.mode]}
                    </div>
                </div>

                <div class="option-group">
                    <div class="option-label">Zone de Jeu</div>
                    <div class="option-buttons">
                        <button class="option-btn ${STATE.selectedOptions.zone === 'table' ? 'active' : ''}" data-option="zone" data-value="table">
                            À Table
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.zone === 'piece' ? 'active' : ''}" data-option="zone" data-value="piece">
                            Dans la Pièce
                        </button>
                        <button class="option-btn ${STATE.selectedOptions.zone === 'multi' ? 'active' : ''}" data-option="zone" data-value="multi">
                            Multi-Pièces
                        </button>
                    </div>
                    <div style="color: var(--text-muted); font-size: var(--font-xs); margin-top: var(--spacing-xs);">
                        ${project.zone[STATE.selectedOptions.zone]}
                    </div>
                </div>
            </div>

            <h3 style="color: var(--neon-cyan); margin: var(--spacing-xl) 0 var(--spacing-md);">Actions disponibles :</h3>

            <div class="project-actions">
                <button class="action-btn" data-action="fiche">
                    <div class="action-icon">📋</div>
                    <div class="action-label">Fiche</div>
                </button>
                <button class="action-btn" data-action="reunion">
                    <div class="action-icon">💬</div>
                    <div class="action-label">Réunion</div>
                </button>
                <button class="action-btn" data-action="scenario">
                    <div class="action-icon">📖</div>
                    <div class="action-label">Scénario</div>
                </button>
                <button class="action-btn" data-action="intro">
                    <div class="action-icon">🎬</div>
                    <div class="action-label">Intro</div>
                </button>
                <button class="action-btn" data-action="setup">
                    <div class="action-icon">🔧</div>
                    <div class="action-label">Mise en Place</div>
                </button>
                <button class="action-btn" data-action="rules">
                    <div class="action-icon">📜</div>
                    <div class="action-label">Règles</div>
                </button>
            </div>
        `;
    },

    // Configurer les options du projet
    setupProjectOptions(project) {
        const optionButtons = document.querySelectorAll('.option-btn');

        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const option = btn.getAttribute('data-option');
                const value = btn.getAttribute('data-value');

                // Mettre à jour l'état
                STATE.selectedOptions[option] = value;

                // Mettre à jour l'UI
                const group = btn.closest('.option-group');
                group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Mettre à jour la description
                const description = group.querySelector('div[style*="text-muted"]');
                if (description) {
                    description.textContent = project[option][value];
                }
            });
        });
    },

    // Configurer les actions du projet
    setupProjectActions(project) {
        const actionButtons = document.querySelectorAll('.action-btn');

        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleAction(action, project);
            });
        });
    },

    // Gérer les actions
    handleAction(action, project) {
        if (action === 'reunion') {
            // Ouvrir le sélecteur de persona
            this.openPersonaSelector(project);
        } else if (action === 'intro') {
            // Afficher les infos de la vidéo d'intro
            this.showContent(project.content.intro);
        } else {
            // Afficher le contenu correspondant
            const contentKey = action === 'setup' ? 'setup' : action === 'rules' ? 'rules' : action;
            this.showContent(project.content[contentKey]);
        }
    },

    // Afficher un sélecteur de persona
    openPersonaSelector(project) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2 style="color: var(--neon-orange); margin-bottom: var(--spacing-lg); text-align: center;">
                Choisir un Persona
            </h2>
            <p style="color: var(--text-secondary); text-align: center; margin-bottom: var(--spacing-xl);">
                Sélectionnez un persona pour discuter de ce projet en réunion virtuelle.
            </p>
        `;

        const selector = Personas.createSelector(project.id);
        if (selector) {
            modalBody.appendChild(selector);
        }

        // Ajouter un bouton retour
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = 'Retour au projet';
        backBtn.addEventListener('click', () => {
            this.openProject(project);
        });
        modalBody.insertBefore(backBtn, modalBody.firstChild);
    },

    // Afficher un contenu spécifique
    showContent(content) {
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <h2 style="color: var(--neon-orange); margin-bottom: var(--spacing-lg);">
                ${content.title}
            </h2>
            <div style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;">
                ${content.text || content.description || 'Contenu à venir...'}
            </div>
            ${content.videoUrl ? `
                <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: var(--bg-darker); border-radius: var(--radius-md); text-align: center;">
                    <p style="color: var(--neon-cyan);">🎬 Vidéo : ${content.videoUrl}</p>
                    <p style="color: var(--text-muted); font-size: var(--font-sm); margin-top: var(--spacing-sm);">
                        ${content.description}
                    </p>
                </div>
            ` : ''}
        `;

        // Ajouter un bouton retour
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = 'Retour au projet';
        backBtn.style.marginTop = 'var(--spacing-xl)';
        backBtn.addEventListener('click', () => {
            const project = STATE.data.projects.find(p => p.id === STATE.currentProject);
            if (project) {
                this.openProject(project);
            }
        });
        modalBody.appendChild(backBtn);
    },

    // Fermer tous les modals
    close() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
};
