// Router simple pour SPA (Single Page Application)

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
  }

  // Initialiser le router
  init() {
    // Gérer les clics sur les liens avec data-link
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
        e.preventDefault();
        const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
        const path = link.getAttribute('href');
        this.navigate(path);
      }
    });

    // Gérer le bouton précédent/suivant du navigateur
    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.pathname);
    });

    // Charger la route initiale
    this.loadRoute(window.location.pathname);
  }

  // Naviguer vers une route
  navigate(path) {
    window.history.pushState({}, '', path);
    this.loadRoute(path);
  }

  // Charger une route
  async loadRoute(path) {
    // Trouver la route correspondante
    const route = this.matchRoute(path);

    if (!route) {
      console.error('Route not found:', path);
      this.loadRoute('/404');
      return;
    }

    // Sauvegarder la route actuelle
    this.currentRoute = route;

    // Mettre à jour le titre de la page
    document.title = route.title || 'Anim\'Connect';

    // Charger et afficher la vue
    try {
      const view = await route.view(route.params);
      await this.render(view);
    } catch (error) {
      console.error('Error loading view:', error);
      document.getElementById('app').innerHTML = `
        <div class="container">
          <div class="alert alert--error">
            <strong>Erreur</strong> Impossible de charger la page.
          </div>
        </div>
      `;
    }
  }

  // Trouver la route correspondant au path
  matchRoute(path) {
    // Nettoyer le path (enlever trailing slash sauf pour /)
    const cleanPath = path === '/' ? path : path.replace(/\/$/, '');

    // Chercher une correspondance exacte
    for (const [routePath, routeConfig] of Object.entries(this.routes)) {
      // Route exacte
      if (routePath === cleanPath) {
        return { ...routeConfig, params: {} };
      }

      // Route avec paramètres (ex: /projets/:id/fiche)
      const routeRegex = this.pathToRegex(routePath);
      const match = cleanPath.match(routeRegex);

      if (match) {
        const params = this.extractParams(routePath, match);
        return { ...routeConfig, params };
      }
    }

    return null;
  }

  // Convertir un path avec params en regex
  pathToRegex(path) {
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^/]+)');
    return new RegExp(`^${pattern}$`);
  }

  // Extraire les paramètres d'une route
  extractParams(routePath, match) {
    const paramNames = [];
    const regex = /:(\w+)/g;
    let result;

    while ((result = regex.exec(routePath)) !== null) {
      paramNames.push(result[1]);
    }

    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  }

  // Rendre la vue dans #app
  async render(view) {
    const app = document.getElementById('app');

    // Afficher la vue
    app.innerHTML = await view.render();

    // Appeler le afterRender si défini
    if (view.afterRender) {
      await view.afterRender();
    }

    // Scroller en haut de la page
    window.scrollTo(0, 0);
  }

  // Obtenir les paramètres de la route actuelle
  getParams() {
    return this.currentRoute?.params || {};
  }

  // Obtenir le path actuel
  getCurrentPath() {
    return window.location.pathname;
  }
}

export default Router;
