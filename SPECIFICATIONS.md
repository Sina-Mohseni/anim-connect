# Spécifications techniques détaillées - Anim'Connect

Ce document complète le README et fournit des détails d'implémentation pour chaque fonctionnalité.

---

## 🎯 Spécifications fonctionnelles

### 1. Routing côté client

**Objectif** : Navigation sans rechargement de page (SPA - Single Page Application)

**Implémentation** :
- Utiliser l'API `History` (pushState, popstate)
- Router basique avec correspondance URL → Vue

**Exemple de structure** :

```javascript
// router.js
const routes = {
  '/': 'home',
  '/projets': 'projects-list',
  '/projets/:id/fiche': 'project-fiche',
  '/projets/:id/demo': 'project-demo',
  '/psaadrafra': 'psaadrafra',
  '/astuces': 'astuces',
  '/tutos': 'tutos',
  '/mode-urgence': 'mode-urgence',
  '/planning': 'planning',
  '/carnet': 'carnet',
  '/creer': 'create-project',
  '/apropos': 'about',
  '/faq': 'faq',
  '/mentions': 'mentions'
};

function router() {
  const path = window.location.pathname;
  const view = matchRoute(path);
  renderView(view);
}

window.addEventListener('popstate', router);
```

---

### 2. Service de données (`data-service.js`)

**Objectif** : Centraliser le chargement et l'accès aux données JSON

**Méthodes principales** :

```javascript
class DataService {
  constructor() {
    this.projets = null;
    this.astuces = null;
    this.tutos = null;
  }

  async loadAllData() {
    // Charge tous les JSON en parallèle
    const [projets, astuces, tutos] = await Promise.all([
      fetch('/data/projets.json').then(r => r.json()),
      fetch('/data/astuces.json').then(r => r.json()),
      fetch('/data/tutos.json').then(r => r.json())
    ]);

    this.projets = projets.projets;
    this.astuces = astuces.astuces;
    this.tutos = tutos.tutos;
  }

  getProjetById(id) {
    return this.projets.find(p => p.id === id);
  }

  getProjetBySlug(slug) {
    return this.projets.find(p => p.slug === slug);
  }

  filterProjets(filters) {
    // Logique de filtrage
    return this.projets.filter(projet => {
      // Niveaux
      if (filters.niveaux && filters.niveaux.length > 0) {
        const hasCommonNiveau = projet.metadonnees.niveaux.some(n =>
          filters.niveaux.includes(n)
        );
        if (!hasCommonNiveau) return false;
      }

      // Durée max
      if (filters.duree_max) {
        if (projet.metadonnees.duree_min > filters.duree_max) return false;
      }

      // Lieu
      if (filters.lieu && filters.lieu.length > 0) {
        const hasCommonLieu = projet.metadonnees.lieu.some(l =>
          filters.lieu.includes(l)
        );
        if (!hasCommonLieu) return false;
      }

      // Type d'activité
      if (filters.type_activite && filters.type_activite.length > 0) {
        const hasCommonType = projet.tags.type_activite.some(t =>
          filters.type_activite.includes(t)
        );
        if (!hasCommonType) return false;
      }

      // Matériel
      if (filters.materiel_necessaire) {
        if (projet.tags.materiel_necessaire !== filters.materiel_necessaire) {
          return false;
        }
      }

      return true;
    });
  }

  searchProjets(query) {
    const lowerQuery = query.toLowerCase();
    return this.projets.filter(p =>
      p.titre.toLowerCase().includes(lowerQuery) ||
      p.description_courte.toLowerCase().includes(lowerQuery) ||
      p.tags.type_activite.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  getProjetsMisEnAvant() {
    return this.projets.filter(p => p.statut.mis_en_avant);
  }

  // Méthodes similaires pour astuces et tutos
  getAstucesByCategorie(categorie) { ... }
  getTutosByCategorie(categorie) { ... }
}

// Export singleton
export const dataService = new DataService();
```

---

### 3. Service de stockage (`storage-service.js`)

**Objectif** : Gérer localStorage de manière propre et robuste

