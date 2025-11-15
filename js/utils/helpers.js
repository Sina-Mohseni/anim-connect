// Fonctions utilitaires

// Formater une durée en texte lisible
export function formatDuree(dureeMin, dureeMax) {
  if (dureeMin === dureeMax) {
    return `${dureeMin} min`;
  }
  return `${dureeMin}-${dureeMax} min`;
}

// Formater un nombre de participants
export function formatParticipants(min, max) {
  if (min === max) {
    return `${min} enfants`;
  }
  return `${min}-${max} enfants`;
}

// Formater une date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Formater une date courte
export function formatDateShort(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

// Échapper HTML pour éviter XSS
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Debounce une fonction
export function debounce(func, wait) {
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

// Générer un ID unique
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Tronquer un texte
export function truncate(text, maxLength, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - suffix.length) + suffix;
}

// Pluraliser un mot
export function pluralize(count, singular, plural = null) {
  if (count === 0 || count === 1) return singular;
  return plural || singular + 's';
}

// Obtenir le badge pour un niveau
export function getBadgeNiveau(niveau) {
  const badges = {
    'PS': { class: 'tag--primary', text: 'PS' },
    'MS': { class: 'tag--primary', text: 'MS' },
    'GS': { class: 'tag--primary', text: 'GS' },
    'CP': { class: 'tag--success', text: 'CP' },
    'CE1': { class: 'tag--success', text: 'CE1' },
    'CE2': { class: 'tag--success', text: 'CE2' },
    'CM1': { class: 'tag--warning', text: 'CM1' },
    'CM2': { class: 'tag--warning', text: 'CM2' }
  };

  return badges[niveau] || { class: '', text: niveau };
}

// Convertir un tableau en texte lisible
export function arrayToText(arr, separator = ', ', lastSeparator = ' et ') {
  if (!arr || arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr.join(lastSeparator);

  const lastItem = arr[arr.length - 1];
  const otherItems = arr.slice(0, -1);

  return otherItems.join(separator) + lastSeparator + lastItem;
}

// Scroller vers un élément
export function scrollToElement(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Afficher une notification toast
export function showToast(message, type = 'info', duration = 3000) {
  // Créer le toast s'il n'existe pas déjà un container
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `alert alert--${type}`;
  toast.style.cssText = `
    min-width: 250px;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Supprimer après la durée
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}

// Confirmer une action
export function confirm(message, onConfirm, onCancel = null) {
  const confirmed = window.confirm(message);
  if (confirmed && onConfirm) {
    onConfirm();
  } else if (!confirmed && onCancel) {
    onCancel();
  }
  return confirmed;
}

// Copier du texte dans le presse-papier
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copié dans le presse-papier !', 'success');
    return true;
  } catch (err) {
    console.error('Erreur copie:', err);
    showToast('Impossible de copier', 'error');
    return false;
  }
}

// Télécharger un fichier
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Ajouter des animations CSS si elles n'existent pas
export function addAnimationStyles() {
  if (document.getElementById('helper-animations')) return;

  const style = document.createElement('style');
  style.id = 'helper-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Initialiser les animations
addAnimationStyles();
