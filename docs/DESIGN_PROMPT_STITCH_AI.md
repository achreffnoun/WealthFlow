# 🎨 PROMPT DESIGN POUR STITCH AI - Suivi des Dépenses

## À copier/coller directement dans Stitch AI

---

### 📋 CONTEXTE DU PROJET

**Nom du projet** : Suivi des Dépenses (Expense Tracker)  
**Type d'application** : Application Web  
**Utilisateur cible** : Personnes souhaitant mieux gérer leur budget personnel  
**Objectif principal** : Aider à enregistrer, analyser et contrôler les dépenses quotidiennes

**Tonalité** : Moderne, rassurante, accessible, motivante  
**Public** : Tous les âges, principalement 20-55 ans  

---

## 🎨 DIRECTION VISUELLE

### Inspirations & Aesthetique
- **Style** : Minimal moderne avec touches de couleur pour créer de la vie
- **Philosophie** : Simple à utiliser, avec une belle courbe d'apprentissage
- **Atmosthère** : Professionnelle mais pas intimidante, invitante à l'action

### Palette de Couleurs Principale

**Couleur Primaire** : #3B82F6 (Bleu moderne)
- Utilisée pour : boutons principaux, accents, highlights
- Connotation : confiance, sécurité financière, stabilité

**Couleur Secondaire** : #10B981 (Vert menthe)
- Utilisée pour : succès, épargne positive, économies
- Connotation : croissance, santé financière

**Couleurs d'Alerte** :
- Avertissement (80% budget) : #F59E0B (Ambre)
- Danger (dépassement) : #EF4444 (Rouge)

**Neutres** :
- Background : #F8FAFC (Blanc cassé léger)
- Cards : #FFFFFF (Blanc pur)
- Text Principal : #1E293B (Noir bleutée)
- Text Secondaire : #64748B (Gris)
- Bordures : #E2E8F0 (Gris très clair)

### Couleurs par Catégorie de Dépense
```
Alimentation      : #FF6B6B (Rouge vif)
Logement          : #4ECDC4 (Turquoise)
Transport         : #FFE66D (Jaune doré)
Vêtements         : #A8E6CF (Vert pastel)
Divertissement    : #FF8B94 (Rose coral)
Santé             : #FFD3B6 (Pêche)
Éducation         : #9B59B6 (Violet)
Shopping          : #3498DB (Bleu ciel)
Utilitaires       : #95A5A6 (Gris ardoise)
Autres            : #34495E (Charbon)
```

---

## 🔤 TYPOGRAPHIE

### Police Display (Titres & Headlines)
**Police** : "Inter" ou "Poppins" (sans-serif moderne)
- Tailles : 32px, 28px, 24px pour les headings
- Poids : Bold (700) pour impact
- Lettrage : Normal
- Usage : Titres de page, headlines des cartes principales

### Police Body (Texte courant)
**Police** : "Inter" ou "Outfit" (sans-serif lisible)
- Tailles : 16px (body), 14px (secondary), 12px (petit texte)
- Poids : Regular (400) pour le texte, Medium (500) pour labels
- Hauteur de ligne : 1.6 pour le corps, 1.5 pour body
- Usage : Texte principal, descriptions, formulaires

### Police Monospace (Montants/Chiffres)
**Police** : "JetBrains Mono" ou "IBM Plex Mono"
- Tailles : Même que body mais monospace
- Poids : Regular ou Medium
- Usage : Affichage des montants, chiffres KPI, totaux

---

## 🧩 COMPOSANTS CLÉS À DESIGNER

### 1. Boutons Principaux
**Bouton Primary** (Ajouter une dépense, Enregistrer, etc)
- Background : #3B82F6
- Text : Blanc
- Padding : 12px 24px
- Border-radius : 8px
- Hover : Légère ombre + opacity 0.9
- Transition : smooth (200ms)

**Bouton Secondary** (Annuler, Modifier, etc)
- Background : #E2E8F0
- Text : #1E293B
- Padding : 12px 24px
- Border-radius : 8px
- Hover : Background #CBD5E1