```javascript
class StorageService {
  constructor() {
    this.prefix = 'animconnect_';
    this.version = '1.0';
  }

  // Vérifier disponibilité localStorage
  isAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Méthodes génériques
  _getItem(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Erreur lecture localStorage:', e);
      return null;
    }
  }

  _setItem(key, value) {
    try {
      const data = {
        version: this.version,
        dateUpdate: new Date().toISOString(),
        ...value
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Erreur écriture localStorage:', e);
      return false;
    }
  }

  // === FAVORIS ===
  getFavoris() {
    const data = this._getItem('favoris');
    return data ? data.projets : [];
  }

  addFavori(projetId) {
    const favoris = this.getFavoris();
    if (!favoris.includes(projetId)) {
      favoris.push(projetId);
      this._setItem('favoris', { projets: favoris });
    }
  }

  removeFavori(projetId) {
    const favoris = this.getFavoris();
    const newFavoris = favoris.filter(id => id !== projetId);
    this._setItem('favoris', { projets: newFavoris });
  }

  isFavori(projetId) {
    return this.getFavoris().includes(projetId);
  }

  // === À TESTER ===
  getATester() {
    const data = this._getItem('a_tester');
    return data ? data.projets : [];
  }

  addATester(projetId, note = '') {
    const liste = this.getATester();
    if (!liste.find(p => p.id === projetId)) {
      liste.push({
        id: projetId,
        dateAjout: new Date().toISOString(),
        note: note
      });
      this._setItem('a_tester', { projets: liste });
    }
  }

  removeATester(projetId) {
    const liste = this.getATester();
    const newListe = liste.filter(p => p.id !== projetId);
    this._setItem('a_tester', { projets: newListe });
  }

  updateNoteATester(projetId, note) {
    const liste = this.getATester();
    const projet = liste.find(p => p.id === projetId);
    if (projet) {
      projet.note = note;
      this._setItem('a_tester', { projets: liste });
    }
  }

  // === PLANNING ===
  getPlannings() {
    const data = this._getItem('planning');
    return data ? data.journees : [];
  }

  addJournee(journee) {
    const plannings = this.getPlannings();
    journee.id = 'journee_' + Date.now();
    plannings.push(journee);
    this._setItem('planning', { journees: plannings });
    return journee.id;
  }

  updateJournee(journeeId, updates) {
    const plannings = this.getPlannings();
    const index = plannings.findIndex(j => j.id === journeeId);
    if (index !== -1) {
      plannings[index] = { ...plannings[index], ...updates };
      this._setItem('planning', { journees: plannings });
    }
  }

  deleteJournee(journeeId) {
    const plannings = this.getPlannings();
    const newPlannings = plannings.filter(j => j.id !== journeeId);
    this._setItem('planning', { journees: newPlannings });
  }

  addCreneau(journeeId, creneau) {
    const plannings = this.getPlannings();
    const journee = plannings.find(j => j.id === journeeId);
    if (journee) {
      creneau.id = 'creneau_' + Date.now();
      journee.creneaux.push(creneau);
      this._setItem('planning', { journees: plannings });
      return creneau.id;
    }
  }

  // === HISTORIQUE ===
  getHistorique() {
    const data = this._getItem('historique');
    return data ? data.projets_realises : [];
  }

  addProjetRealise(projet) {
    const historique = this.getHistorique();
    historique.unshift(projet); // Ajoute en début de liste
    this._setItem('historique', { projets_realises: historique });
  }

  // === PRÉFÉRENCES ===
  getPreferences() {
    const data = this._getItem('preferences');
    return data || {
      niveaux_favoris: [],
      type_activites_favoris: [],
      filtres_par_defaut: {},
      affichage: { mode: 'grid', tri: 'recent' }
    };
  }

  updatePreferences(updates) {
    const prefs = this.getPreferences();
    const newPrefs = { ...prefs, ...updates };
    this._setItem('preferences', newPrefs);
  }

  // === PROJETS PERSO ===
  getProjetsPerso() {
    const data = this._getItem('projets_perso');
    return data ? data.projets : [];
  }

  addProjetPerso(projet) {
    const projets = this.getProjetsPerso();
    projet.id = 'perso_' + Date.now();
    projet.date_creation = new Date().toISOString();
    projets.push(projet);
    this._setItem('projets_perso', { projets: projets });
    return projet.id;
  }

  // === UTILITAIRES ===
  exportAllData() {
    const allData = {};
    const keys = ['favoris', 'a_tester', 'planning', 'historique', 'preferences', 'projets_perso'];
    keys.forEach(key => {
      allData[key] = this._getItem(key);
    });
    return JSON.stringify(allData, null, 2);
  }

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach(key => {
        this._setItem(key, data[key]);
      });
      return true;
    } catch (e) {
      console.error('Erreur import:', e);
      return false;
    }
  }

  clearAllData() {
    const keys = ['favoris', 'a_tester', 'planning', 'historique', 'preferences', 'projets_perso'];
    keys.forEach(key => {
      localStorage.removeItem(this.prefix + key);
    });
  }
}

export const storageService = new StorageService();
```

