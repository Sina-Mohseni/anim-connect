// ============================================
// GESTION DES PROJETS
// ============================================

const Projects = {
    // Charger et afficher les mondes
    async loadWorlds() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = '<div class="loading"></div>';

        // Réinitialiser l'état
        STATE.currentWorld = null;
        STATE.currentEpoch = null;
        STATE.currentSaga = null;
        STATE.currentProject = null;

        // Afficher les mondes
        this.displayWorlds();
        this.updateBreadcrumb();
    },

    // Afficher les mondes
    displayWorlds() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'world-grid';

        STATE.data.worlds.forEach(world => {
            const card = this.createWorldCard(world);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // Créer une carte de monde
    createWorldCard(world) {
        const card = document.createElement('div');
        card.className = 'world-card';

        // Ajouter l'image de fond si disponible
        if (world.image) {
            card.style.background = `linear-gradient(rgba(10, 14, 39, 0.80), rgba(5, 8, 22, 0.88)), url('${world.image}') center/cover`;
        }

        const icon = document.createElement('div');
        icon.style.fontSize = '3rem';
        icon.style.textAlign = 'center';
        icon.style.marginBottom = 'var(--spacing-md)';
        icon.textContent = world.icon;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = world.name;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = world.description;

        const meta = document.createElement('div');
        meta.className = 'card-meta';
        const epochCount = STATE.data.epochs.filter(e => e.worldId === world.id).length;
        meta.innerHTML = `<span>${epochCount} époques</span>`;

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);

        card.addEventListener('click', () => {
            STATE.currentWorld = world.id;
            this.displayEpochs(world.id);
            this.updateBreadcrumb();
        });

        return card;
    },

    // Afficher les époques d'un monde
    displayEpochs(worldId) {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        const epochs = STATE.data.epochs.filter(e => e.worldId === worldId);

        const grid = document.createElement('div');
        grid.className = 'epoch-grid';

        epochs.forEach(epoch => {
            const card = this.createEpochCard(epoch);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // Créer une carte d'époque
    createEpochCard(epoch) {
        const card = document.createElement('div');
        card.className = 'epoch-card';

        const icon = document.createElement('div');
        icon.style.fontSize = '3rem';
        icon.style.textAlign = 'center';
        icon.style.marginBottom = 'var(--spacing-md)';
        icon.textContent = epoch.icon;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = epoch.name;

        const period = document.createElement('div');
        period.style.color = 'var(--neon-cyan)';
        period.style.textAlign = 'center';
        period.style.fontSize = 'var(--font-sm)';
        period.style.marginBottom = 'var(--spacing-sm)';
        period.textContent = epoch.period;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = epoch.description;

        const meta = document.createElement('div');
        meta.className = 'card-meta';
        const sagaCount = STATE.data.sagas.filter(s => s.epochId === epoch.id).length;
        meta.innerHTML = `<span>${sagaCount} sagas</span>`;

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(period);
        card.appendChild(description);
        card.appendChild(meta);

        card.addEventListener('click', () => {
            STATE.currentEpoch = epoch.id;
            this.displaySagas(epoch.id);
            this.updateBreadcrumb();
        });

        return card;
    },

    // Afficher les sagas d'une époque
    displaySagas(epochId) {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        const sagas = STATE.data.sagas.filter(s => s.epochId === epochId);

        const grid = document.createElement('div');
        grid.className = 'saga-grid';

        sagas.forEach(saga => {
            const card = this.createSagaCard(saga);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // Créer une carte de saga
    createSagaCard(saga) {
        const card = document.createElement('div');
        card.className = 'saga-card';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = saga.name;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = saga.description;

        const meta = document.createElement('div');
        meta.className = 'card-meta';
        meta.innerHTML = `
            <span>${saga.projectCount} projets</span>
            <span style="color: ${this.getDifficultyColor(saga.difficulty)}">${saga.difficulty}</span>
        `;

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);

        card.addEventListener('click', () => {
            STATE.currentSaga = saga.id;
            this.displayProjects(saga.id);
            this.updateBreadcrumb();
        });

        return card;
    },

    // Afficher les projets d'une saga
    displayProjects(sagaId) {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        const projects = STATE.data.projects.filter(p => p.sagaId === sagaId);

        const grid = document.createElement('div');
        grid.className = 'project-grid';

        projects.forEach(project => {
            const card = this.createProjectCard(project);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // Créer une carte de projet
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = project.name;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = project.description;

        const meta = document.createElement('div');
        meta.className = 'card-meta';
        meta.innerHTML = `
            <span>${project.duration}</span>
            <span>${project.players}</span>
        `;

        // Tags
        if (project.tags) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'persona-skills';
            tagsContainer.style.marginTop = 'var(--spacing-md)';
            project.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'skill-tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
            card.appendChild(tagsContainer);
        }

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);

        card.addEventListener('click', () => {
            STATE.currentProject = project.id;
            Modal.openProject(project);
        });

        return card;
    },

    // Obtenir la couleur selon la difficulté
    getDifficultyColor(difficulty) {
        const colors = {
            'Facile': 'var(--neon-cyan)',
            'Normal': 'var(--neon-blue)',
            'Difficile': 'var(--neon-orange)'
        };
        return colors[difficulty] || 'var(--text-secondary)';
    },

    // Mettre à jour le fil d'Ariane
    updateBreadcrumb() {
        const breadcrumb = document.getElementById('project-breadcrumb');
        if (!breadcrumb) return;

        breadcrumb.innerHTML = '';

        const items = [];

        // Toujours avoir "Mondes" comme premier élément
        items.push({
            label: 'Mondes',
            action: () => {
                STATE.currentWorld = null;
                STATE.currentEpoch = null;
                STATE.currentSaga = null;
                STATE.currentProject = null;
                this.displayWorlds();
                this.updateBreadcrumb();
            }
        });

        // Ajouter le monde si sélectionné
        if (STATE.currentWorld) {
            const world = STATE.data.worlds.find(w => w.id === STATE.currentWorld);
            if (world) {
                items.push({
                    label: world.name,
                    action: () => {
                        STATE.currentEpoch = null;
                        STATE.currentSaga = null;
                        STATE.currentProject = null;
                        this.displayEpochs(STATE.currentWorld);
                        this.updateBreadcrumb();
                    }
                });
            }
        }

        // Ajouter l'époque si sélectionnée
        if (STATE.currentEpoch) {
            const epoch = STATE.data.epochs.find(e => e.id === STATE.currentEpoch);
            if (epoch) {
                items.push({
                    label: epoch.name,
                    action: () => {
                        STATE.currentSaga = null;
                        STATE.currentProject = null;
                        this.displaySagas(STATE.currentEpoch);
                        this.updateBreadcrumb();
                    }
                });
            }
        }

        // Ajouter la saga si sélectionnée
        if (STATE.currentSaga) {
            const saga = STATE.data.sagas.find(s => s.id === STATE.currentSaga);
            if (saga) {
                items.push({
                    label: saga.name,
                    action: () => {
                        STATE.currentProject = null;
                        this.displayProjects(STATE.currentSaga);
                        this.updateBreadcrumb();
                    }
                });
            }
        }

        // Construire le fil d'Ariane
        items.forEach((item, index) => {
            const breadcrumbItem = document.createElement('span');
            breadcrumbItem.className = 'breadcrumb-item';
            breadcrumbItem.textContent = item.label;
            breadcrumbItem.addEventListener('click', item.action);
            breadcrumb.appendChild(breadcrumbItem);

            if (index < items.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = '›';
                breadcrumb.appendChild(separator);
            }
        });
    }
};
