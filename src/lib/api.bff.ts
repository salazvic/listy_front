import axios, { AxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'

export const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // backend real
  withCredentials: true,
})

bffApi.interceptors.request.use(async config => {
  const cookieStore = await cookies()

  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  if (cookieHeader) {
    config.headers.Cookie = cookieHeader
  }

  return config
})