---

### 4. Génération PDF (`pdf-export.js`)

**Objectif** : Exporter les fiches projets en PDF

**Solution 1 : html2pdf.js** (recommandée)

```javascript
import html2pdf from '/lib/html2pdf.bundle.min.js';

export function exportFicheToPDF(projetId, projet) {
  // Créer un conteneur HTML structuré pour le PDF
  const element = document.createElement('div');
  element.className = 'pdf-container';
  element.innerHTML = `
    <div class="pdf-header">
      <h1>${projet.titre}</h1>
      <p class="pdf-meta">${projet.metadonnees.niveaux.join(', ')} | ${projet.metadonnees.duree_min}-${projet.metadonnees.duree_max} min</p>
    </div>

    <div class="pdf-section">
      <h2>Description</h2>
      <p>${projet.description_longue}</p>
    </div>

    <div class="pdf-section">
      <h2>Objectifs pédagogiques</h2>
      <ul>
        ${projet.objectifs_pedagogiques.principaux.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>

    <div class="pdf-section">
      <h2>Matériel nécessaire</h2>
      <ul>
        ${projet.materiel.obligatoire.map(m => `<li>${m}</li>`).join('')}
      </ul>
    </div>

    <div class="pdf-section">
      <h2>Déroulé PSAADRAFRA</h2>
      ${renderPSAADRAFRA(projet.psaadrafra)}
    </div>

    <div class="pdf-section">
      <h2>Astuces animateur</h2>
      ${projet.astuces_animateur.map(a => `
        <div class="astuce">
          <strong>${a.titre}</strong>
          <p>${a.conseil}</p>
        </div>
      `).join('')}
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `${projet.slug}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

function renderPSAADRAFRA(psaadrafra) {
  const sections = [
    { key: 'presentation', label: 'Présentation' },
    { key: 'sensibilisation', label: 'Sensibilisation' },
    { key: 'acquisition_savoirs', label: 'Acquisition de savoirs' },
    { key: 'appropriation', label: 'Appropriation' },
    { key: 'diversification', label: 'Diversification' },
    { key: 'remediation', label: 'Remédiation' },
    { key: 'approfondissement', label: 'Approfondissement' },
    { key: 'finalisation', label: 'Finalisation' },
    { key: 'rangement', label: 'Rangement' },
    { key: 'reevaluation', label: 'Réévaluation' }
  ];

  return sections.map(s => {
    const data = psaadrafra[s.key];
    return `
      <div class="psaadrafra-section">
        <h3>${s.label}</h3>
        <div class="psaadrafra-content">
          ${JSON.stringify(data, null, 2)}
        </div>
      </div>
    `;
  }).join('');
}
```

**Solution 2 : Impression navigateur + CSS print**

```css
/* styles.css */
@media print {
  /* Cacher navigation, footer, boutons */
  header, footer, .btn, .filters {
    display: none !important;
  }

  /* Optimiser pour l'impression */
  body {
    font-size: 12pt;
    color: black;
    background: white;
  }

  .project-fiche {
    max-width: 100%;
  }

  /* Éviter les coupures de page au milieu d'une section */
  .psaadrafra-section {
    page-break-inside: avoid;
  }

  /* Forcer saut de page avant certaines sections */
  .psaadrafra-section:first-of-type {
    page-break-before: always;
  }
}
```

```javascript
export function printFiche() {
  window.print();
}
```

---

### 5. Démo/Aventure interactive

**Objectif** : Système narratif avec choix (préparation IA)

**Structure de scène** :

```javascript
class DemoPlayer {
  constructor(demoData) {
    this.scenes = demoData.scenes;
    this.currentSceneId = this.scenes[0].id;
    this.history = [];
  }

  getCurrentScene() {
    return this.scenes.find(s => s.id === this.currentSceneId);
  }

  makeChoice(choiceId) {
    const scene = this.getCurrentScene();
    const choice = scene.choix.find(c => c.id === choiceId);

    if (choice) {
      this.history.push({
        sceneId: this.currentSceneId,
        choiceId: choiceId,
        feedback: choice.feedback
      });

      this.currentSceneId = choice.scene_suivante;
      return choice;
    }
  }

  render() {
    const scene = this.getCurrentScene();
    return `
      <div class="demo-scene">
        <h2>${scene.titre}</h2>
        <p class="demo-text">${scene.texte}</p>

        ${scene.choix.length > 0 ? `
          <div class="demo-choices">
            ${scene.choix.map(c => `
              <button class="demo-choice-btn" data-choice-id="${c.id}">
                ${c.texte}
              </button>
            `).join('')}
          </div>
        ` : `
          <div class="demo-end">
            <h3>Fin de la démo !</h3>
            ${scene.conseils_finaux ? `
              <ul>
                ${scene.conseils_finaux.map(c => `<li>${c}</li>`).join('')}
              </ul>
            ` : ''}
            <button class="btn btn--primary" onclick="window.location.href='/projets'">
              Retour aux projets
            </button>
          </div>
        `}
      </div>
    `;
  }
}

// Utilisation
const player = new DemoPlayer(projet.demo_aventure);
document.getElementById('demo-container').innerHTML = player.render();

// Event listener sur les choix
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('demo-choice-btn')) {
    const choiceId = e.target.dataset.choiceId;
    const choice = player.makeChoice(choiceId);

    // Afficher feedback
    showFeedback(choice.feedback);

    // Afficher scène suivante
    setTimeout(() => {
      document.getElementById('demo-container').innerHTML = player.render();
    }, 2000);
  }
});
```

---

### 6. Mode urgence

**Objectif** : Trouver rapidement une activité adaptée

**Interface** :

```html
<form id="mode-urgence-form">
  <h1>Mode urgence 🚨</h1>
  <p>Réponds à quelques questions, on te trouve une activité !</p>

  <div class="form-group">
    <label>Niveaux présents :</label>
    <div class="checkbox-group">
      <label><input type="checkbox" name="niveaux" value="PS"> PS</label>
      <label><input type="checkbox" name="niveaux" value="MS"> MS</label>
      <!-- ... -->
    </div>
  </div>

  <div class="form-group">
    <label>Durée disponible (min) :</label>
    <select name="duree">
      <option value="15">15 min</option>
      <option value="30">30 min</option>
      <option value="45">45 min</option>
      <option value="60">1h</option>
    </select>
  </div>

  <div class="form-group">
    <label>Lieu :</label>
    <select name="lieu">
      <option value="interieur">Intérieur</option>
      <option value="exterieur">Extérieur</option>
      <option value="mixte">Peu importe</option>
    </select>
  </div>

  <div class="form-group">
    <label>Matériel disponible :</label>
    <select name="materiel">
      <option value="aucun">Aucun (juste moi et les enfants)</option>
      <option value="minimal">Minimal (papier, crayons)</option>
      <option value="moyen">Moyen (jouets, ballons...)</option>
      <option value="complet">Complet</option>
    </select>
  </div>

  <button type="submit" class="btn btn--primary btn--large">
    Trouve-moi une activité !
  </button>
</form>

<div id="urgence-results" style="display:none;">
  <!-- Résultats ici -->
</div>
```

**Logique** :

```javascript
document.getElementById('mode-urgence-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const filters = {
    niveaux: formData.getAll('niveaux'),
    duree_max: parseInt(formData.get('duree')),
    lieu: formData.get('lieu') === 'mixte' ? null : [formData.get('lieu')],
    materiel_necessaire: formData.get('materiel')
  };

  // Filtrer projets
  let results = dataService.filterProjets(filters);

  // Trier par pertinence (priorité : sans matériel, courte durée)
  results.sort((a, b) => {
    if (a.tags.materiel_necessaire === 'aucun' && b.tags.materiel_necessaire !== 'aucun') return -1;
    if (a.metadonnees.duree_min < b.metadonnees.duree_min) return -1;
    return 0;
  });

  // Afficher 3 meilleurs résultats
  displayUrgenceResults(results.slice(0, 3));
});
```

---

### 7. Responsive Design

**Breakpoints** :

```css
/* Mobile first */
:root {
  --container-width: 100%;
  --grid-columns: 1;
}

/* Tablette */
@media (min-width: 768px) {
  :root {
    --container-width: 720px;
    --grid-columns: 2;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --container-width: 960px;
    --grid-columns: 3;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  :root {
    --container-width: 1200px;
    --grid-columns: 4;
  }
}

/* Grille responsive */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--spacing-md);
}
```

---

## 🔒 Sécurité et bonnes pratiques

### 1. Validation des données

```javascript
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Lors de l'affichage de contenu utilisateur
element.innerHTML = sanitizeHTML(userInput);
```

### 2. Gestion des erreurs

```javascript
async function loadData() {
  try {
    await dataService.loadAllData();
  } catch (error) {
    console.error('Erreur chargement données:', error);
    displayErrorMessage('Impossible de charger les données. Vérifiez votre connexion.');
  }
}
```

### 3. Performance

- **Lazy loading images** : Charger images au scroll
- **Debouncing** sur recherche/filtres
- **Virtual scrolling** si liste très longue (>100 items)

```javascript
// Debounce pour search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
  performSearch(e.target.value);
}, 300));
```

---

## 🎨 Accessibilité (A11y)

### Checklist

- ✅ Sémantique HTML correcte (h1→h6, nav, main, article...)
- ✅ Attributs ARIA où nécessaire
- ✅ Contraste texte/fond suffisant (WCAG AA minimum)
- ✅ Navigation au clavier (Tab, Enter, Esc)
- ✅ Focus visible
- ✅ Textes alternatifs sur images
- ✅ Labels sur formulaires
- ✅ Messages d'erreur clairs

### Exemples

```html
<!-- Bouton accessible -->
<button
  class="btn-icon"
  aria-label="Ajouter aux favoris"
  title="Ajouter aux favoris"
>
  ⭐
</button>

<!-- Modal accessible -->
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <h2 id="modal-title">Titre de la modale</h2>
  <!-- ... -->
</div>

<!-- Navigation clavier -->
<nav role="navigation" aria-label="Navigation principale">
  <ul>
    <li><a href="/" tabindex="0">Accueil</a></li>
    <!-- ... -->
  </ul>
</nav>
```

---

## 🚀 Optimisations futures

### PWA (Progressive Web App)

Permettre usage hors ligne :

1. **manifest.json** :
```json
{
  "name": "Anim'Connect",
  "short_name": "AnimConnect",
  "description": "Carnet numérique de l'animateur",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3498db",
  "icons": [
    {
      "src": "/assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Service Worker** :
```javascript
// sw.js
const CACHE_NAME = 'animconnect-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/app.js',
  '/data/projets.json',
  '/data/astuces.json',
  '/data/tutos.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

## 📊 Analytics (optionnel et respectueux)

Si besoin de stats d'usage :

- **Plausible** ou **Matomo** (respectueux vie privée, RGPD friendly)
- Tracker : pages vues, projets populaires, filtres utilisés
- **JAMAIS** : tracker nominatif, cookies tiers, revente données

---

**Fin des spécifications techniques**

Ces specs sont vivantes et seront complétées au fur et à mesure du développement.
