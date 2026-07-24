import { api } from './api'

export const goalService = {
  list: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  addSavings: (id, amount) => api.patch(`/goals/${id}/savings`, { amount }),
  remove: (id) => api.delete(`/goals/${id}`),
}
