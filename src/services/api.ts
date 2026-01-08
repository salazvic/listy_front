import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

let isRefreshing = false
let queue: (() => void)[] = []

api.interceptors.request.use((config) => {
  const access_token = useAuthStore.getState().access_token

  if(access_token){
    config.headers.Authorization = `Bearer ${access_token}`
  }

  return config
})

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config 

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push(() => resolve(api(originalRequest)))
        })
      }

      isRefreshing = true

      try {
        const {data} = await api.post('/auth/refresh')

        useAuthStore.getState().setAccess_token(data.access_token)

        queue.forEach(cb => cb())
        queue = []

        return api(originalRequest)
      } catch {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
