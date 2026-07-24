# 🎨 Features UI & Screens - Suivi des Dépenses

## Vue d'ensemble des Pages

L'application comprend les pages/screens suivantes :

| # | Screen | Disponible à partir de | Priorité |
|---|--------|----------------------|----------|
| 1 | Dashboard | Phase 1 | Haute |
| 2 | Expenses | Phase 1 | Haute |
| 3 | Budgets | Phase 2 | Haute |
| 4 | Goals | Phase 3 | Haute |
| 5 | Analytics | Phase 4 | Moyenne |
| 6 | Settings | Phase 5 | Basse |

---

## 1️⃣ DASHBOARD (Écran Principal)

### Description
Page d'accueil affichant un résumé de toutes les informations importantes.

### Contenu à afficher

#### Section Header
- Salutation personnalisée ("Bonjour [Prénom]")
- Date d'aujourd'hui
- Bouton pour ajouter une dépense rapide

#### Section 1 : KPI Cards (4 cartes)
```
┌─────────────────────────┬─────────────────────────┐
│ 💰 Total ce mois        │ 📊 Budget utilisé       │
│ €2,450                  │ 75%                     │
├─────────────────────────┼─────────────────────────┤
│ 📈 Moyennes par jour    │ 🎯 Objectifs avancés    │
│ €78/jour                │ 2/5 en cours            │
└─────────────────────────┴─────────────────────────┘
```

#### Section 2 : Dépenses Récentes
- Tableau / liste des 5 dernières dépenses
- Colonnes : Date | Catégorie | Description | Montant
- Lien "Voir toutes" vers page Expenses

#### Section 3 : Budget Overview
- Graphique pie montrant budget utilisé par catégorie
- Ou tableau compact : Catégorie | Budget | Dépensé | Restant

#### Section 4 : Objectifs d'Épargne
- 2-3 objectifs avec barres de progression
- Afficher :% atteint et jours restants

#### Section 5 : Graphique Rapide
- Graphique line montrant évolution dépenses (derniers 7-30 jours)

### Éléments UI Requis
- Navigation principale (sidebar ou top bar)
- Cards avec ombre/élévation
- Barres de progression animées
- Graphiques interactifs
- Bouton flottant "+" pour ajouter une dépense

---

## 2️⃣ PAGE EXPENSES (Gestion Dépenses)

### Description
Page complète de gestion des dépenses avec liste, filtres, et CRUD.

### Layout

#### Haut de page
```
┌────────────────────────────────────────────────┐
│ Dépenses                    [Ajouter] [Filtrer] │
└────────────────────────────────────────────────┘
```

#### Section Filtres (collapse/expand)
- Filter par catégorie (multi-select checkboxes)
- Filter par date (date range picker)
- Filter par montant (range slider)
- Filter par tags (chips)
- Bouton "Réinitialiser"

#### Section Liste/Tableau
```
┌─────────┬──────────┬──────────────┬────────┬──────────┐
│ Date    │ Catégorie│ Description  │ Montant│ Actions  │
├─────────┼──────────┼──────────────┼────────┼──────────┤
│ 20/07   │ 🍔 Alim  │ Courses      │ €45.50 │ ✏️ 🗑️    │
│ 19/07   │ 🚗 Trans │ Essence      │ €60    │ ✏️ 🗑️    │
│ ...     │ ...      │ ...          │ ...    │ ...      │
└─────────┴──────────┴──────────────┴────────┴──────────┘
```

#### Pagination
- Boutons Previous/Next
- Affichage : Page 1/5 (20 items/page)

### Modales/Formulaires

#### Modal : Ajouter Dépense
```
┌─────────────────────────────┐
│ ➕ Nouvelle Dépense        │
├─────────────────────────────┤
│ Montant      [        ]     │
│ Catégorie    [Select ▼]     │
│ Date         [20/07/2024 ]  │
│ Description  [          ]   │
│ Tags         [+ Ajouter]    │
│                             │
│ [Annuler]     [Enregistrer] │
└─────────────────────────────┘
```

#### Modal : Modifier Dépense
- Même layout que Ajouter mais pré-rempli

#### Modal : Confirmer Suppression
- Texte : "Êtes-vous sûr de vouloir supprimer ?"
- 2 boutons : [Annuler] [Supprimer]

---

## 3️⃣ PAGE BUDGETS (Gestion Budgets)

