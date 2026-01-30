import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL })

export const getTasks = () => api.get('/tasks')
export const createTask = (data) => api.post('/tasks', data)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status })
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
