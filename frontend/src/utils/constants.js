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

export const INCOME_SOURCES = [
  { code: 'SALARY', label: 'Salaire', icon: 'work', color: '#2ECC71' },
  { code: 'BONUS', label: 'Prime', icon: 'redeem', color: '#F1C40F' },
  { code: 'FREELANCE', label: 'Freelance', icon: 'laptop_mac', color: '#3498DB' },
  { code: 'INVESTMENT', label: 'Investissement', icon: 'trending_up', color: '#9B59B6' },
  { code: 'GIFT', label: 'Cadeau', icon: 'card_giftcard', color: '#FF8B94' },
  { code: 'OTHER', label: 'Autre', icon: 'category', color: '#34495E' },
]

export const INCOME_SOURCE_MAP = Object.fromEntries(INCOME_SOURCES.map((s) => [s.code, s]))

export const getIncomeSource = (code) => INCOME_SOURCE_MAP[code] || INCOME_SOURCE_MAP.OTHER

export const CURRENCY = 'EUR'
export const LOCALE = 'fr-FR'

export const BUDGET_THRESHOLDS = {
  SAFE: 70,
  WARNING: 90,
}

export const RECURRING_FREQUENCIES = [
  { code: 'DAILY', label: 'Quotidien' },
  { code: 'WEEKLY', label: 'Hebdomadaire' },
  { code: 'MONTHLY', label: 'Mensuel' },
  { code: 'YEARLY', label: 'Annuel' },
]

export const RECURRING_FREQUENCY_MAP = Object.fromEntries(RECURRING_FREQUENCIES.map((f) => [f.code, f]))

export const getRecurringFrequency = (code) => RECURRING_FREQUENCY_MAP[code] || RECURRING_FREQUENCIES[2]

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
}