**Bouton Danger** (Supprimer)
- Background : #EF4444
- Text : Blanc
- Hover : #DC2626
- Confirm : Demande confirmation

### 2. Cards & Conteneurs
**Card Standard**
- Background : Blanc
- Border : 1px #E2E8F0
- Border-radius : 12px
- Shadow : 0 1px 3px rgba(0,0,0,0.1)
- Padding : 20px
- Hover : Légère élévation (shadow plus marquée)

**Card Compacte** (Listes)
- Padding : 16px
- Border : 0
- Background-hover : #F8FAFC

### 3. Formulaires & Inputs
**Input Texte / Nombre**
- Border : 1px #E2E8F0
- Border-radius : 8px
- Padding : 10px 12px
- Font-size : 16px
- Focus : Border #3B82F6, subtle shadow
- Placeholder : Gris clair #9CA3AF

**Select Dropdown**
- Même styling que input
- Icône dropdown chevron
- Options : list avec hover state #F0F9FF

**Date Picker**
- Composant avec calendar widget
- Format : DD/MM/YYYY
- Color scheme : Thème bleu

**Checkboxes & Radios**
- Taille : 18x18px
- Color-checked : #3B82F6
- Border-radius : 4px pour checkbox, 50% pour radio

### 4. Barres de Progression
**Progress Bar Budget**
- Height : 8px
- Border-radius : 4px
- Background (track) : #E2E8F0
- Fill color (0-50%) : #10B981 (vert)
- Fill color (50-90%) : #F59E0B (orange)
- Fill color (90-100%+) : #EF4444 (rouge)
- Animation : smooth progress update

### 5. Badges & Tags
**Category Badge**
- Couleur : Selon la catégorie (voir palette)
- Text-color : Blanc
- Padding : 4px 8px
- Border-radius : 12px
- Font-size : 12px
- Font-weight : 500

### 6. Notifications (Toast)
**Toast Success**
- Background : #D1FAE5 (vert très clair)
- Border-left : 4px #10B981
- Text : #065F46
- Icône : ✓

**Toast Error**
- Background : #FEE2E2 (rouge très clair)
- Border-left : 4px #EF4444
- Text : #7F1D1D
- Icône : ✗

**Toast Info**
- Background : #DBEAFE (bleu très clair)
- Border-left : 4px #3B82F6
- Text : #1E40AF
- Icône : ℹ

---

## 📐 LAYOUTS & STRUCTURE

### Navigation Principale
**Top Bar / Header**
- Height : 64px
- Background : Blanc ou #F8FAFC
- Border-bottom : 1px #E2E8F0
- Contient :
  - Logo + Titre app (gauche)
  - Menu/Navigation (centre ou dropdown)
  - Profil user / Settings (droite)

**Sidebar (Desktop)** ou **Bottom Nav (Mobile)**
- Items : Dashboard, Expenses, Budgets, Goals, Analytics
- Active state : Background #DBEAFE + Text #3B82F6
- Icons + Labels
- Smooth transitions

### Main Content Area
- Max-width : 1200px
- Padding : 24px
- Background : #F8FAFC

### Grille de Contenu
- Desktop : 12 colonnes
- Cards : Responsive (2 cols tablet, 1 col mobile)
- Gutters : 20px

---

## 📄 PAGES À DESIGNER

### Page 1 : DASHBOARD (Principale)
**Section 1 - Header**
- Grand greeting "Bonjour, [Prénom]"
- Date courante
- Bouton "+ Ajouter une dépense" prominent

**Section 2 - KPI Cards** (Grille 2x2 ou 4x1)
```
[💰 Total Mois]  [📊 Budget Utilisé]  [📈 Moy/Jour]  [🎯 Objectifs]
```
- Chaque card : icône + valeur grande + label + tendance

**Section 3 - Dépenses Récentes**
- Tableau simple : Date | Catégorie | Description | Montant
- Couleur catégorie sur icône
- Hover effect sur lignes
- Lien "Voir toutes"

