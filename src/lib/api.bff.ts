import axios from 'axios'

export const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // backend real
  withCredentials: true,
})
