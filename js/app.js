// Application principale Anim'Connect

import Router from './router.js';
import dataService from './services/data-service.js';
import storageService from './services/storage-service.js';

// Import des vues
import HomeView from './views/home.js';
import ProjectsListView from './views/projects-list.js';
import ProjectFicheView from './views/project-fiche.js';

// Définition des routes
const routes = {
  '/': {
    title: 'Accueil - Anim\'Connect',
    view: async () => new HomeView()
  },

  '/projets': {
    title: 'Projets - Anim\'Connect',
    view: async () => new ProjectsListView()
  },

  '/projets/:id/fiche': {
    title: 'Fiche projet - Anim\'Connect',
    view: async (params) => new ProjectFicheView(params)
  },

  '/projets/:id/demo': {
    title: 'Démo - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <div class="alert alert--info">
              <strong>Démo interactive</strong><br>
              Cette fonctionnalité sera bientôt disponible !
            </div>
            <a href="/projets" data-link class="btn btn--primary">Retour aux projets</a>
          </div>
        `
      };
    }
  },

  '/psaadrafra': {
    title: 'PSAADRAFRA - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>La méthode PSAADRAFRA</h1>
            <div class="card">
              <div class="card__body">
                <p class="text-large">
                  PSAADRAFRA est un acronyme pour structurer une activité d'animation de A à Z.
                </p>

                <h3>Les 10 étapes :</h3>
                <ol>
                  <li><strong>P</strong>résentation - Introduire l'activité</li>
                  <li><strong>S</strong>ensibilisation - Éveiller la curiosité</li>
                  <li><strong>A</strong>cquisition de savoirs - Transmettre les règles/techniques</li>
                  <li><strong>A</strong>ppropriation - Les enfants pratiquent</li>
                  <li><strong>D</strong>iversification - Adapter selon les niveaux</li>
                  <li><strong>R</strong>emédiation - Gérer les difficultés</li>
                  <li><strong>A</strong>pprofondissement - Aller plus loin</li>
                  <li><strong>F</strong>inalisation - Conclure l'activité</li>
                  <li><strong>R</strong>angement - Ranger ensemble</li>
                  <li><strong>A</strong> (réévaluation) - Bilan et retour</li>
                </ol>

                <p class="mt-lg">
                  <strong>💡 Astuce :</strong> Toutes les fiches projets sur Anim'Connect suivent cette structure pour t'aider à animer de manière complète et pédagogique.
                </p>
              </div>
            </div>

            <div class="text-center mt-xl">
              <a href="/projets" data-link class="btn btn--primary">Voir les projets</a>
              <a href="/tutos" data-link class="btn btn--secondary">Lire les tutos</a>
            </div>
          </div>
        `
      };
    }
  },

  '/astuces': {
    title: 'Astuces - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>Astuces d'animation</h1>
            <p class="text-large text-muted mb-xl">
              ${dataService.getAllAstuces().length} astuces disponibles
            </p>

            <div class="grid">
              ${dataService.getAllAstuces().map(astuce => `
                <div class="card">
                  <div class="card__header">
                    <h3 class="card__title">${astuce.titre}</h3>
                    <span class="tag">${astuce.difficulte}</span>
                  </div>
                  <div class="card__body">
                    <p class="text-small text-muted mb-sm">
                      <strong>Contexte :</strong> ${astuce.contexte}
                    </p>
                    <p class="text-small">
                      <strong>Problématique :</strong> ${astuce.problematique}
                    </p>
                    <p class="text-small mt-md">
                      <strong>Solutions :</strong>
                    </p>
                    <ul class="text-small">
                      ${astuce.solutions.slice(0, 2).map(s => `<li>${s}</li>`).join('')}
                      ${astuce.solutions.length > 2 ? '<li><em>+ plus...</em></li>' : ''}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      };
    }
  },

  '/tutos': {
    title: 'Tutos - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>Tutos & Mini-formations</h1>
            <p class="text-large text-muted mb-xl">
              ${dataService.getAllTutos().length} tutos disponibles
            </p>

            <div class="grid grid-2">
              ${dataService.getAllTutos().map(tuto => `
                <div class="card">
                  <div class="card__header">
                    <h3 class="card__title">${tuto.titre}</h3>
                    <span class="tag tag--${tuto.niveau_difficulte === 'débutant' ? 'success' : 'warning'}">
                      ${tuto.niveau_difficulte}
                    </span>
                  </div>
                  <div class="card__body">
                    <p>${tuto.description_courte}</p>
                    <p class="text-small text-muted mt-md">
                      ⏱️ ${tuto.duree_lecture_min} min de lecture
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      };
    }
  },

  '/mode-urgence': {
    title: 'Mode urgence - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <div class="hero" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
              <h1 class="hero__title">🚨 Mode urgence</h1>
              <p class="hero__subtitle">Trouve une activité en 2 minutes chrono</p>
            </div>

            <div class="card">
              <div class="card__body">
                <p class="text-large text-center mb-xl">
                  Cette fonctionnalité sera bientôt disponible ! <br>
                  Elle te permettra de filtrer ultra-rapidement selon tes besoins immédiats.
                </p>
                <div class="text-center">
                  <a href="/projets" data-link class="btn btn--primary btn--large">
                    En attendant, explore les projets
                  </a>
                </div>
              </div>
            </div>
          </div>
        `
      };
    }
  },

  '/planning': {
    title: 'Planning - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>📅 Mon planning</h1>
            <div class="alert alert--info">
              <strong>Fonctionnalité à venir</strong><br>
              Tu pourras bientôt créer et gérer tes plannings de journée/semaine.
            </div>
            <a href="/" data-link class="btn btn--primary">Retour à l'accueil</a>
          </div>
        `
      };
    }
  },

  '/carnet': {
    title: 'Mon carnet - Anim\'Connect',
    view: async () => {
      const favoris = storageService.getFavoris();
      const aTester = storageService.getATester();

      return {
        render: async () => `
          <div class="container">
            <h1>📖 Mon carnet</h1>

            <section class="section">
              <h2>⭐ Mes favoris (${favoris.length})</h2>

              ${favoris.length > 0 ? `
                <div class="grid">
                  ${favoris.map(id => {
                    const projet = dataService.getProjetById(id);
                    if (!projet) return '';
                    return `
                      <div class="card">
                        <div class="card__header">
                          <h3 class="card__title">${projet.titre}</h3>
                        </div>
                        <div class="card__body">
                          <p class="text-small">${projet.description_courte}</p>
                        </div>
                        <div class="card__actions">
                          <a href="/projets/${projet.id}/fiche" data-link class="btn btn--primary btn--small">
                            Voir la fiche
                          </a>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div class="empty-state">
                  <p class="empty-state__icon">☆</p>
                  <p class="empty-state__message">Aucun favori pour l'instant</p>
                  <a href="/projets" data-link class="btn btn--primary">Explorer les projets</a>
                </div>
              `}
            </section>

            <section class="section">
              <h2>📝 À tester (${aTester.length})</h2>

              ${aTester.length > 0 ? `
                <div class="grid">
                  ${aTester.map(item => {
                    const projet = dataService.getProjetById(item.id);
                    if (!projet) return '';
                    return `
                      <div class="card">
                        <div class="card__header">
                          <h3 class="card__title">${projet.titre}</h3>
                        </div>
                        <div class="card__body">
                          <p class="text-small">${projet.description_courte}</p>
                          ${item.note ? `<p class="text-small mt-sm"><strong>Note :</strong> ${item.note}</p>` : ''}
                        </div>
                        <div class="card__actions">
                          <a href="/projets/${projet.id}/fiche" data-link class="btn btn--primary btn--small">
                            Voir la fiche
                          </a>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div class="empty-state">
                  <p class="empty-state__icon">📝</p>
                  <p class="empty-state__message">Aucun projet à tester</p>
                  <a href="/projets" data-link class="btn btn--primary">Explorer les projets</a>
                </div>
              `}
            </section>
          </div>
        `
      };
    }
  },

  '/creer': {
    title: 'Créer un projet - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>✏️ Créer un projet</h1>
            <div class="alert alert--info">
              <strong>Fonctionnalité à venir</strong><br>
              Tu pourras bientôt créer tes propres fiches projet et les exporter en PDF.
            </div>
            <a href="/" data-link class="btn btn--primary">Retour à l'accueil</a>
          </div>
        `
      };
    }
  },

  '/apropos': {
    title: 'À propos - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>À propos d'Anim'Connect</h1>
            <div class="card">
              <div class="card__body">
                <p class="text-large">
                  Anim'Connect est un outil gratuit créé par et pour les animateurs
                  en accueil et centre de loisirs.
                </p>

                <h3>Pourquoi ce projet ?</h3>
                <p>
                  En tant qu'animateur, j'ai souvent cherché des activités exploitables rapidement,
                  avec des fiches claires et structurées. Anim'Connect est né de ce besoin.
                </p>

                <h3>100% gratuit, 100% local</h3>
                <ul>
                  <li>Pas d'inscription nécessaire</li>
                  <li>Tes données restent sur ton appareil (localStorage)</li>
                  <li>Pas de publicité, pas de tracking</li>
                  <li>Open source (bientôt disponible sur GitHub)</li>
                </ul>

                <h3>Contact</h3>
                <p>
                  Pour toute question, suggestion ou contribution : <strong>[email à définir]</strong>
                </p>
              </div>
            </div>
          </div>
        `
      };
    }
  },

  '/faq': {
    title: 'FAQ - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>Questions fréquentes (FAQ)</h1>

            <div class="card mb-md">
              <div class="card__body">
                <h3>C'est vraiment gratuit ?</h3>
                <p>Oui, 100% gratuit. Aucun compte, aucun abonnement.</p>
              </div>
            </div>

            <div class="card mb-md">
              <div class="card__body">
                <h3>Mes données sont-elles sauvegardées ?</h3>
                <p>
                  Oui, localement sur ton appareil via localStorage.
                  Tes favoris, planning, etc. restent sur ton navigateur.
                </p>
              </div>
            </div>

            <div class="card mb-md">
              <div class="card__body">
                <h3>Puis-je utiliser Anim'Connect hors ligne ?</h3>
                <p>Bientôt ! Une version PWA (Progressive Web App) est prévue.</p>
              </div>
            </div>

            <div class="card mb-md">
              <div class="card__body">
                <h3>Puis-je proposer mes propres projets ?</h3>
                <p>
                  La fonctionnalité "Créer un projet" est en cours de développement.
                  Tu pourras créer et exporter tes propres fiches.
                </p>
              </div>
            </div>
          </div>
        `
      };
    }
  },

  '/mentions': {
    title: 'Mentions légales - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <h1>Mentions légales</h1>
            <div class="card">
              <div class="card__body">
                <h3>Éditeur du site</h3>
                <p>Anim'Connect - Projet personnel</p>

                <h3>Hébergement</h3>
                <p>GitHub Pages (ou autre - à définir)</p>

                <h3>Données personnelles</h3>
                <p>
                  Aucune donnée personnelle n'est collectée par Anim'Connect.
                  Toutes les données utilisateur sont stockées localement sur votre appareil.
                </p>

                <h3>Cookies</h3>
                <p>Aucun cookie n'est utilisé sur ce site.</p>

                <h3>Propriété intellectuelle</h3>
                <p>
                  Les contenus (fiches projets, astuces, tutos) sont proposés sous licence
                  Creative Commons (à définir).
                </p>
              </div>
            </div>
          </div>
        `
      };
    }
  },

  '/404': {
    title: 'Page non trouvée - Anim\'Connect',
    view: async () => {
      return {
        render: async () => `
          <div class="container">
            <div class="empty-state">
              <div class="empty-state__icon">🤔</div>
              <h1 class="empty-state__title">404 - Page non trouvée</h1>
              <p class="empty-state__message">
                Oups ! Cette page n'existe pas ou plus.
              </p>
              <a href="/" data-link class="btn btn--primary btn--large">
                Retour à l'accueil
              </a>
            </div>
          </div>
        `
      };
    }
  }
};

