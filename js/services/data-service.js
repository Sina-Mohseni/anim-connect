// Service de gestion des données (projets, astuces, tutos)

class DataService {
  constructor() {
    this.projets = [];
    this.astuces = [];
    this.tutos = [];
    this.loaded = false;
  }

  // Charger toutes les données
  async loadAll() {
    if (this.loaded) return;

    try {
      const [projetsData, astucesData, tutosData] = await Promise.all([
        fetch('./data/projets.json').then(r => r.json()),
        fetch('./data/astuces.json').then(r => r.json()),
        fetch('./data/tutos.json').then(r => r.json())
      ]);

      this.projets = projetsData.projets || [];
      this.astuces = astucesData.astuces || [];
      this.tutos = tutosData.tutos || [];
      this.loaded = true;

      console.log('Données chargées:', {
        projets: this.projets.length,
        astuces: this.astuces.length,
        tutos: this.tutos.length
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
      throw error;
    }
  }

  // === PROJETS ===

  getAllProjets() {
    return this.projets;
  }

  getProjetById(id) {
    return this.projets.find(p => p.id === id);
  }

  getProjetBySlug(slug) {
    return this.projets.find(p => p.slug === slug);
  }

  getProjetsMisEnAvant() {
    return this.projets.filter(p => p.statut?.mis_en_avant);
  }

  filterProjets(filters = {}) {
    return this.projets.filter(projet => {
      // Filtrer par niveaux
      if (filters.niveaux && filters.niveaux.length > 0) {
        const hasCommonNiveau = projet.metadonnees.niveaux.some(n =>
          filters.niveaux.includes(n)
        );
        if (!hasCommonNiveau) return false;
      }

      // Filtrer par durée max
      if (filters.duree_max) {
        if (projet.metadonnees.duree_min > filters.duree_max) return false;
      }

      // Filtrer par lieu
      if (filters.lieu && filters.lieu.length > 0) {
        const hasCommonLieu = projet.metadonnees.lieu.some(l =>
          filters.lieu.includes(l)
        );
        if (!hasCommonLieu) return false;
      }

      // Filtrer par type d'activité
      if (filters.type_activite && filters.type_activite.length > 0) {
        const hasCommonType = projet.tags.type_activite.some(t =>
          filters.type_activite.includes(t)
        );
        if (!hasCommonType) return false;
      }

      // Filtrer par matériel
      if (filters.materiel) {
        const materielValue = {
          'aucun': 0,
          'minimal': 1,
          'moyen': 2,
          'complet': 3
        };

        const projetMateriel = materielValue[projet.tags.materiel_necessaire] || 1;
        const filterMateriel = materielValue[filters.materiel] || 3;

        if (projetMateriel > filterMateriel) return false;
      }

      // Filtrer par météo
      if (filters.meteo && filters.meteo.length > 0) {
        const hasCommonMeteo = projet.metadonnees.meteo.some(m =>
          filters.meteo.includes(m) || projet.metadonnees.meteo.includes('toutes')
        );
        if (!hasCommonMeteo) return false;
      }

      return true;
    });
  }

  searchProjets(query) {
    if (!query || query.trim() === '') return this.projets;

    const lowerQuery = query.toLowerCase().trim();

    return this.projets.filter(p =>
      p.titre.toLowerCase().includes(lowerQuery) ||
      p.description_courte.toLowerCase().includes(lowerQuery) ||
      p.description_longue.toLowerCase().includes(lowerQuery) ||
      p.tags.type_activite.some(t => t.toLowerCase().includes(lowerQuery)) ||
      p.tags.competences.some(c => c.toLowerCase().includes(lowerQuery))
    );
  }

  sortProjets(projets, sortBy = 'recent') {
    const sorted = [...projets];

    switch (sortBy) {
      case 'alphabetique':
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));

      case 'duree_asc':
        return sorted.sort((a, b) => a.metadonnees.duree_min - b.metadonnees.duree_min);

      case 'duree_desc':
        return sorted.sort((a, b) => b.metadonnees.duree_min - a.metadonnees.duree_min);

      case 'recent':
      default:
        return sorted.reverse(); // Inverse l'ordre (les derniers en premier)
    }
  }

  // === ASTUCES ===

  getAllAstuces() {
    return this.astuces;
  }

  getAstuceById(id) {
    return this.astuces.find(a => a.id === id);
  }

  getAstucesByCategorie(categorie) {
    return this.astuces.filter(a => a.categorie === categorie);
  }

  filterAstuces(filters = {}) {
    return this.astuces.filter(astuce => {
      // Filtrer par catégorie
      if (filters.categorie && astuce.categorie !== filters.categorie) {
        return false;
      }

      // Filtrer par niveaux
      if (filters.niveaux && filters.niveaux.length > 0) {
        const hasCommonNiveau = astuce.niveaux.some(n =>
          filters.niveaux.includes(n)
        );
        if (!hasCommonNiveau) return false;
      }

      // Filtrer par difficulté
      if (filters.difficulte && astuce.difficulte !== filters.difficulte) {
        return false;
      }

      return true;
    });
  }

  // === TUTOS ===

  getAllTutos() {
    return this.tutos;
  }

  getTutoById(id) {
    return this.tutos.find(t => t.id === id);
  }

  getTutoBySlug(slug) {
    return this.tutos.find(t => t.slug === slug);
  }

  getTutosByCategorie(categorie) {
    return this.tutos.filter(t => t.categorie === categorie);
  }

  filterTutos(filters = {}) {
    return this.tutos.filter(tuto => {
      // Filtrer par catégorie
      if (filters.categorie && tuto.categorie !== filters.categorie) {
        return false;
      }

      // Filtrer par niveau de difficulté
      if (filters.niveau_difficulte && tuto.niveau_difficulte !== filters.niveau_difficulte) {
        return false;
      }

      return true;
    });
  }
}

// Export singleton
const dataService = new DataService();
export default dataService;
