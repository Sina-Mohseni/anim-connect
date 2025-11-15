# Anim'Connect

**Le carnet numérique de l'animateur pour les groupes maternelles et élémentaires (PS → CM2)**

Site web 100% front-end pour aider les animateurs en accueil et centre de loisirs à trouver, organiser et créer des projets d'animation.

---

## 🎯 Objectifs du projet

- Permettre aux animateurs de **trouver rapidement** des activités adaptées
- Proposer des **fiches structurées** (méthode PSAADRAFRA)
- Offrir des **démos interactives** pour visualiser les activités
- Faciliter la **planification** avec un planning personnel
- Permettre de **créer et exporter** ses propres fiches en PDF

---

## 🏗️ Architecture du projet

```
anim-connect/
│
├── index.html                 # Page d'accueil
├── README.md                  # Ce fichier
│
├── css/
│   ├── styles.css            # Styles globaux
│   ├── variables.css         # Variables CSS (couleurs, espacements)
│   ├── components.css        # Styles des composants réutilisables
│   └── responsive.css        # Media queries
│
├── js/
│   ├── app.js                # Point d'entrée de l'application
│   ├── router.js             # Gestion du routing côté client
│   │
│   ├── services/
│   │   ├── data-service.js   # Chargement des données JSON
│   │   └── storage-service.js # Gestion localStorage
│   │
│   ├── components/
│   │   ├── header.js         # Header / navigation
│   │   ├── footer.js         # Footer
│   │   ├── project-card.js   # Carte projet
│   │   ├── filter.js         # Filtres de recherche
│   │   └── modal.js          # Modales
│   │
│   ├── views/
│   │   ├── home.js           # Page d'accueil
│   │   ├── projects-list.js  # Liste des projets
│   │   ├── project-fiche.js  # Fiche détaillée d'un projet
│   │   ├── project-demo.js   # Démo/aventure IA d'un projet
│   │   ├── psaadrafra.js     # Page explicative PSAADRAFRA
│   │   ├── astuces.js        # Page astuces
│   │   ├── tutos.js          # Page tutos
│   │   ├── mode-urgence.js   # Mode urgence
│   │   ├── planning.js       # Planning/ma journée
│   │   ├── carnet.js         # Mon carnet (favoris/à tester)
│   │   ├── create-project.js # Créer un projet
│   │   └── about.js          # À propos/FAQ/Mentions légales
│   │
│   └── utils/
│       ├── pdf-export.js     # Génération PDF (html2pdf.js)
│       └── helpers.js        # Fonctions utilitaires
│
├── data/
│   ├── projets.json          # Base de données des projets
│   ├── astuces.json          # Base de données des astuces
│   ├── tutos.json            # Base de données des tutos
│   └── localStorage-structure.md # Doc structure localStorage
│
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── icons/
│   │   └── illustrations/
│   └── fonts/
│
└── lib/
    └── html2pdf.bundle.min.js # Librairie export PDF
```

---

## 📊 Modèles de données

### 1. **Projets** (`data/projets.json`)

Structure complète d'un projet d'animation :

```json
{
  "id": "proj_001",
  "titre": "Titre du projet",
  "slug": "titre-du-projet",
  "description_courte": "...",
  "description_longue": "...",

  "metadonnees": {
    "niveaux": ["PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2"],
    "duree_min": 30,
    "duree_max": 60,
    "nb_participants_min": 6,
    "nb_participants_max": 20,
    "lieu": ["exterieur", "interieur"],
    "moment_journee": ["matin", "apres-midi"],
    "saison": ["toutes"],
    "meteo": ["beau", "couvert", "pluie"]
  },

  "tags": {
    "energie": "moyen",
    "type_activite": ["cooperatif", "aventure", "reflexion"],
    "competences": ["orientation", "lecture", "logique"],
    "ambiance": ["calme", "dynamique"],
    "materiel_necessaire": "minimal"
  },

  "materiel": {
    "obligatoire": ["..."],
    "optionnel": ["..."],
    "cout": "gratuit"
  },

  "objectifs_pedagogiques": {
    "principaux": ["..."],
    "secondaires": ["..."]
  },

  "psaadrafra": {
    "presentation": { ... },
    "sensibilisation": { ... },
    "acquisition_savoirs": { ... },
    "appropriation": { ... },
    "diversification": { ... },
    "remediation": { ... },
    "approfondissement": { ... },
    "finalisation": { ... },
    "rangement": { ... },
    "reevaluation": { ... }
  },

  "astuces_animateur": [ ... ],

  "variantes_detaillees": {
    "maternelle": { ... },
    "elementaire_cp_ce1": { ... },
    "elementaire_ce2_plus": { ... }
  },

  "demo_aventure": {
    "type": "narrative_choice",
    "scenes": [ ... ]
  },

  "credits": { ... },
  "statut": { ... }
}
```

