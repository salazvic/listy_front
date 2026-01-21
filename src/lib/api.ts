import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { connectSockets, disconnectSockets } from '@/lib/socket'

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: '/api', // BFF
  withCredentials: true,
})

let isRefreshing = false
let queue: {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error?: any) => {
  queue.forEach(p => (error ? p.reject(error) : p.resolve()))
  queue = []
}

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    isRefreshing = true

    try {
      await api.post('/auth/refresh')
      processQueue()
      connectSockets()
      return api(originalRequest)
    } catch (err) {
      processQueue(err)
      useAuthStore.getState().logout()
      disconnectSockets()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
