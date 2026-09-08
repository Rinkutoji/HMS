import axios from 'axios'
import { storage } from '../utils/storage'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong. Please try again.'

    if (status === 401) {
      storage.clearAll()
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/'
      }
    }

    return Promise.reject({ status, message, details: error.response?.data })
  },
)

export default axiosClient
