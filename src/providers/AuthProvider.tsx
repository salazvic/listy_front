'use client'

import { useEffect, ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { connectSockets, disconnectSockets } from '@/lib/socket'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)
  const logout = useAuthStore(state => state.logout)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.me()
        setAuth(user)
        connectSockets()
      } catch {
        logout()
        disconnectSockets()
      }
    }

    loadUser()
  }, [])

  return <>{children}</>
}
