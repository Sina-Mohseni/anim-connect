// Vue : Page d'accueil

import dataService from '../services/data-service.js';
import storageService from '../services/storage-service.js';
import { formatDuree, arrayToText } from '../utils/helpers.js';

export default class HomeView {
  async render() {
    // Récupérer les projets mis en avant
    const projetsEnAvant = dataService.getProjetsMisEnAvant().slice(0, 3);

    return `
      <div class="container">
        <!-- Hero -->
        <div class="hero">
          <h1 class="hero__title">Anim'Connect</h1>
          <p class="hero__subtitle">Le carnet numérique de l'animateur PS → CM2</p>
          <div class="hero__actions">
            <a href="/projets" data-link class="btn btn--primary btn--large">
              Explorer les projets
            </a>
            <a href="/mode-urgence" data-link class="btn btn--accent btn--large">
              Mode urgence 🚨
            </a>
            <a href="/creer" data-link class="btn btn--outline btn--large">
              Créer un projet
            </a>
          </div>
        </div>

        <!-- Section : Pourquoi Anim'Connect ? -->
        <section class="section">
          <div class="section__header">
            <h2 class="section__title">Pourquoi Anim'Connect ?</h2>
            <p class="section__subtitle">
              Un outil pensé pour les animateurs qui veulent des activités
              exploitables rapidement et efficacement
            </p>
          </div>

          <div class="grid grid-3">
            <div class="card">
              <div class="card__body">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">🔍</div>
                <h3 class="text-center">Trouver rapidement</h3>
                <p class="text-center text-muted">
                  Filtres puissants par niveau, durée, lieu, matériel.
                  En 3 clics, tu as ton activité.
                </p>
              </div>
            </div>

            <div class="card">
              <div class="card__body">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">📋</div>
                <h3 class="text-center">Fiches structurées</h3>
                <p class="text-center text-muted">
                  Méthode PSAADRAFRA complète : objectifs, déroulé, astuces, variantes.
                  Tout pour animer sereinement.
                </p>
              </div>
            </div>

            <div class="card">
              <div class="card__body">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">💾</div>
                <h3 class="text-center">Ton carnet perso</h3>
                <p class="text-center text-muted">
                  Favoris, planning, historique. Tout en local, aucun compte nécessaire.
                  Tes données restent chez toi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section : Projets mis en avant -->
        ${projetsEnAvant.length > 0 ? `
          <section class="section">
            <div class="section__header">
              <h2 class="section__title">Projets coups de cœur ❤️</h2>
              <p class="section__subtitle">Des activités testées et approuvées</p>
            </div>

            <div class="grid">
              ${projetsEnAvant.map(projet => this.renderProjetCard(projet)).join('')}
            </div>

            <div class="text-center mt-xl">
              <a href="/projets" data-link class="btn btn--primary">
                Voir tous les projets
              </a>
            </div>
          </section>
        ` : ''}

        <!-- Section : Raccourcis rapides -->
        <section class="section">
          <div class="section__header">
            <h2 class="section__title">Accès rapide</h2>
          </div>

          <div class="grid grid-2">
            <a href="/astuces" data-link class="card" style="text-decoration: none; color: inherit;">
              <div class="card__body">
                <h3>💡 Astuces d'animation</h3>
                <p class="text-muted">
                  Conseils pratiques pour gérer ton groupe, les transitions, les conflits...
                </p>
              </div>
            </a>

            <a href="/tutos" data-link class="card" style="text-decoration: none; color: inherit;">
              <div class="card__body">
                <h3>📚 Tutos & Formations</h3>
                <p class="text-muted">
                  Mini-formations pour progresser : animer un grand jeu, construire un cycle...
                </p>
              </div>
            </a>

            <a href="/psaadrafra" data-link class="card" style="text-decoration: none; color: inherit;">
              <div class="card__body">
                <h3>🎯 Méthode PSAADRAFRA</h3>
                <p class="text-muted">
                  Découvre comment structurer une activité de A à Z avec cette méthode éprouvée.
                </p>
              </div>
            </a>

            <a href="/planning" data-link class="card" style="text-decoration: none; color: inherit;">
              <div class="card__body">
                <h3>📅 Mon planning</h3>
                <p class="text-muted">
                  Prépare ta journée ou ta semaine en piochant dans le catalogue.
                </p>
              </div>
            </a>
          </div>
        </section>
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
            <span class="card__badge badge--${projet.statut.badge_special}">
              ${projet.statut.badge_special === 'coup_de_coeur' ? '❤️ Coup de cœur' : ''}
            </span>
          ` : ''}
        </div>

        <div class="card__body">
          <p class="card__description">${projet.description_courte}</p>

          <div class="card__meta">
            <span class="tag tag--primary">${projet.metadonnees.niveaux.join(', ')}</span>
            <span class="tag">${formatDuree(projet.metadonnees.duree_min, projet.metadonnees.duree_max)}</span>
            <span class="tag">${arrayToText(projet.metadonnees.lieu)}</span>
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

  async afterRender() {
    // Gérer les favoris
    document.querySelectorAll('.toggle-favori').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projetId = e.currentTarget.dataset.projetId;
        const isFavori = storageService.toggleFavori(projetId);

        e.currentTarget.textContent = isFavori ? '⭐' : '☆';
        e.currentTarget.title = isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';
      });
    });
  }
}