### 2. **Astuces** (`data/astuces.json`)

```json
{
  "id": "astuce_001",
  "titre": "...",
  "slug": "...",
  "categorie": "gestion_groupe",
  "niveaux": ["PS", "MS", "GS", ...],
  "contexte": "...",
  "problematique": "...",
  "solutions": ["..."],
  "conseils_application": ["..."],
  "erreurs_a_eviter": ["..."],
  "difficulte": "facile",
  "temps_mise_en_place_min": 5,
  "tags": ["..."]
}
```

### 3. **Tutos** (`data/tutos.json`)

```json
{
  "id": "tuto_001",
  "titre": "...",
  "slug": "...",
  "categorie": "methodologie",
  "description_courte": "...",
  "description_longue": "...",
  "niveau_difficulte": "débutant",
  "duree_lecture_min": 10,
  "objectifs_apprentissage": ["..."],
  "prerequis": ["..."],
  "contenu": {
    "introduction": "...",
    "sections": [
      {
        "titre": "...",
        "contenu": "...",
        "exemple": "..."
      }
    ]
  },
  "ressources_complementaires": [ ... ],
  "tags": ["..."]
}
```

### 4. **localStorage**

Voir `data/localStorage-structure.md` pour le détail complet.

Clés principales :
- `animconnect_favoris` : Liste des projets favoris
- `animconnect_a_tester` : Projets à tester
- `animconnect_planning` : Plannings/journées
- `animconnect_historique` : Projets réalisés avec notes
- `animconnect_preferences` : Préférences utilisateur
- `animconnect_projets_perso` : Projets créés par l'utilisateur

---

## 🎨 Design et UX

### Principes

- **Mobile first** : Interface pensée d'abord pour mobile
- **Responsive** : Adaptation tablette et desktop
- **Clarté** : Design épuré, lisible, professionnel mais chaleureux
- **Rapidité** : Un animateur doit trouver une activité en 3 clics max

### Palette de couleurs (à définir)

```css
:root {
  /* Couleurs principales */
  --primary-color: #3498db;      /* Bleu */
  --secondary-color: #2ecc71;    /* Vert */
  --accent-color: #f39c12;       /* Orange */

  /* Couleurs neutres */
  --bg-color: #f8f9fa;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;

  /* États */
  --success: #27ae60;
  --warning: #f39c12;
  --error: #e74c3c;
  --info: #3498db;

  /* Espacements */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* Typographie */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;
}
```

---

## 🚀 Pages et fonctionnalités

### Pages principales

1. **Accueil** (`/`)
   - Présentation d'Anim'Connect
   - 3 CTA principaux : Projets / Mode urgence / Créer un projet
   - Projets mis en avant

2. **Liste des projets** (`/projets`)
   - Affichage grille/liste
   - Filtres (niveaux, durée, lieu, type, matériel)
   - Tri (récent, alphabétique, durée, popularité)
   - Boutons : Fiche / Démo / Favoris

3. **Fiche projet** (`/projets/:id/fiche`)
   - Toutes les infos PSAADRAFRA
   - Astuces animateur
   - Variantes par niveau
   - Export PDF
   - Ajouter aux favoris / à tester

4. **Démo/Aventure** (`/projets/:id/demo`)
   - Interface narrative interactive
   - Choix multiples (préparation future IA)
   - Feedbacks pédagogiques

5. **PSAADRAFRA** (`/psaadrafra`)
   - Explication de la méthode
   - Modèles de fiches

