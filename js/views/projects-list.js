// Vue : Liste des projets avec filtres

import dataService from '../services/data-service.js';
import storageService from '../services/storage-service.js';
import { formatDuree, arrayToText, debounce, showToast } from '../utils/helpers.js';

export default class ProjectsListView {
  constructor() {
    this.filteredProjets = [];
    this.currentFilters = {
      niveaux: [],
      duree_max: null,
      lieu: [],
      type_activite: [],
      materiel: null,
      meteo: []
    };
    this.searchQuery = '';
    this.sortBy = 'recent';
  }

  async render() {
    // Appliquer les filtres
    this.applyFilters();

    return `
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a href="/" data-link class="breadcrumb__item">Accueil</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__item breadcrumb__item--active">Projets</span>
        </nav>

        <h1>Projets d'animation</h1>
        <p class="text-large text-muted mb-xl">
          ${dataService.getAllProjets().length} projet${dataService.getAllProjets().length > 1 ? 's' : ''} disponible${dataService.getAllProjets().length > 1 ? 's' : ''}
        </p>

        <!-- Recherche -->
        <div class="search-bar">
          <span class="search-bar__icon">🔍</span>
          <input
            type="text"
            class="search-bar__input"
            id="search-input"
            placeholder="Rechercher un projet (titre, description, type...)"
            value="${this.searchQuery}"
          >
        </div>

        <!-- Filtres -->
        <div class="filters">
          <div class="filters__header">
            <h3 class="filters__title">Filtres</h3>
            <button class="filters__toggle" id="toggle-filters">
              ${Object.values(this.currentFilters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))
                ? 'Réinitialiser'
                : 'Filtrer'}
            </button>
          </div>

          <div class="filters__body" id="filters-body">
            <!-- Niveaux -->
            <div class="form-group">
              <label class="form-label">Niveaux</label>
              <div class="checkbox-group">
                ${['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].map(niveau => `
                  <label>
                    <input
                      type="checkbox"
                      name="niveaux"
                      value="${niveau}"
                      ${this.currentFilters.niveaux.includes(niveau) ? 'checked' : ''}
                    >
                    ${niveau}
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Durée -->
            <div class="form-group">
              <label class="form-label">
                Durée max : <span id="duree-value">${this.currentFilters.duree_max || 120}</span> min
              </label>
              <input
                type="range"
                class="form-input"
                id="duree-max"
                min="10"
                max="120"
                step="5"
                value="${this.currentFilters.duree_max || 120}"
              >
            </div>

            <!-- Lieu -->
            <div class="form-group">
              <label class="form-label">Lieu</label>
              <div class="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="lieu"
                    value="interieur"
                    ${this.currentFilters.lieu.includes('interieur') ? 'checked' : ''}
                  >
                  Intérieur
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="lieu"
                    value="exterieur"
                    ${this.currentFilters.lieu.includes('exterieur') ? 'checked' : ''}
                  >
                  Extérieur
                </label>
              </div>
            </div>

            <!-- Matériel -->
            <div class="form-group">
              <label class="form-label">Matériel nécessaire</label>
              <select class="form-select" id="materiel">
                <option value="">Tous</option>
                <option value="aucun" ${this.currentFilters.materiel === 'aucun' ? 'selected' : ''}>
                  Aucun (sans matériel)
                </option>
                <option value="minimal" ${this.currentFilters.materiel === 'minimal' ? 'selected' : ''}>
                  Minimal
                </option>
                <option value="moyen" ${this.currentFilters.materiel === 'moyen' ? 'selected' : ''}>
                  Moyen
                </option>
                <option value="complet" ${this.currentFilters.materiel === 'complet' ? 'selected' : ''}>
                  Complet
                </option>
              </select>
            </div>
          </div>

          <div class="filters__actions">
            <button class="btn btn--primary btn--small" id="apply-filters">
              Appliquer les filtres
            </button>
            <button class="btn btn--outline btn--small" id="reset-filters">
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Tri et affichage -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <div>
            <strong>${this.filteredProjets.length}</strong> projet${this.filteredProjets.length > 1 ? 's' : ''} trouvé${this.filteredProjets.length > 1 ? 's' : ''}
          </div>
          <div>
            <label>
              Trier par :
              <select class="form-select" id="sort-by" style="display: inline-block; width: auto; margin-left: 0.5rem;">
                <option value="recent" ${this.sortBy === 'recent' ? 'selected' : ''}>Plus récents</option>
                <option value="alphabetique" ${this.sortBy === 'alphabetique' ? 'selected' : ''}>Alphabétique</option>
                <option value="duree_asc" ${this.sortBy === 'duree_asc' ? 'selected' : ''}>Durée (croissant)</option>
                <option value="duree_desc" ${this.sortBy === 'duree_desc' ? 'selected' : ''}>Durée (décroissant)</option>
              </select>
            </label>
          </div>
        </div>

        <!-- Liste des projets -->
        <div class="grid" id="projects-grid">
          ${this.filteredProjets.length > 0
            ? this.filteredProjets.map(p => this.renderProjetCard(p)).join('')
            : this.renderEmptyState()
          }
        </div>
      </div>
    `;
  }

  renderProjetCard(projet) {
    const isFavori = storageService.isFavori(projet.id);

    return `
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">${projet.titre}</h3>
          ${projet.statut.badge_special ? `
            <span class="card__badge">${projet.statut.badge_special === 'coup_de_coeur' ? '❤️' : '⭐'}</span>
          ` : ''}
        </div>

        <div class="card__body">
          <p class="card__description">${projet.description_courte}</p>

          <div class="card__meta">
            <span class="tag tag--primary">${projet.metadonnees.niveaux.join(', ')}</span>
            <span class="tag">${formatDuree(projet.metadonnees.duree_min, projet.metadonnees.duree_max)}</span>
            <span class="tag">${arrayToText(projet.metadonnees.lieu)}</span>
            ${projet.tags.materiel_necessaire === 'aucun' || projet.tags.materiel_necessaire === 'minimal'
              ? `<span class="tag tag--success">Sans matériel</span>`
              : ''
            }
          </div>
        </div>

        <div class="card__actions">
          <a href="/projets/${projet.id}/fiche" data-link class="btn btn--primary btn--small">
            📋 Fiche
          </a>
          <a href="/projets/${projet.id}/demo" data-link class="btn btn--secondary btn--small">
            🎮 Démo
          </a>
          <button
            class="btn btn--icon btn--small toggle-favori"
            data-projet-id="${projet.id}"
            title="${isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
          >
            ${isFavori ? '⭐' : '☆'}
          </button>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state__icon">😕</div>
        <h3 class="empty-state__title">Aucun projet trouvé</h3>
        <p class="empty-state__message">
          Essaie de modifier tes filtres ou ta recherche
        </p>
        <button class="btn btn--primary" id="reset-all">
          Réinitialiser tout
        </button>
      </div>
    `;
  }

  applyFilters() {
    let projets = dataService.getAllProjets();

    // Appliquer la recherche
    if (this.searchQuery) {
      projets = dataService.searchProjets(this.searchQuery);
    }

    // Appliquer les filtres
    projets = dataService.filterProjets(this.currentFilters);

    // Trier
    this.filteredProjets = dataService.sortProjets(projets, this.sortBy);
  }

  async afterRender() {
    // Recherche
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.searchQuery = e.target.value;
        this.updateView();
      }, 300));
    }

    // Durée slider
    const dureeSlider = document.getElementById('duree-max');
    const dureeValue = document.getElementById('duree-value');
    if (dureeSlider && dureeValue) {
      dureeSlider.addEventListener('input', (e) => {
        dureeValue.textContent = e.target.value;
      });
    }

    // Appliquer filtres
    document.getElementById('apply-filters')?.addEventListener('click', () => {
      this.collectFilters();
      this.applyFilters();
      this.updateView();
      showToast('Filtres appliqués', 'success');
    });

    // Réinitialiser filtres
    document.getElementById('reset-filters')?.addEventListener('click', () => {
      this.resetFilters();
      this.updateView();
    });

    // Réinitialiser tout (depuis empty state)
    document.getElementById('reset-all')?.addEventListener('click', () => {
      this.searchQuery = '';
      this.resetFilters();
      this.updateView();
    });

    // Tri
    document.getElementById('sort-by')?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFilters();
      this.updateView();
    });

    // Favoris
    document.querySelectorAll('.toggle-favori').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projetId = e.currentTarget.dataset.projetId;
        const isFavori = storageService.toggleFavori(projetId);

        e.currentTarget.textContent = isFavori ? '⭐' : '☆';
        e.currentTarget.title = isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';

        showToast(
          isFavori ? 'Ajouté aux favoris' : 'Retiré des favoris',
          'success',
          2000
        );
      });
    });
  }

  collectFilters() {
    // Niveaux
    const niveauxChecked = Array.from(document.querySelectorAll('input[name="niveaux"]:checked'));
    this.currentFilters.niveaux = niveauxChecked.map(cb => cb.value);

    // Durée
    this.currentFilters.duree_max = parseInt(document.getElementById('duree-max').value);

    // Lieu
    const lieuChecked = Array.from(document.querySelectorAll('input[name="lieu"]:checked'));
    this.currentFilters.lieu = lieuChecked.map(cb => cb.value);

    // Matériel
    const materiel = document.getElementById('materiel').value;
    this.currentFilters.materiel = materiel || null;
  }

  resetFilters() {
    this.currentFilters = {
      niveaux: [],
      duree_max: null,
      lieu: [],
      type_activite: [],
      materiel: null,
      meteo: []
    };
    this.sortBy = 'recent';
  }

  updateView() {
    this.applyFilters();
    const grid = document.getElementById('projects-grid');
    if (grid) {
      grid.innerHTML = this.filteredProjets.length > 0
        ? this.filteredProjets.map(p => this.renderProjetCard(p)).join('')
        : this.renderEmptyState();

      // Réattacher les event listeners pour les favoris
      grid.querySelectorAll('.toggle-favori').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const projetId = e.currentTarget.dataset.projetId;
          const isFavori = storageService.toggleFavori(projetId);

          e.currentTarget.textContent = isFavori ? '⭐' : '☆';
          e.currentTarget.title = isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';

          showToast(
            isFavori ? 'Ajouté aux favoris' : 'Retiré des favoris',
            'success',
            2000
          );
        });
      });

      // Réattacher pour reset-all si empty state
      document.getElementById('reset-all')?.addEventListener('click', () => {
        this.searchQuery = '';
        document.getElementById('search-input').value = '';
        this.resetFilters();
        this.updateView();
      });
    }

    // Mettre à jour le compteur
    const counterEl = document.querySelector('strong');
    if (counterEl && counterEl.nextSibling) {
      counterEl.textContent = this.filteredProjets.length;
      counterEl.nextSibling.textContent = ` projet${this.filteredProjets.length > 1 ? 's' : ''} trouvé${this.filteredProjets.length > 1 ? 's' : ''}`;
    }
  }
}
