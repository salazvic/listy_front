import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean
}

export const bffApi = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

let isRefreshing = false
let queue: {
  resolve: (value: any) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: any, data?: any) => {
  queue.forEach(promise => {
    if (error) promise.reject(error)
    else promise.resolve(data)
  })
  queue = []
}

bffApi.interceptors.response.use(
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
      }).then(() => bffApi(originalRequest))
    }

    isRefreshing = true

    try {
      // 👉 refresh token
      const refreshResponse = await bffApi.post(
        '/auth/refresh',
        {},
        {
          headers: {
            cookie: cookies().toString(),
          },
        }
      )

      processQueue(null, refreshResponse.data)

      return bffApi(originalRequest)
    } catch (err) {
      processQueue(err)
      throw err
    } finally {
      isRefreshing = false
    }
  }
)