6. **Astuces** (`/astuces`)
   - Liste d'astuces par catégories
   - Filtres par niveau/catégorie

7. **Tutos** (`/tutos`)
   - Liste de mini-formations
   - Lecture détaillée

8. **Mode urgence** (`/mode-urgence`)
   - Formulaire rapide (niveau, durée, lieu, matériel)
   - Suggestions immédiates

9. **Planning** (`/planning`)
   - Créer/modifier des journées
   - Ajouter des créneaux avec projets
   - Export/impression

10. **Mon carnet** (`/carnet`)
    - Favoris
    - À tester (avec notes)
    - Historique

11. **Créer un projet** (`/creer`)
    - Formulaire PSAADRAFRA
    - Aperçu temps réel
    - Export PDF

12. **À propos / FAQ / Mentions légales** (`/apropos`, `/faq`, `/mentions`)

---

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes (Grid, Flexbox, Custom Properties)
- **JavaScript ES6+** : Vanilla JS, pas de framework
- **localStorage** : Persistance des données utilisateur
- **html2pdf.js** : Génération de PDF côté client
- **JSON** : Base de données statique

---

## 📦 Installation et utilisation

### Prérequis

Aucun ! C'est du pur front-end.

### Lancement en local

1. Clone le dépôt :
```bash
git clone https://github.com/ton-compte/anim-connect.git
cd anim-connect
```

2. Ouvre `index.html` dans un navigateur

OU

Lance un serveur local (recommandé pour éviter les problèmes CORS avec JSON) :

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvre `http://localhost:8000`

---

## 🧩 Composants réutilisables

### Carte projet

```html
<div class="project-card" data-project-id="proj_001">
  <div class="project-card__header">
    <h3 class="project-card__title">Titre du projet</h3>
    <span class="project-card__badge">Coup de cœur</span>
  </div>
  <p class="project-card__description">Description courte...</p>
  <div class="project-card__meta">
    <span class="tag">PS-CE2</span>
    <span class="tag">30-60 min</span>
    <span class="tag">Extérieur</span>
  </div>
  <div class="project-card__actions">
    <button class="btn btn--primary">Fiche</button>
    <button class="btn btn--secondary">Démo</button>
    <button class="btn btn--icon" title="Ajouter aux favoris">⭐</button>
  </div>
</div>
```

### Filtres

```html
<div class="filters">
  <div class="filter-group">
    <label>Niveaux</label>
    <select multiple>
      <option value="PS">PS</option>
      <option value="MS">MS</option>
      <!-- ... -->
    </select>
  </div>
  <div class="filter-group">
    <label>Durée max (min)</label>
    <input type="range" min="10" max="120" step="10" value="60">
  </div>
  <!-- ... -->
</div>
```

---

## 🎯 Roadmap

### Phase 1 : MVP (Minimum Viable Product)
- [x] Modèles de données JSON
- [ ] Structure HTML/CSS de base
- [ ] Routing côté client
- [ ] Affichage des projets (liste + fiche)
- [ ] Système de filtres
- [ ] Gestion favoris en localStorage

### Phase 2 : Fonctionnalités avancées
- [ ] Démo/Aventure interactive
- [ ] Mode urgence
- [ ] Planning
- [ ] Export PDF
- [ ] Créer un projet

### Phase 3 : Optimisations
- [ ] Performance (lazy loading images)
- [ ] Accessibilité (ARIA, navigation clavier)
- [ ] PWA (manifest, service worker pour usage hors ligne)
- [ ] Thème sombre

### Phase 4 : Intégration IA (future)
- [ ] API pour générer des aventures dynamiques
- [ ] Suggestions personnalisées de projets
- [ ] Génération de variantes automatiques

---

## 🤝 Contribution

Pour l'instant, projet solo. Contributions futures bienvenues !

---

## 📄 Licence

À définir (probablement open source : MIT ou CC BY-SA)

---

## 👤 Auteur

Animateur expérience PS → CM2, passionné par l'animation et le développement web.

---

## 📞 Contact

À définir (email, réseaux sociaux)

---

**Anim'Connect** - Le carnet numérique de l'animateur 🎨🎭🎲
