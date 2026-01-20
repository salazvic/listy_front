import { bffApi } from '@/lib/api.bff'

let isRefreshing = false
let queue: (() => void)[] = []

bffApi.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise(resolve => {
        queue.push(() => resolve(bffApi(originalRequest)))
      })
    }

    isRefreshing = true

    try {
      await bffApi.post('/auth/refresh')

      queue.forEach(cb => cb())
      queue = []

      return bffApi(originalRequest)
    } catch (err) {
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)
