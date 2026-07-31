import { api } from './api'

export const recurringService = {
  list: () => api.get('/recurring-transactions'),
  create: (data) => api.post('/recurring-transactions', data),
  update: (id, data) => api.put(`/recurring-transactions/${id}`, data),
  remove: (id) => api.delete(`/recurring-transactions/${id}`),
}