**Section 4 - Budget Overview**
- Graphique Pie chart (Recharts) montrant répartition budgets
- Couleurs des catégories
- Legend interactif (clic = highlight)

**Section 5 - Objectifs d'Épargne**
- 2-3 cartes avec :
  - Nom objectif + icône
  - Barre de progression animée
  - Montant épargné / Cible
  - Jours restants (countdown)
  - Bouton "+ Ajouter épargne"

**Section 6 - Graphique Tendance**
- Line chart : derniers 7-30 jours
- Axe Y : montant total
- Points interactifs avec tooltips
- Légende et date range picker

### Page 2 : EXPENSES (Gestion des Dépenses)
**Header**
- Titre "Mes Dépenses"
- Bouton "+ Nouvelle dépense"

**Barre Filtres** (Collapse/Expand)
- Checkboxes : Catégories (tous les 10)
- Date range picker
- Range slider montants
- Tags multi-select
- Bouton réinitialiser

**Tableau Dépenses**
- Colonnes : Date | Catégorie | Description | Montant | Actions
- Striped rows (alternate background)
- Hover highlight
- Icônes actions : Éditer ✏️ | Supprimer 🗑️
- Pagination : 10-20 items/page

**Modal - Ajouter/Modifier Dépense**
- Champs : Montant | Catégorie | Date | Description | Tags
- Validation temps réel
- CTA : Enregistrer / Annuler

### Page 3 : BUDGETS
**Header avec Navigation Mois**
- [◀ Juin] | [Juillet 2024] | [Août ▶]
- Bouton "Nouveau Budget"

**Summary Card**
- Budget Total | Dépensé Total | Restant | % Utilisation

**Budget Cards** (Grille)
- Une card par catégorie avec icône
- Budget limit | Dépensé | Restant
- Progress bar colorée (vert/orange/rouge)
- Boutons : Modifier | Réinitialiser

**Modal - Créer Budget**
- Select catégorie | Input montant | Select mois
- Confirmation

### Page 4 : GOALS
**Header avec Filtres**
- Onglets : [Tous] [Actifs] [Complétés]
- Bouton "Nouvel Objectif"

**Goal Cards** (Grille)
- Icône + nom + description
- Barre de progression animée
- Montant épargné / Cible
- Deadline + jours restants (countdown rouge si urgent)
- Montant à épargner par mois
- Boutons : + Épargne | Éditer

**Goal Card Complétée**
- Background célébration (couleur accent)
- Affichage : "✅ Objectif atteint le 15/07"
- Bouton "Supprimer" ou "En créer un nouveau"

**Modal - Ajouter Objectif**
- Inputs : Nom | Description | Montant cible | Épargné | Deadline
- Calculs automatiques en temps réel

### Page 5 : ANALYTICS
**Section Filtres**
- Period selector : [7j] [30j] [90j] [6m] [1y]
- Catégories multi-select

**KPI Cards**
- Total | Moyenne/jour | Catégorie la plus chère | Nb transactions
- Affichage statistiques avec icônes

**Graphiques**
1. **Pie Chart** - Dépenses par catégorie
   - Couleurs catégories
   - Pourcentages + montants
   - Interactive : hover/clic

2. **Line Chart** - Évolution temps
   - Tendance sur la période
   - Courbe lisse
   - Tooltips détaillés

3. **Bar Chart** - Comparaison mois
   - Bars côte à côte
   - Légende catégories

**Tableau Détails**
- Catégorie | Total | % | Moyenne | Nb
- Tri possible par colonne

**Insights Cards**
- Texte avec emoji : "📈 Vous avez dépensé..."
- Couleur alerte si négatif

---

## 🎯 INTERACTIONS & ANIMATIONS

### Micro-interactions
- **Hover sur buttons** : Légère élévation + darken
- **Hover sur cards** : Shadow + léger scale (1.02)
- **Click feedback** : Brief opacity change
- **Loading** : Spinner subtle
- **Transitions** : 200-300ms easing
- **Progress bars** : Animation smooth (1-2s)