### Description
Page pour créer et surveiller les budgets mensuels.

### Layout

#### Haut de page
```
┌────────────────────────────────────────────────┐
│ Budgets - Juillet 2024    [Nouveau Budget]     │
└────────────────────────────────────────────────┘
```

#### Cards par Catégorie
```
┌─────────────────────────────────────┐
│ 🍔 ALIMENTATION                     │
│                                     │
│ Budget: €300  |  Dépensé: €245.75  │
│ Restant: €54.25 (18%)              │
│                                     │
│ ▓▓▓▓▓▓▓▓▓░░░░░░  81%               │
│                                     │
│ [Modifier]  [Réinitialiser]        │
└─────────────────────────────────────┘
```

#### Summary Card (total mois)
```
┌──────────────────────────────────┐
│ Résumé Mensuel                   │
│                                  │
│ Budget total : €2,000            │
│ Dépensé total : €1,547.50        │
│ Restant : €452.50                │
│ Utilisation : 77%                │
└──────────────────────────────────┘
```

#### Navigation Mois
- [◀ Juin] | [Juillet 2024] | [Août ▶]
- Copier budgets du mois précédent (bouton)

### Modal : Créer/Modifier Budget
```
┌─────────────────────────────────┐
│ Créer un Budget                 │
├─────────────────────────────────┤
│ Catégorie [Alimentation    ▼]   │
│ Montant   [500          ]       │
│ Mois      [Juillet 2024  ▼]     │
│                                 │
│ [Annuler]        [Enregistrer]  │
└─────────────────────────────────┘
```

---

## 4️⃣ PAGE GOALS (Objectifs d'Épargne)

### Description
Page pour créer et suivre les objectifs d'épargne.

### Layout

#### Haut de page
```
┌────────────────────────────────────────┐
│ Objectifs d'Épargne   [Nouvel Objectif]│
└────────────────────────────────────────┘
```

#### Onglets / Filtres
- [Tous] [Actifs] [Complétés]

#### Cards Objectifs
```
┌──────────────────────────────────┐
│ 🎯 Vacances d'été               │
│                                  │
│ Cible : €2,000                   │
│ Épargné : €850                   │
│ Restant : €1,150                 │
│                                  │
│ ▓▓▓▓░░░░░░░░░░░░░  42%           │
│                                  │
│ Deadline : 31/08/2024 (42 jours) │
│ À épargner/mois : €550           │
│                                  │
│ [+ Ajouter €100]  [Éditer]       │
└──────────────────────────────────┘
```

#### Card Objectif Complété
```
┌──────────────────────────────────┐
│ ✅ Nouveau Téléphone             │
│ Atteint ! 🎉                     │
│ €800 épargné                     │
│ Complété le 15/07/2024           │
│                                  │
│ [Supprimer]  [Créer un nouveau]  │
└──────────────────────────────────┘
```

### Modal : Créer/Modifier Objectif
```
┌───────────────────────────────┐
│ Nouvel Objectif               │
├───────────────────────────────┤
│ Nom        [Vacances       ]  │
│ Description[Italie        ]  │
│                              │
│ Cible      [€2000         ]  │
│ Épargné    [€850          ]  │
│ Deadline   [31/08/2024    ]  │
│                              │
│ [Annuler]     [Enregistrer]  │
└───────────────────────────────┘
```

### Modal : Ajouter de l'Épargne
```
┌──────────────────────────────┐
│ Ajouter de l'Épargne         │
├──────────────────────────────┤
│ Montant  [€100          ]    │
│                              │
│ [Annuler]   [Confirmer]     │
└──────────────────────────────┘
```

---

## 5️⃣ PAGE ANALYTICS (Statistiques)

### Description
Page dédiée à l'analyse approfondie des dépenses.

### Layout

#### Filtres
- Période (7 jours, 30 jours, 3 mois, 6 mois, 1 an)
- Catégories (multi-select)

#### Section 1 : KPI Cards
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Moyenne/jour │ Max Catégorie│ Nb Dépenses  │
│ €2,450       │ €78          │ 🍔 €800      │ 42           │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Section 2 : Graphiques
- **Graphique 1** : Pie chart - Dépenses par catégorie
  - Affiche % et montant
  - Interactif : clic = affiche détails

- **Graphique 2** : Line chart - Évolution des dépenses
  - Axe X : jours/semaines/mois
  - Axe Y : montant
  - Options de granularité

