import api from './axios'
export const getDashboard = () => api.get('/api/tasks/dashboard')
export const getTasks = (params) => api.get('/api/tasks', { params })
export const createTask = (data) => api.post('/api/tasks', data)
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`)
