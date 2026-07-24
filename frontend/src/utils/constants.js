export const CATEGORIES = [
  { code: 'FOOD', label: 'Alimentation', icon: 'restaurant', color: '#FF6B6B' },
  { code: 'HOUSING', label: 'Logement', icon: 'home', color: '#4ECDC4' },
  { code: 'TRANSPORT', label: 'Transport', icon: 'directions_car', color: '#FFE66D' },
  { code: 'CLOTHING', label: 'Vêtements', icon: 'checkroom', color: '#A8E6CF' },
  { code: 'ENTERTAINMENT', label: 'Divertissement', icon: 'movie', color: '#FF8B94' },
  { code: 'HEALTH', label: 'Santé', icon: 'medical_services', color: '#FFD3B6' },
  { code: 'EDUCATION', label: 'Éducation', icon: 'school', color: '#9B59B6' },
  { code: 'SHOPPING', label: 'Shopping', icon: 'shopping_cart', color: '#3498DB' },
  { code: 'UTILITIES', label: 'Utilitaires', icon: 'bolt', color: '#95A5A6' },
  { code: 'OTHER', label: 'Autres', icon: 'category', color: '#34495E' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.code, c]))

export const getCategory = (code) => CATEGORY_MAP[code] || CATEGORY_MAP.OTHER

export const CURRENCY = 'EUR'
export const LOCALE = 'fr-FR'

export const BUDGET_THRESHOLDS = {
  SAFE: 70,
  WARNING: 90,
}

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
}
