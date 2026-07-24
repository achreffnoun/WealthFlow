# 🗄️ Schéma de Base de Données - Suivi des Dépenses

## Vue d'Ensemble

La base de données contient les collections/tables suivantes :
- `users` - Utilisateurs et authentification
- `expenses` - Enregistrements des dépenses
- `budgets` - Budgets mensuels par catégorie
- `goals` - Objectifs d'épargne
- `recurring_expenses` - Dépenses récurrentes

---

## Collection : USERS

Stocke les informations des utilisateurs.

```javascript
{
  _id: ObjectId,
  
  // Authentification
  email: string (unique, lowercase),
  password: string (hashed avec bcrypt),
  passwordChangedAt: Date,
  
  // Profil
  firstName: string,
  lastName: string,
  avatar: string (URL),
  
  // Préférences
  currency: string (default: "EUR"),
  language: string (default: "fr"),
  theme: "light" | "dark",
  dateFormat: string (default: "DD/MM/YYYY"),
  
  // Compte
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isActive: boolean (default: true),
  
  // Authentification
  resetPasswordToken: string,
  resetPasswordExpires: Date
}
```

**Indexes** :
- `email` (unique)
- `createdAt`

---

## Collection : EXPENSES

Enregistrement de chaque dépense.

```javascript
{
  _id: ObjectId,
  
  // Propriétaire
  userId: ObjectId (référence Users),
  
  // Infos dépense
  amount: number (decimal, positif),
  category: string (enum: FOOD, HOUSING, TRANSPORT, etc),
  description: string (optional, max 500 chars),
  date: Date (date de la dépense),
  
  // Métadonnées
  tags: [string] (optional, array de tags),
  receipt: string (URL de la photo/scan, optional),
  
  // Système
  createdAt: Date (date d'enregistrement),
  updatedAt: Date,
  
  // Récurrence
  recurringId: ObjectId (optional, référence RecurringExpenses)
}
```

**Indexes** :
- `userId` + `date` (composé)
- `userId` + `category`
- `userId` + `createdAt`
- `date`

**Validations** :
- `amount` > 0
- `category` ∈ liste pré-définie
- `date` ≤ Date.now()

**Exemple** :
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "userId": ObjectId("507f1f77bcf86cd799439010"),
  "amount": 45.50,
  "category": "FOOD",
  "description": "Courses au supermarché",
  "date": "2024-07-20T00:00:00Z",
  "tags": ["semaine", "courses"],
  "createdAt": "2024-07-20T14:30:00Z",
  "updatedAt": "2024-07-20T14:30:00Z"
}
```

---

## Collection : BUDGETS

Budgets mensuels par catégorie.

```javascript
{
  _id: ObjectId,
  
  // Propriétaire
  userId: ObjectId (référence Users),
  
  // Budget info
  category: string (enum: FOOD, HOUSING, etc),
  limit: number (decimal, positif),
  
  // Période
  month: number (1-12),
  year: number (2024, etc),
  
  // Tracking
  spent: number (decimal, calculé, optional),
  
  // Système
  createdAt: Date,
  updatedAt: Date
}
```

**Constraints** :
- Clé unique : userId + category + month + year
- `limit` > 0
- Un seul budget par catégorie par mois

**Indexes** :
- `userId` + `month` + `year`
- `userId` + `category`

**Exemple** :
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439010"),
  "category": "FOOD",
  "limit": 300,
  "month": 7,
  "year": 2024,
  "spent": 245.75,
  "createdAt": "2024-07-01T00:00:00Z",
  "updatedAt": "2024-07-20T10:00:00Z"
}
```

---

## Collection : GOALS

Objectifs d'épargne.

```javascript
{
  _id: ObjectId,
  
  // Propriétaire
  userId: ObjectId (référence Users),
  
  // Objectif
  name: string (max 100 chars),
  description: string (optional, max 500 chars),
  targetAmount: number (decimal, positif),
  savedAmount: number (decimal, default: 0),
  
  // Deadline
  deadline: Date (optional),
  
  // Statut
  status: "active" | "completed" | "abandoned",
  completedAt: Date (optional),
  
  // Système
  createdAt: Date,
  updatedAt: Date
}
```

**Validations** :
- `targetAmount` > 0
- `savedAmount` ≥ 0
- `savedAmount` ≤ `targetAmount`
- `deadline` optionnel mais > createdAt si fourni

**Indexes** :
- `userId` + `status`
- `userId` + `deadline`

