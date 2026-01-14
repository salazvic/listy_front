import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { reconnectSockests } from '@/lib/socket'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
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
    const auth = useAuthStore.getState() 
    const originalRequest = error.config  
    
    console.log(`[INTERCEPTOR] ${error.response?.status, error.config?.url} error: ${error.response?.data?.message}`)

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      auth.refresh_token
    ) {
      originalRequest._retry = true

      try {
        const { data } = await api.post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.refresh_token}`
            }
          }
        )
        console.log("DATA Interceptor:", data)
        auth.setTokens(data.access_token, data.refresh_token)
        
        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`

        reconnectSockests()

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`

        return api(originalRequest)
      } catch {
        auth.logout()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
