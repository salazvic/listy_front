import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { connectSockets } from '@/lib/socket'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

let isRefreshing = false
let queue: (() => void)[] = []

api.interceptors.response.use(
  res => res,
  async error => {
    const auth = useAuthStore.getState() 
    const originalRequest = error.config  
  /*   
    console.log(
      `[INTERCEPTOR] ${error.response?.status, error.config?.url} 
      error: ${error.response?.data?.message}`
    ) */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if(isRefreshing) {
        return new Promise(resolve => {
          queue.push(() => resolve(api(originalRequest)))
        })
      }

      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        
        queue.forEach(cb => cb())
        queue = []

        connectSockets()

        return api(originalRequest)
      } catch {
        auth.logout()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
