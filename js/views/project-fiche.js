// Vue : Fiche détaillée d'un projet

import dataService from '../services/data-service.js';
import storageService from '../services/storage-service.js';
import { formatDuree, formatParticipants, arrayToText, showToast } from '../utils/helpers.js';

export default class ProjectFicheView {
  constructor(params) {
    this.projetId = params.id;
    this.projet = null;
  }

  async render() {
    // Récupérer le projet
    this.projet = dataService.getProjetById(this.projetId);

    if (!this.projet) {
      return `
        <div class="container">
          <div class="alert alert--error">
            <strong>Erreur</strong> Projet non trouvé
          </div>
          <a href="/projets" data-link class="btn btn--primary">Retour aux projets</a>
        </div>
      `;
    }

    const isFavori = storageService.isFavori(this.projet.id);
    const isATester = storageService.isATester(this.projet.id);

    return `
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a href="/" data-link class="breadcrumb__item">Accueil</a>
          <span class="breadcrumb__separator">›</span>
          <a href="/projets" data-link class="breadcrumb__item">Projets</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__item breadcrumb__item--active">${this.projet.titre}</span>
        </nav>

        <!-- En-tête -->
        <div class="hero">
          <h1 class="hero__title">${this.projet.titre}</h1>
          <p class="hero__subtitle">${this.projet.description_longue}</p>

          <div class="hero__actions">
            <a href="/projets/${this.projet.id}/demo" data-link class="btn btn--accent btn--large">
              🎮 Essayer la démo
            </a>
            <button class="btn btn--outline btn--large" id="export-pdf">
              📄 Exporter en PDF
            </button>
          </div>
        </div>

        <!-- Actions rapides -->
        <div style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); flex-wrap: wrap;">
          <button
            class="btn ${isFavori ? 'btn--primary' : 'btn--outline'}"
            id="toggle-favori"
          >
            ${isFavori ? '⭐ Dans mes favoris' : '☆ Ajouter aux favoris'}
          </button>
          <button
            class="btn ${isATester ? 'btn--secondary' : 'btn--outline'}"
            id="toggle-a-tester"
          >
            ${isATester ? '✅ À tester' : '📝 Ajouter à ma liste à tester'}
          </button>
          <button class="btn btn--outline" id="add-to-planning">
            📅 Ajouter au planning
          </button>
        </div>

        <!-- Métadonnées -->
        <div class="card mb-xl">
          <div class="card__body">
            <h2>Informations pratiques</h2>

            <div class="grid grid-3">
              <div>
                <strong>Niveaux :</strong><br>
                ${this.projet.metadonnees.niveaux.map(n => `<span class="tag tag--primary">${n}</span>`).join(' ')}
              </div>

              <div>
                <strong>Durée :</strong><br>
                ${formatDuree(this.projet.metadonnees.duree_min, this.projet.metadonnees.duree_max)}
              </div>

              <div>
                <strong>Participants :</strong><br>
                ${formatParticipants(this.projet.metadonnees.nb_participants_min, this.projet.metadonnees.nb_participants_max)}
              </div>

              <div>
                <strong>Lieu :</strong><br>
                ${arrayToText(this.projet.metadonnees.lieu)}
              </div>

              <div>
                <strong>Moment :</strong><br>
                ${arrayToText(this.projet.metadonnees.moment_journee)}
              </div>

              <div>
                <strong>Matériel :</strong><br>
                ${this.projet.tags.materiel_necessaire}
              </div>
            </div>
          </div>
        </div>

        <!-- Objectifs pédagogiques -->
        <div class="card mb-xl">
          <div class="card__body">
            <h2>🎯 Objectifs pédagogiques</h2>

            <h4>Principaux :</h4>
            <ul>
              ${this.projet.objectifs_pedagogiques.principaux.map(o => `<li>${o}</li>`).join('')}
            </ul>

            <h4>Secondaires :</h4>
            <ul>
              ${this.projet.objectifs_pedagogiques.secondaires.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Matériel -->
        <div class="card mb-xl">
          <div class="card__body">
            <h2>🎒 Matériel nécessaire</h2>

            <h4>Obligatoire :</h4>
            <ul>
              ${this.projet.materiel.obligatoire.map(m => `<li>${m}</li>`).join('')}
            </ul>

            ${this.projet.materiel.optionnel.length > 0 ? `
              <h4>Optionnel :</h4>
              <ul>
                ${this.projet.materiel.optionnel.map(m => `<li>${m}</li>`).join('')}
              </ul>
            ` : ''}

            <p><strong>Coût :</strong> ${this.projet.materiel.cout}</p>
          </div>
        </div>

        <!-- Déroulé PSAADRAFRA -->
        <div class="card mb-xl">
          <div class="card__body">
            <h2>📋 Déroulé PSAADRAFRA</h2>
            ${this.renderPSAADRAFRA()}
          </div>
        </div>

        <!-- Astuces animateur -->
        ${this.projet.astuces_animateur && this.projet.astuces_animateur.length > 0 ? `
          <div class="card mb-xl">
            <div class="card__body">
              <h2>💡 Astuces d'animateur</h2>
              ${this.projet.astuces_animateur.map(a => `
                <div class="alert alert--info">
                  <strong>${a.titre}</strong><br>
                  ${a.conseil}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Variantes -->
        ${this.renderVariantes()}

        <!-- Navigation -->
        <div class="text-center mt-xl">
          <a href="/projets" data-link class="btn btn--primary">
            ← Retour à la liste des projets
          </a>
        </div>
      </div>
    `;
  }

  renderPSAADRAFRA() {
    const sections = [
      { key: 'presentation', label: 'P - Présentation', icon: '👋' },
      { key: 'sensibilisation', label: 'S - Sensibilisation', icon: '💭' },
      { key: 'acquisition_savoirs', label: 'A - Acquisition de savoirs', icon: '📚' },
      { key: 'appropriation', label: 'A - Appropriation', icon: '🎯' },
      { key: 'diversification', label: 'D - Diversification', icon: '🔀' },
      { key: 'remediation', label: 'R - Remédiation', icon: '🛠️' },
      { key: 'approfondissement', label: 'A - Approfondissement', icon: '➕' },
      { key: 'finalisation', label: 'F - Finalisation', icon: '🎊' },
      { key: 'rangement', label: 'R - Rangement', icon: '🧹' },
      { key: 'reevaluation', label: 'A - Réévaluation', icon: '📊' }
    ];

    return sections.map(section => {
      const data = this.projet.psaadrafra[section.key];
      if (!data) return '';

      return `
        <div class="mb-lg" style="border-left: 4px solid var(--primary-color); padding-left: var(--spacing-md);">
          <h3>${section.icon} ${section.label}</h3>
          ${this.renderSectionContent(data)}
        </div>
      `;
    }).join('');
  }

  renderSectionContent(data) {
    let html = '';

    for (let [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 0) {
        html += `<p><strong>${key} :</strong></p><ul>`;
        value.forEach(item => {
          if (typeof item === 'string') {
            html += `<li>${item}</li>`;
          } else {
            html += `<li>${JSON.stringify(item)}</li>`;
          }
        });
        html += `</ul>`;
      } else if (typeof value === 'string') {
        html += `<p><strong>${key} :</strong> ${value}</p>`;
      } else if (typeof value === 'number') {
        html += `<p><strong>${key} :</strong> ${value} min</p>`;
      } else if (typeof value === 'boolean') {
        html += `<p><strong>${key} :</strong> ${value ? 'Oui' : 'Non'}</p>`;
      }
    }

    return html || '<p>-</p>';
  }

  renderVariantes() {
    if (!this.projet.variantes_detaillees) return '';

    return `
      <div class="card mb-xl">
        <div class="card__body">
          <h2>🔀 Variantes par niveau</h2>

          ${this.projet.variantes_detaillees.maternelle ? `
            <div class="mb-lg">
              <h3>Maternelle (${this.projet.variantes_detaillees.maternelle.niveaux.join(', ')})</h3>
              <ul>
                ${this.projet.variantes_detaillees.maternelle.adaptations.map(a => `<li>${a}</li>`).join('')}
              </ul>
              ${this.projet.variantes_detaillees.maternelle.exemple_indice ? `
                <p><strong>Exemple d'indice :</strong> ${this.projet.variantes_detaillees.maternelle.exemple_indice}</p>
              ` : ''}
            </div>
          ` : ''}

          ${this.projet.variantes_detaillees.elementaire_cp_ce1 ? `
            <div class="mb-lg">
              <h3>Élémentaire CP-CE1 (${this.projet.variantes_detaillees.elementaire_cp_ce1.niveaux.join(', ')})</h3>
              <ul>
                ${this.projet.variantes_detaillees.elementaire_cp_ce1.adaptations.map(a => `<li>${a}</li>`).join('')}
              </ul>
              ${this.projet.variantes_detaillees.elementaire_cp_ce1.exemple_indice ? `
                <p><strong>Exemple d'indice :</strong> ${this.projet.variantes_detaillees.elementaire_cp_ce1.exemple_indice}</p>
              ` : ''}
            </div>
          ` : ''}

          ${this.projet.variantes_detaillees.elementaire_ce2_plus ? `
            <div class="mb-lg">
              <h3>Élémentaire CE2+ (${this.projet.variantes_detaillees.elementaire_ce2_plus.niveaux.join(', ')})</h3>
              <ul>
                ${this.projet.variantes_detaillees.elementaire_ce2_plus.adaptations.map(a => `<li>${a}</li>`).join('')}
              </ul>
              ${this.projet.variantes_detaillees.elementaire_ce2_plus.exemple_indice ? `
                <p><strong>Exemple d'indice :</strong> ${this.projet.variantes_detaillees.elementaire_ce2_plus.exemple_indice}</p>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Toggle favori
    document.getElementById('toggle-favori')?.addEventListener('click', () => {
      const isFavori = storageService.toggleFavori(this.projet.id);
      const btn = document.getElementById('toggle-favori');
      btn.textContent = isFavori ? '⭐ Dans mes favoris' : '☆ Ajouter aux favoris';
      btn.className = isFavori ? 'btn btn--primary' : 'btn btn--outline';
      showToast(isFavori ? 'Ajouté aux favoris' : 'Retiré des favoris', 'success');
    });

    // Toggle à tester
    document.getElementById('toggle-a-tester')?.addEventListener('click', () => {
      const isATester = storageService.isATester(this.projet.id);
      if (isATester) {
        storageService.removeATester(this.projet.id);
        const btn = document.getElementById('toggle-a-tester');
        btn.textContent = '📝 Ajouter à ma liste à tester';
        btn.className = 'btn btn--outline';
        showToast('Retiré de la liste à tester', 'success');
      } else {
        storageService.addATester(this.projet.id);
        const btn = document.getElementById('toggle-a-tester');
        btn.textContent = '✅ À tester';
        btn.className = 'btn btn--secondary';
        showToast('Ajouté à la liste à tester', 'success');
      }
    });

    // Export PDF (simulé pour l'instant)
    document.getElementById('export-pdf')?.addEventListener('click', () => {
      showToast('Export PDF : Fonctionnalité à venir !', 'info');
      window.print();
    });

    // Ajouter au planning (simulé)
    document.getElementById('add-to-planning')?.addEventListener('click', () => {
      showToast('Fonctionnalité "Ajouter au planning" à venir !', 'info');
    });
  }
}
