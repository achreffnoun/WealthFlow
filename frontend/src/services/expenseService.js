import { api } from './api'

export const expenseService = {
  list: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  remove: (id) => api.delete(`/expenses/${id}`),
}