**Exemple** :
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "userId": ObjectId("507f1f77bcf86cd799439010"),
  "name": "Vacances d'été",
  "description": "Voyage en Italie",
  "targetAmount": 2000,
  "savedAmount": 850,
  "deadline": "2024-08-31T23:59:59Z",
  "status": "active",
  "createdAt": "2024-06-01T00:00:00Z",
  "updatedAt": "2024-07-20T10:00:00Z"
}
```

---

## Collection : RECURRING_EXPENSES

Dépenses qui se répètent automatiquement.

```javascript
{
  _id: ObjectId,
  
  // Propriétaire
  userId: ObjectId (référence Users),
  
  // Info dépense
  amount: number (decimal, positif),
  category: string,
  description: string,
  
  // Récurrence
  frequency: "daily" | "weekly" | "monthly" | "yearly",
  dayOfWeek: number (0-6, pour weekly, optional),
  dayOfMonth: number (1-31, pour monthly, optional),
  
  // Dates
  startDate: Date,
  endDate: Date (optional, null = infini),
  lastOccurrence: Date (optional, date de la dernière exécution),
  
  // Système
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Validations** :
- `amount` > 0
- `frequency` ∈ [daily, weekly, monthly, yearly]
- `startDate` ≤ `endDate`
- dayOfMonth ∈ [1, 31] si monthly

**Indexes** :
- `userId` + `isActive`
- `startDate` + `frequency`

**Exemple** :
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "userId": ObjectId("507f1f77bcf86cd799439010"),
  "amount": 1200,
  "category": "HOUSING",
  "description": "Loyer appartement",
  "frequency": "monthly",
  "dayOfMonth": 1,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": null,
  "lastOccurrence": "2024-07-01T00:00:00Z",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-07-01T00:00:00Z"
}
```

---

## Diagramme Relationnel

```
USERS
  ├── 1 → many → EXPENSES
  ├── 1 → many → BUDGETS
  ├── 1 → many → GOALS
  └── 1 → many → RECURRING_EXPENSES

RECURRING_EXPENSES
  └── 1 → many → EXPENSES (via recurringId)
```

---

## Requêtes SQL Courantes (PostgreSQL)

### PostgreSQL - Schéma SQL

```sql
-- Table USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  currency VARCHAR(3) DEFAULT 'EUR',
  language VARCHAR(5) DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Table EXPENSES
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  tags TEXT[],
  recurring_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Table BUDGETS
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, category, month, year)
);

-- Table GOALS
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) NOT NULL,
  saved_amount DECIMAL(10, 2) DEFAULT 0,
  deadline TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table RECURRING_EXPENSES
CREATE TABLE recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  frequency VARCHAR(20) NOT NULL,
  day_of_week INTEGER,
  day_of_month INTEGER,
  start_date DATE NOT NULL,
  end_date DATE,
  last_occurrence DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Requêtes Analytiques Utiles

### MongoDB

**Total dépenses par mois** :
```javascript
db.expenses.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: {
      _id: { month: { $month: "$date" }, year: { $year: "$date" } },
      total: { $sum: "$amount" }
  }},
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```

**Dépenses par catégorie ce mois** :
```javascript
db.expenses.aggregate([
  { $match: {
      userId: ObjectId("..."),
      date: { $gte: startOfMonth, $lte: endOfMonth }
  }},
  { $group: {
      _id: "$category",
      total: { $sum: "$amount" }
  }},
  { $sort: { total: -1 } }
])
```

**Vérifier dépassement budget** :
```javascript
const spent = db.expenses.aggregate([
  { $match: {
      userId: ObjectId("..."),
      category: "FOOD",
      date: { $gte: startOfMonth, $lte: endOfMonth }
  }},
  { $group: { _id: null, total: { $sum: "$amount" } } }
])
```

### PostgreSQL

**Total dépenses par mois** :
```sql
SELECT 
  EXTRACT(MONTH FROM date) as month,
  EXTRACT(YEAR FROM date) as year,
  SUM(amount) as total
FROM expenses
WHERE user_id = $1
GROUP BY year, month
ORDER BY year DESC, month DESC;
```

**Dépenses par catégorie ce mois** :
```sql
SELECT 
  category,
  SUM(amount) as total,
  COUNT(*) as count
FROM expenses
WHERE user_id = $1
  AND date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
GROUP BY category
ORDER BY total DESC;
```

---

## Stratégies de Backup

- **Fréquence** : Quotidienne
- **Rétention** : 30 jours minimum
- **Localisation** : Géographie diverse
- **Test** : Mensuel

---

**Version** : 1.0
**Dernière mise à jour** : Juillet 2024
