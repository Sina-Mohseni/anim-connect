// Service de gestion du localStorage

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
      console.warn('localStorage non disponible:', e);
      return false;
    }
  }

  // Méthodes génériques privées
  _getItem(key) {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Erreur lecture localStorage:', e);
      return null;
    }
  }

  _setItem(key, value) {
    if (!this.isAvailable()) return false;

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
      if (e.name === 'QuotaExceededError') {
        alert('Espace de stockage local plein. Veuillez effacer des données.');
      }
      return false;
    }
  }

  // === FAVORIS ===

  getFavoris() {
    const data = this._getItem('favoris');
    return data?.projets || [];
  }

  addFavori(projetId) {
    const favoris = this.getFavoris();
    if (!favoris.includes(projetId)) {
      favoris.push(projetId);
      this._setItem('favoris', { projets: favoris });
      return true;
    }
    return false;
  }

  removeFavori(projetId) {
    const favoris = this.getFavoris();
    const newFavoris = favoris.filter(id => id !== projetId);
    this._setItem('favoris', { projets: newFavoris });
    return true;
  }

  isFavori(projetId) {
    return this.getFavoris().includes(projetId);
  }

  toggleFavori(projetId) {
    if (this.isFavori(projetId)) {
      this.removeFavori(projetId);
      return false;
    } else {
      this.addFavori(projetId);
      return true;
    }
  }

  // === À TESTER ===

  getATester() {
    const data = this._getItem('a_tester');
    return data?.projets || [];
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
      return true;
    }
    return false;
  }

  removeATester(projetId) {
    const liste = this.getATester();
    const newListe = liste.filter(p => p.id !== projetId);
    this._setItem('a_tester', { projets: newListe });
    return true;
  }

  updateNoteATester(projetId, note) {
    const liste = this.getATester();
    const projet = liste.find(p => p.id === projetId);
    if (projet) {
      projet.note = note;
      this._setItem('a_tester', { projets: liste });
      return true;
    }
    return false;
  }

  isATester(projetId) {
    return this.getATester().some(p => p.id === projetId);
  }

  // === PLANNING ===

  getPlannings() {
    const data = this._getItem('planning');
    return data?.journees || [];
  }

  addJournee(journee) {
    const plannings = this.getPlannings();
    journee.id = 'journee_' + Date.now();
    journee.creneaux = journee.creneaux || [];
    plannings.push(journee);
    this._setItem('planning', { journees: plannings });
    return journee.id;
  }

  getJournee(journeeId) {
    const plannings = this.getPlannings();
    return plannings.find(j => j.id === journeeId);
  }

  updateJournee(journeeId, updates) {
    const plannings = this.getPlannings();
    const index = plannings.findIndex(j => j.id === journeeId);
    if (index !== -1) {
      plannings[index] = { ...plannings[index], ...updates };
      this._setItem('planning', { journees: plannings });
      return true;
    }
    return false;
  }

  deleteJournee(journeeId) {
    const plannings = this.getPlannings();
    const newPlannings = plannings.filter(j => j.id !== journeeId);
    this._setItem('planning', { journees: newPlannings });
    return true;
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
    return null;
  }

  updateCreneau(journeeId, creneauId, updates) {
    const plannings = this.getPlannings();
    const journee = plannings.find(j => j.id === journeeId);
    if (journee) {
      const index = journee.creneaux.findIndex(c => c.id === creneauId);
      if (index !== -1) {
        journee.creneaux[index] = { ...journee.creneaux[index], ...updates };
        this._setItem('planning', { journees: plannings });
        return true;
      }
    }
    return false;
  }

  deleteCreneau(journeeId, creneauId) {
    const plannings = this.getPlannings();
    const journee = plannings.find(j => j.id === journeeId);
    if (journee) {
      journee.creneaux = journee.creneaux.filter(c => c.id !== creneauId);
      this._setItem('planning', { journees: plannings });
      return true;
    }
    return false;
  }

  // === HISTORIQUE ===

  getHistorique() {
    const data = this._getItem('historique');
    return data?.projets_realises || [];
  }

  addProjetRealise(projet) {
    const historique = this.getHistorique();
    projet.id = 'realisation_' + Date.now();
    historique.unshift(projet); // Ajoute en début
    this._setItem('historique', { projets_realises: historique });
    return projet.id;
  }

  updateProjetRealise(id, updates) {
    const historique = this.getHistorique();
    const index = historique.findIndex(p => p.id === id);
    if (index !== -1) {
      historique[index] = { ...historique[index], ...updates };
      this._setItem('historique', { projets_realises: historique });
      return true;
    }
    return false;
  }

  deleteProjetRealise(id) {
    const historique = this.getHistorique();
    const newHistorique = historique.filter(p => p.id !== id);
    this._setItem('historique', { projets_realises: newHistorique });
    return true;
  }

  // === PRÉFÉRENCES ===

  getPreferences() {
    const data = this._getItem('preferences');
    return data || {
      niveaux_favoris: [],
      type_activites_favoris: [],
      filtres_par_defaut: {},
      affichage: { mode: 'grid', tri: 'recent' },
      notifications: { rappel_planning: true }
    };
  }

  updatePreferences(updates) {
    const prefs = this.getPreferences();
    const newPrefs = { ...prefs, ...updates };
    this._setItem('preferences', newPrefs);
    return true;
  }

  // === PROJETS PERSO ===

  getProjetsPerso() {
    const data = this._getItem('projets_perso');
    return data?.projets || [];
  }

  addProjetPerso(projet) {
    const projets = this.getProjetsPerso();
    projet.id = 'perso_' + Date.now();
    projet.date_creation = new Date().toISOString();
    projets.push(projet);
    this._setItem('projets_perso', { projets: projets });
    return projet.id;
  }

  getProjetPerso(id) {
    const projets = this.getProjetsPerso();
    return projets.find(p => p.id === id);
  }

  updateProjetPerso(id, updates) {
    const projets = this.getProjetsPerso();
    const index = projets.findIndex(p => p.id === id);
    if (index !== -1) {
      projets[index] = { ...projets[index], ...updates };
      this._setItem('projets_perso', { projets: projets });
      return true;
    }
    return false;
  }

  deleteProjetPerso(id) {
    const projets = this.getProjetsPerso();
    const newProjets = projets.filter(p => p.id !== id);
    this._setItem('projets_perso', { projets: newProjets });
    return true;
  }

  // === UTILITAIRES ===

  exportAllData() {
    const allData = {};
    const keys = ['favoris', 'a_tester', 'planning', 'historique', 'preferences', 'projets_perso'];

    keys.forEach(key => {
      const data = this._getItem(key);
      if (data) {
        allData[key] = data;
      }
    });

    return JSON.stringify(allData, null, 2);
  }

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      let imported = 0;

      Object.keys(data).forEach(key => {
        if (this._setItem(key, data[key])) {
          imported++;
        }
      });

      return { success: true, imported };
    } catch (e) {
      console.error('Erreur import:', e);
      return { success: false, error: e.message };
    }
  }

  clearAllData() {
    const keys = ['favoris', 'a_tester', 'planning', 'historique', 'preferences', 'projets_perso'];

    keys.forEach(key => {
      localStorage.removeItem(this.prefix + key);
    });

    return true;
  }

  // Obtenir la taille utilisée (approximative)
  getStorageSize() {
    if (!this.isAvailable()) return 0;

    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        total += localStorage[key].length + key.length;
      }
    }

    return total; // en caractères
  }

  getStorageSizeFormatted() {
    const bytes = this.getStorageSize() * 2; // approximation UTF-16
    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb > 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb > 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${bytes} bytes`;
    }
  }
}

// Export singleton
const storageService = new StorageService();
export default storageService;