### Animations Principales
- **Page load** : Fade-in des sections (cascade)
- **Chart appears** : Animation draw (1.5s)
- **Progress update** : Animation smooth (500ms)
- **Objectif atteint** : Celebration animation (confetti optional)

### Motion Preferences
- Respecter `prefers-reduced-motion` pour accessibilité
- Option "Animations" dans settings

---

## 📱 RESPONSIVE & MOBILE

### Desktop (> 1024px)
- Sidebar fixe gauche (240px)
- Contenu main area
- Grille 2-3 colonnes pour cards
- Tableaux complets

### Tablet (640-1024px)
- Sidebar rétractable / hamburger menu
- Grille 2 colonnes
- Tableaux : scroll horizontal

### Mobile (< 640px)
- Full-width content
- Sidebar → Bottom navigation
- Tableaux → Cartes empilées
- Modals : Fullscreen ou bottom sheet
- Grille 1 colonne

### Touches Native
- Buttons : Plus grands (44px min)
- Spacing : Augmenté pour tactile
- Modal : Bottom sheet plutôt que centre
- Date picker : Native input type="date"

---

## ♿ ACCESSIBILITÉ

- **Couleurs** : Contraste WCAG AA minimum (4.5:1 pour texte)
- **Focus visible** : Outline bleu clair sur tous les contrôles
- **Keyboard navigation** : Tab order logique, Enter pour submit
- **ARIA labels** : Sur icônes, buttons, charts
- **Alt text** : Sur toutes les images
- **Form labels** : Liées aux inputs avec <label for="">
- **Erreurs** : Messages clairs, lien vers champ fautif

---

## 🎨 DÉTAILS FINAUX

### Shadows (Élévation)
- **Small** : 0 1px 2px rgba(0,0,0,0.05)
- **Medium** : 0 4px 6px rgba(0,0,0,0.1)
- **Large** : 0 10px 15px rgba(0,0,0,0.15)
- **Hover cards** : Large shadow

### Border Radius
- Buttons : 8px
- Cards : 12px
- Inputs : 8px
- Avatars : 50%
- Chart containers : 12px

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Breakpoints
- Mobile: 0 - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

---

## 🎬 LIVRABLES ATTENDUS

1. **Dashboard Page Design**
   - Mobile view
   - Tablet view
   - Desktop view

2. **Expenses Page**
   - List view
   - Modal d'ajout
   - État filtré

3. **Budgets Page**
   - Overview cards
   - Modal de création

4. **Goals Page**
   - Cards des objectifs
   - Modal de création

5. **Analytics Page**
   - Graphiques example
   - Tableau détails

6. **Components Library**
   - Buttons (Primary, Secondary, Danger)
   - Cards
   - Inputs
   - Modals
   - Toasts
   - Badges

7. **Iconography**
   - Catégories (10 icônes)
   - Navigation
   - Actions (edit, delete, etc)

---

## 📌 NOTES IMPORTANTES

- **Ne pas copier d'autres apps** : Créer quelque chose d'original
- **Couleurs vives mais pas criardes** : Harmonie importante
- **Espace blanc généreux** : Pas surcharger
- **Typography hiérarchie claire** : Facile de scanner
- **Boutons évidents** : Actions principales en évidence
- **Mobile first** : Designer pour petit écran en priorité
- **Données réalistes** : Utiliser des montants/noms vrais dans mockups
- **Attention au détail** : Alignements, espacements, cohérence

---

## 🚀 STYLE FINAL ATTENDU

**Une application moderne, minimaliste mais avec de la personnalité**, qui inspire confiance et donne envie d'utiliser quotidiennement. Design fonctionnel d'abord, beauté ensuite. Couleurs aident la navigation et l'information. Animations subtiles renforcent les interactions.

---

**À copier/coller directement dans Stitch AI pour générer le design complet de l'application !**

