import api from './axios'
export const getProjects = () => api.get('/api/projects')
export const createProject = (data) => api.post('/api/projects', data)
export const getProject = (id) => api.get(`/api/projects/${id}`)
export const addMember = (id, data) => api.post(`/api/projects/${id}/members`, data)
export const removeMember = (pId, uId) => api.delete(`/api/projects/${pId}/members/${uId}`)
export const deleteProject = (id) => api.delete(`/api/projects/${id}`)
