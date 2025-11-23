// ============================================
// GESTION DES PERSONAS
// ============================================

const Personas = {
    // Charger tous les personas
    async load() {
        const container = document.getElementById('personas-container');
        if (!container) return;

        // Afficher un loader
        container.innerHTML = '<div class="loading"></div>';

        try {
            // Charger l'auteur
            if (!STATE.data.author) {
                STATE.data.author = await Utils.loadJSON(CONFIG.DATA_PATHS.author);
            }

            // Charger les personas si pas déjà chargés
            if (STATE.data.personas.length === 0) {
                const personasPromises = CONFIG.PERSONAS_FILES.map(file =>
                    Utils.loadJSON(CONFIG.PERSONAS_PATH + file)
                );
                STATE.data.personas = await Promise.all(personasPromises);
            }

            // Afficher les personas
            this.display(container);

        } catch (error) {
            console.error('Error loading personas:', error);
            container.innerHTML = '<p>Erreur lors du chargement des personas.</p>';
        }
    },

    // Afficher les personas
    display(container) {
        container.innerHTML = '';

        // Afficher l'auteur en premier
        if (STATE.data.author) {
            const authorCard = this.createPersonaCard(STATE.data.author, true);
            container.appendChild(authorCard);
        }

        // Afficher les personas
        STATE.data.personas.forEach(persona => {
            if (persona) {
                const card = this.createPersonaCard(persona, false);
                container.appendChild(card);
            }
        });
    },

    // Créer une carte de persona
    createPersonaCard(persona, isAuthor = false) {
        const card = document.createElement('div');
        card.className = `persona-card${isAuthor ? ' author' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'persona-avatar';
        avatar.textContent = persona.avatar;

        const name = document.createElement('h3');
        name.className = 'persona-name';
        name.textContent = persona.name;

        const role = document.createElement('div');
        role.className = 'persona-role';
        role.textContent = persona.role;

        const description = document.createElement('p');
        description.className = 'persona-description';
        description.textContent = persona.description;

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(description);

        // Ajouter les compétences si disponibles
        if (persona.skills && persona.skills.length > 0) {
            const skillsContainer = document.createElement('div');
            skillsContainer.className = 'persona-skills';

            persona.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsContainer.appendChild(skillTag);
            });

            card.appendChild(skillsContainer);
        }

        return card;
    },

    // Obtenir un persona par ID
    getById(personaId) {
        return STATE.data.personas.find(p => p.id === personaId);
    },

    // Créer un sélecteur de persona pour le chat
    createSelector(projectId) {
        const project = STATE.data.projects.find(p => p.id === projectId);
        if (!project) return null;

        const container = document.createElement('div');
        container.className = 'persona-selector';

        const title = document.createElement('h3');
        title.textContent = 'Choisissez un persona pour discuter du projet :';
        container.appendChild(title);

        // Personas recommandés en premier
        const recommendedIds = project.recommendedPersonas || [];
        const recommended = STATE.data.personas.filter(p =>
            recommendedIds.includes(p.id)
        );

        // Autres personas
        const others = STATE.data.personas.filter(p =>
            !recommendedIds.includes(p.id)
        );

        // Afficher les recommandés
        if (recommended.length > 0) {
            const recTitle = document.createElement('h4');
            recTitle.textContent = 'Recommandés :';
            recTitle.style.gridColumn = '1 / -1';
            recTitle.style.color = 'var(--neon-orange)';
            container.appendChild(recTitle);

            recommended.forEach(persona => {
                const btn = this.createSelectorButton(persona, projectId);
                container.appendChild(btn);
            });
        }

        // Afficher les autres
        if (others.length > 0) {
            const othersTitle = document.createElement('h4');
            othersTitle.textContent = 'Autres :';
            othersTitle.style.gridColumn = '1 / -1';
            othersTitle.style.color = 'var(--text-secondary)';
            othersTitle.style.marginTop = 'var(--spacing-md)';
            container.appendChild(othersTitle);

            others.forEach(persona => {
                const btn = this.createSelectorButton(persona, projectId);
                container.appendChild(btn);
            });
        }

        return container;
    },

    // Créer un bouton de sélection de persona
    createSelectorButton(persona, projectId) {
        const btn = document.createElement('button');
        btn.className = 'persona-select-btn';

        const avatar = document.createElement('div');
        avatar.className = 'persona-select-avatar';
        avatar.textContent = persona.avatar;

        const name = document.createElement('div');
        name.className = 'persona-select-name';
        name.textContent = persona.name.split(' ')[0]; // Prénom uniquement

        btn.appendChild(avatar);
        btn.appendChild(name);

        btn.addEventListener('click', () => {
            Chat.open(persona, projectId);
        });

        return btn;
    }
};
