// lib/bffServerRequest.ts
import { cookies } from 'next/headers'
import { bffApi } from './api.bff'

export async function bffServerRequest<T>(
  fn: (cookieHeader: string) => Promise<T>
) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  try {
    return await fn(cookieHeader)
  } catch (error: any) {
    if (error.response?.status !== 401) {
      throw error
    }

    // 👉 intento refresh (endpoint público)
    try {
      await bffApi.post(
        '/auth/refresh',
        {},
        { headers: { Cookie: cookieHeader } }
      )

      // reintento request original
      return await fn(cookieHeader)
    } catch {
      throw new Error('UNAUTHORIZED')
    }
  }
}
