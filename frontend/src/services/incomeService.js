import { api } from './api'

export const incomeService = {
  list: () => api.get('/incomes'),
  create: (data) => api.post('/incomes', data),
  update: (id, data) => api.put(`/incomes/${id}`, data),
  remove: (id) => api.delete(`/incomes/${id}`),
}
