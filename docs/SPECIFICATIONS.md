# 📋 Spécifications Détaillées - Suivi des Dépenses

## PHASE 1 : MVP - Gestion de Base des Dépenses

### Feature 1.1 : Ajouter une Dépense

**Description** : Permettre à l'utilisateur d'enregistrer rapidement une nouvelle dépense

**Champs obligatoires** :
- Montant (nombre décimal, > 0)
- Catégorie (dropdown / select)
- Date (date picker, par défaut aujourd'hui)

**Champs optionnels** :
- Description (text input)
- Tags personnalisés

**Règles de validation** :
- Montant : doit être un nombre positif
- Catégorie : doit être sélectionnée
- Date : ne peut pas être dans le futur

**Comportement** :
- Après soumission : notification de succès
- Réinitialiser le formulaire
- Ajouter la dépense à la liste immédiatement (optimistic update)

**API Endpoint** :
```
POST /api/expenses
Body: {
  amount: number,
  category: string,
  date: ISO string,
  description?: string,
  tags?: string[]
}
Response: { id, createdAt, ... }
```

---

### Feature 1.2 : Afficher la Liste des Dépenses

**Description** : Afficher toutes les dépenses avec options de tri et filtrage

**Affichage** :
- Tableau ou liste avec colonnes :
  - Date
  - Description
  - Catégorie (avec icône/couleur)
  - Montant
  - Actions (modifier, supprimer)

**Tri** :
- Par défaut : date décroissante (plus récentes d'abord)
- Options : par montant, par catégorie, par date

**Pagination** :
- 10-20 dépenses par page
- Boutons/chiffres de navigation

**Affichage mobile** :
- Version simplifiée (moins de colonnes)
- Cartes au lieu de tableau

**API Endpoint** :
```
GET /api/expenses?sort=date&page=1&limit=20
Response: {
  items: [...],
  total: number,
  page: number,
  pages: number
}
```

---

### Feature 1.3 : Modifier une Dépense

**Description** : Mettre à jour les détails d'une dépense existante

**Fonctionnement** :
- Clic sur "Modifier" → formulaire pré-rempli
- Champs modifiables : montant, catégorie, date, description
- Boutons : Enregistrer, Annuler
- Confirmation avant suppression

**API Endpoint** :
```
PUT /api/expenses/:id
Body: { amount, category, date, description }
Response: { id, updatedAt, ... }
```

---

### Feature 1.4 : Supprimer une Dépense

**Description** : Supprimer une dépense de la base de données

**Fonctionnement** :
- Clic bouton supprimer
- Dialogue de confirmation
- Après suppression : notification et rafraîchissement

**API Endpoint** :
```
DELETE /api/expenses/:id
Response: { success: true }
```

---

## PHASE 2 : Budgétisation

### Feature 2.1 : Créer/Modifier Budget par Catégorie

**Description** : Fixer une limite de dépense mensuelle pour chaque catégorie

**Champs** :
- Catégorie (select, une seule par budget)
- Montant limite (nombre positif)
- Mois/Année (par défaut mois courant)
- Description (optionnel)

**Règles** :
- Un seul budget par catégorie par mois
- Modification possible jusqu'à fin du mois
- Validation : montant > 0

**API Endpoints** :
```
POST /api/budgets
Body: { category, limit, month, year }

PUT /api/budgets/:id
Body: { limit, month }

GET /api/budgets?month=2024-07
Response: [{ category, limit, spent, remaining }, ...]
```

---

### Feature 2.2 : Affichage Budget vs Dépensé

**Description** : Afficher visuellement le budget et les dépenses réelles

**Affichage par catégorie** :
- Nom catégorie | Budget | Dépensé | Restant | % utilisé
- Barre de progression :
  - Vert : 0-50% budget utilisé
  - Orange : 50-90% budget utilisé
  - Rouge : 90-100%+ budget dépassé

**Summary** :
- Total budget mensuel
- Total dépensé
- Total restant
- Dashboard overview

---

### Feature 2.3 : Alertes Budget

**Description** : Notifier l'utilisateur quand approche des limites

**Conditions** :
- Alerte à 80% du budget
- Alerte à 100% (dépassement)
- Toast notification
- Enregistrement dans historique

**Implémentation** :
- Vérification lors de chaque ajout de dépense
- Affichage badge/indicateur sur la catégorie

---

## PHASE 3 : Objectifs d'Épargne

### Feature 3.1 : Créer un Objectif d'Épargne

**Description** : Créer un objectif pour économiser une certaine somme

**Champs** :
- Nom de l'objectif (string, ex: "Vacances")
- Montant cible (nombre positif)
- Montant actuellement épargné (par défaut 0)
- Date limite (optionnel)
- Description/Notes

**Règles** :
- Montant cible > montant épargné
- Date limite optionnelle
- Calcul automatique : mois restants, montant/mois à économiser

**API Endpoint** :
```
POST /api/goals
Body: {
  name: string,
  targetAmount: number,
  savedAmount: number,
  deadline?: ISO date,
  description?: string
}
```

---

### Feature 3.2 : Afficher les Objectifs

**Description** : Lister tous les objectifs avec progression

**Affichage** :
- Cartes pour chaque objectif :
  - Nom & description
  - Barre de progression (savedAmount / targetAmount)
  - Montant restant
  - Jours restants (si deadline)
  - Montant/mois à économiser (si deadline)
  - Boutons : Éditer, Supprimer, Marquer comme atteint

**Filtres** :
- Actifs / Complétés / Tous
- Tri : par deadline, par progression

---

### Feature 3.3 : Mettre à Jour la Progression

**Description** : Augmenter le montant épargné pour un objectif

**Fonctionnement** :
- Clic bouton "Ajouter épargne"
- Modal/formulaire : montant à ajouter
- Confirmation & notification
- Mise à jour automatique de la barre de progression

**API Endpoint** :
```
PUT /api/goals/:id
Body: { savedAmount }
```

---

## PHASE 4 : Statistiques & Analyses

### Feature 4.1 : Graphique Dépenses par Catégorie

**Description** : Afficher un graphique (pie/donut) des dépenses par catégorie

**Données** :
- Mois courant ou période sélectionnée
- Chaque catégorie = part du gâteau
- Couleurs distinctes par catégorie
- Affichage du % et montant en hover

**Interactivité** :
- Clic sur tranche = filter dépenses de cette catégorie
- Legend pour afficher/masquer catégories

---

### Feature 4.2 : Graphique Évolution des Dépenses

**Description** : Courbe montrant l'évolution des dépenses sur le temps

**Données** :
- Axe X : jours/semaines/mois
- Axe Y : montant total dépensé
- Ligne courbe montrant la tendance
- Points de données interactifs

**Options** :
- Vue : jour, semaine, mois, année
- Afficher total cumulé ou quotidien

---

### Feature 4.3 : Statistiques Générales

**Description** : Afficher des métriques clés sur les dépenses

**Métriques à calculer** :
- Dépense totale (période)
- Dépense moyenne par jour/semaine/mois
- Catégorie avec plus de dépenses
- Catégorie avec moins de dépenses
- Plus grosse dépense du mois
- Nombre de dépenses enregistrées

**Affichage** :
- Cartes avec icônes et valeurs
- Tendances (↑ ou ↓)
- Comparaisons (vs mois précédent, vs objectif)

---

## PHASE 5 : Améliorations & Confort

### Feature 5.1 : Dépenses Récurrentes

**Description** : Créer des dépenses qui se répètent automatiquement

**Types de récurrence** :
- Quotidienne
- Hebdomadaire
- Mensuelle
- Annuelle

**Champs** :
- Montant
- Catégorie
- Date de début
- Date de fin (optionnel)
- Fréquence

**Fonctionnement** :
- Enregistrement automatique à la date
- Option pour modifier/supprimer l'occurrence
- Gestion depuis page dédiée

---

### Feature 5.2 : Export des Données

**Description** : Exporter les dépenses en PDF ou Excel

**Formats** :
- PDF : rapport formaté avec tableaux et graphiques
- Excel (.xlsx) : données brutes pour analyse personnelle
- CSV : pour import dans autre logiciel

**Contenu** :
- Liste complète des dépenses
- Résumés par catégorie
- Graphiques (optionnel)
- Période sélectionnée

**API Endpoint** :
```
GET /api/expenses/export?format=pdf&startDate=...&endDate=...
Response: file binary
```

---

### Feature 5.3 : Tags Personnalisés

**Description** : Ajouter des tags custom à chaque dépense

**Fonctionnement** :
- Champ tags lors de création/édition
- Auto-complete sur tags existants
- Filtre par tag(s)
- Gestion des tags (suppression des inutilisés)

---

### Feature 5.4 : Recherche Avancée

**Description** : Rechercher les dépenses avec filtres multiples

**Critères de recherche** :
- Mot clé (dans description/tags)
- Catégories (multi-select)
- Plage de dates
- Plage de montants
- Tags

**Affichage** :
- Résultats instantanés
- Options de tri
- Nombre de résultats

---

## Catégories Pré-configurées

| Icône | Catégorie | Code |
|-------|-----------|------|
| 🍔 | Alimentation | FOOD |
| 🏠 | Logement | HOUSING |
| 🚗 | Transport | TRANSPORT |
| 👕 | Vêtements | CLOTHING |
| 🎬 | Divertissement | ENTERTAINMENT |
| 💊 | Santé | HEALTH |
| 📚 | Éducation | EDUCATION |
| 🛒 | Shopping | SHOPPING |
| ⚡ | Utilitaires | UTILITIES |
| 🎁 | Autres | OTHER |

---

## Règles de Validation Globales

| Champ | Règle | Message Erreur |
|-------|-------|----------------|
| Montant | > 0, nombre décimal | "Le montant doit être positif" |
| Montant | ≤ 999,999.99 | "Montant trop élevé" |
| Date | ≤ aujourd'hui | "La date ne peut pas être future" |
| Description | ≤ 500 caractères | "Description trop longue" |
| Catégorie | Non vide | "Veuillez sélectionner une catégorie" |

---

## Flux d'Erreur

**Erreurs réseau** :
- Afficher toast : "Erreur de connexion, veille réessayer"
- Bouton retry
- Enregistrement local en attente

**Erreurs serveur** :
- Afficher message d'erreur clair
- Code d'erreur pour debug

**Erreurs validation** :
- Afficher en inline sous le champ
- En rouge
- Message explicite

---

**Last Update**: Juillet 2024