- **Graphique 3** : Bar chart - Comparaison mois vs mois
  - Barres côte à côte par catégorie

#### Section 3 : Tableau Détaillé
- Résumé par catégorie avec stats
- Colonnes : Catégorie | Total | % | Moyenne | Nb Transactions

#### Section 4 : Insights & Tendances
- Cartes texte :
  - "📈 Vous avez dépensé 15% plus en alimentation ce mois"
  - "💰 Vous économisez bien ! +€200 vs le mois dernier"
  - "🎯 Vous êtes en bonne route pour votre objectif"

---

## 6️⃣ PAGE SETTINGS (Paramètres)

### Description
Page pour configurer les préférences de l'application.

### Sections

#### Section 1 : Compte
```
Profil
  Prénom           [Claude     ]
  Nom              [Développeur]
  Email            [user@ex.com]
  Avatar           [Changer]
```

#### Section 2 : Préférences
```
Apparence
  Thème            [Clair ▼]
  
Format & Monnaie
  Devise           [EUR ▼]
  Format date      [DD/MM/YYYY ▼]
  Langue           [Français ▼]
```

#### Section 3 : Notifications
```
Alertes Budgets
  ☑ Alerte à 80% du budget
  ☑ Alerte à 100%+ (dépassement)
  
Notifications Objectifs
  ☑ Rappel hebdomadaire
```

#### Section 4 : Données
```
Export / Sauvegarde
  [Exporter en PDF]
  [Exporter en Excel]
  [Télécharger mes données (JSON)]
  
Suppression
  [Supprimer toutes les données]
  ⚠️ Cette action est irréversible
```

---

## 🧩 Composants Réutilisables

### Composants Atomiques

| Composant | Utilisation | Exemple |
|-----------|------------|---------|
| `Card` | Conteneurs | KPI cards, Objectifs |
| `Button` | Actions | Soumettre, Annuler |
| `Input` | Saisie texte | Montants, descriptions |
| `Select` | Listes | Catégories, mois |
| `DatePicker` | Sélection date | Dates de dépenses |
| `ProgressBar` | Progression | Budgets, objectifs |
| `Badge` | Statuts | Catégorie, tags |
| `Modal` | Modales | Formulaires, confirmations |
| `Toast` | Notifications | Succès, erreurs |
| `Tab` | Onglets | Actifs/complétés |
| `Chart` | Graphiques | Pie, line, bar |
| `Table` | Tableaux | Liste dépenses |

### Composants Métier

| Composant | Utilisation |
|-----------|------------|
| `ExpenseForm` | Formulaire dépense |
| `ExpenseList` | Affichage liste |
| `BudgetCard` | Carte budget |
| `GoalCard` | Carte objectif |
| `DashboardKPI` | KPI card |
| `ChartContainer` | Graphique avec options |
| `FilterBar` | Barre de filtres |

---

## 🎨 Système de Design

### Couleurs par Catégorie
```
🍔 Alimentation    → #FF6B6B (rouge)
🏠 Logement        → #4ECDC4 (turquoise)
🚗 Transport       → #FFE66D (jaune)
👕 Vêtements       → #A8E6CF (vert)
🎬 Divertissement  → #FF8B94 (rose)
💊 Santé           → #FFD3B6 (orange)
📚 Éducation       → #9B59B6 (violet)
🛒 Shopping        → #3498DB (bleu)
⚡ Utilitaires     → #95A5A6 (gris)
🎁 Autres          → #34495E (gris foncé)
```

### Couleurs Fonctionnelles
```
Succès             → #27AE60 (vert)
Alerte             → #F39C12 (orange)
Erreur             → #E74C3C (rouge)
Info               → #3498DB (bleu)
Background         → #F8F9FA (gris clair)
Text Primaire      → #2C3E50 (gris foncé)
Text Secondaire    → #7F8C8D (gris moyen)
Border             → #ECF0F1 (gris très clair)
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px (portrait)
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Adaptations

**Mobile** :
- Sidebar → Bottom navigation
- Grille 1 colonne
- Modal fullscreen
- Tableaux → Cartes

**Tablet** :
- Sidebar rétractable
- Grille 2 colonnes
- Modal normale

**Desktop** :
- Sidebar fixe
- Grille 2-3 colonnes
- Layouts complexes

---

**Version** : 1.0  
**Dernière mise à jour** : Juillet 2024
