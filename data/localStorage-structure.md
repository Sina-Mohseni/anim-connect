# Structure localStorage pour Anim'Connect

Ce document définit la structure des données stockées en localStorage pour la gestion des favoris, planning et carnet personnel.

## Principes généraux

- **Clés localStorage** : Toutes préfixées par `animconnect_` pour éviter les conflits
- **Format** : JSON stringifié
- **Taille** : Garder léger (localStorage limité à ~5-10 MB selon navigateurs)
- **Rétrocompatibilité** : Gérer les versions pour futures migrations

## 1. Favoris (projets)

**Clé** : `animconnect_favoris`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "projets": ["proj_001", "proj_015", "proj_042"]
}
```

**Description** :
- `version` : Version du format de données (pour futures migrations)
- `dateUpdate` : Dernière modification (ISO 8601)
- `projets` : Array d'IDs de projets favoris

## 2. Liste "À tester"

**Clé** : `animconnect_a_tester`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "projets": [
    {
      "id": "proj_001",
      "dateAjout": "2025-01-10T14:20:00Z",
      "note": "Tester avec les MS-GS la semaine prochaine"
    },
    {
      "id": "proj_023",
      "dateAjout": "2025-01-12T09:15:00Z",
      "note": "Besoin d'acheter de la peinture avant"
    }
  ]
}
```

**Description** :
- `projets` : Array d'objets avec ID, date d'ajout et note optionnelle
- `note` : Texte libre pour se rappeler du contexte

## 3. Planning / Ma journée

**Clé** : `animconnect_planning`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "journees": [
    {
      "id": "journee_001",
      "titre": "Mercredi 17 janvier - Groupe MS-GS",
      "date": "2025-01-17",
      "niveaux": ["MS", "GS"],
      "nb_enfants": 15,
      "creneaux": [
        {
          "id": "creneau_001",
          "moment": "matin",
          "heure_debut": "09:00",
          "heure_fin": "10:00",
          "projet_id": "proj_001",
          "notes": "Prévoir de cacher les indices avant l'arrivée des enfants"
        },
        {
          "id": "creneau_002",
          "moment": "matin",
          "heure_debut": "10:30",
          "heure_fin": "11:30",
          "projet_id": "proj_042",
          "notes": ""
        },
        {
          "id": "creneau_003",
          "moment": "apres-midi",
          "heure_debut": "14:00",
          "heure_fin": "15:00",
          "projet_id": null,
          "activite_libre": "Temps calme - lecture",
          "notes": ""
        }
      ]
    },
    {
      "id": "journee_002",
      "titre": "Vendredi 19 janvier - Groupe CP-CE1",
      "date": "2025-01-19",
      "niveaux": ["CP", "CE1"],
      "nb_enfants": 18,
      "creneaux": []
    }
  ]
}
```

**Description** :
- `journees` : Array de journées planifiées
- `creneaux` : Slots horaires dans la journée
- `projet_id` : ID du projet planifié (null si activité libre)
- `activite_libre` : Texte libre si pas de projet du catalogue
- `notes` : Rappels/préparation pour l'animateur

## 4. Historique des projets réalisés

**Clé** : `animconnect_historique`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "projets_realises": [
    {
      "projet_id": "proj_001",
      "date_realisation": "2025-01-10",
      "niveaux": ["MS", "GS"],
      "nb_enfants": 12,
      "reussite": 4,
      "commentaire": "Super bien passé ! Les enfants ont adoré. Prévoir 5 indices au lieu de 4 la prochaine fois.",
      "photos": [],
      "a_refaire": true
    },
    {
      "projet_id": "proj_002",
      "date_realisation": "2025-01-11",
      "niveaux": ["PS"],
      "nb_enfants": 8,
      "reussite": 3,
      "commentaire": "Bien mais un peu long pour les PS. Réduire à 20 min.",
      "photos": [],
      "a_refaire": true
    }
  ]
}
```

**Description** :
- `reussite` : Note de 1 à 5 étoiles (facultatif)
- `commentaire` : Retour libre de l'animateur
- `a_refaire` : Boolean pour marquer les projets validés

## 5. Préférences utilisateur

**Clé** : `animconnect_preferences`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "niveaux_favoris": ["MS", "GS", "CP"],
  "type_activites_favoris": ["cooperatif", "creatif"],
  "filtres_par_defaut": {
    "duree_max": 60,
    "lieu": ["interieur", "exterieur"],
    "materiel": "minimal"
  },
  "affichage": {
    "mode": "grid",
    "tri": "recent"
  },
  "notifications": {
    "rappel_planning": true
  }
}
```

**Description** :
- Mémoriser les préférences de l'utilisateur pour pré-remplir les filtres
- `mode` : "grid" ou "list" pour l'affichage des projets
- `tri` : "recent", "alphabetique", "duree", "popularite"

## 6. Projets créés par l'utilisateur

**Clé** : `animconnect_projets_perso`

**Structure** :
```json
{
  "version": "1.0",
  "dateUpdate": "2025-01-15T10:30:00Z",
  "projets": [
    {
      "id": "perso_001",
      "titre": "Mon projet custom",
      "date_creation": "2025-01-15T10:30:00Z",
      "data": {
        "...": "Structure identique à projets.json, mais simplifiée"
      }
    }
  ]
}
```

**Description** :
- Stockage des projets créés via le formulaire "Créer un projet"
- Structure identique aux projets du catalogue
- Permettre export/import JSON

## Services JavaScript à implémenter

### `storage-service.js`

Ce service encapsule toutes les interactions avec localStorage :

```javascript
// Exemples de méthodes à implémenter

// Favoris
getFavoris()
addFavori(projetId)
removeFavori(projetId)
isFavori(projetId)

// À tester
getATester()
addATester(projetId, note)
removeATester(projetId)
updateNoteATester(projetId, note)

// Planning
getPlannings()
addJournee(journee)
updateJournee(journeeId, data)
deleteJournee(journeeId)
addCreneau(journeeId, creneau)
updateCreneau(journeeId, creneauId, data)
deleteCreneau(journeeId, creneauId)

// Historique
getHistorique()
addProjetRealise(data)
updateProjetRealise(id, data)

// Préférences
getPreferences()
updatePreferences(data)

// Projets perso
getProjetsPerso()
addProjetPerso(projet)
updateProjetPerso(id, data)
deleteProjetPerso(id)

// Utilitaires
exportAllData() // Export JSON complet
importAllData(jsonData) // Import JSON
clearAllData() // Reset complet
```

## Gestion des erreurs

- Vérifier que localStorage est disponible (mode privé Safari peut bloquer)
- Gérer les quotas dépassés
- Valider les données avant stringify/parse
- Avoir des fallbacks en cas d'erreur

```javascript
// Exemple de détection
function isLocalStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

## Migration de versions

Si la structure évolue, gérer les migrations :

```javascript
function migrateData(key, oldVersion, newVersion) {
  // Logique de migration selon les versions
  // Ex: v1.0 → v1.1 : ajout d'un champ
}
```

## Sécurité et vie privée

- **Pas de données sensibles** : Pas de noms d'enfants, pas de photos identifiables
- **Local uniquement** : Aucune synchronisation cloud
- **Export volontaire** : L'utilisateur peut exporter ses données
- **Suppression facile** : Bouton "Tout effacer" dans les paramètres