// Initialisation de l'application
class App {
  constructor() {
    this.router = new Router(routes);
  }

  async init() {
    try {
      // Afficher le loader
      this.showLoader();

      // Charger les données
      await dataService.loadAll();

      // Initialiser le router
      this.router.init();

      // Initialiser le menu mobile
      this.initMobileMenu();

      // Gérer les actions footer
      this.initFooterActions();

      console.log('✅ Anim\'Connect initialisé !');
    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      document.getElementById('app').innerHTML = `
        <div class="container">
          <div class="alert alert--error">
            <strong>Erreur</strong> Impossible de charger l'application.
            Veuillez recharger la page.
          </div>
        </div>
      `;
    }
  }

  showLoader() {
    // Le loader est déjà dans le HTML, il s'affichera automatiquement
  }

  initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });

      // Fermer le menu au clic sur un lien
      nav.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
        });
      });
    }
  }

  initFooterActions() {
    // Export données
    document.getElementById('export-data')?.addEventListener('click', (e) => {
      e.preventDefault();
      const data = storageService.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `animconnect-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Effacer données
    document.getElementById('clear-data')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Êtes-vous sûr de vouloir effacer toutes vos données locales (favoris, planning, etc.) ?')) {
        storageService.clearAllData();
        alert('Données effacées !');
        location.reload();
      }
    });
  }
}

// Démarrer l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
