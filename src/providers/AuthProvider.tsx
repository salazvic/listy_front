'use client'

import { useUserSocket } from "@/hooks/useUserSocket"
import { disconnectSockets, reconnectSockests } from "@/lib/socket"
import api from "@/services/api"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/stores/auth.store"
import { useEffect, ReactNode } from "react"

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)
  const logout = useAuthStore(state => state.logout)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.me()
        setAuth(user, null, null)
      } catch (error) {
        try {
          const tokens = await authService.refresh()
          console.log("AUTHPROVIDER refreshtoken:", tokens)

          if (!tokens?.access_token) {
            throw new Error('No access token')
          }

          api.defaults.headers.common.Authorization = `Bearer ${tokens?.access_token}`
          reconnectSockests()

          const user = await authService.me()
          setAuth(user, null, null)
        } catch {
          logout()
          disconnectSockets()
          delete api.defaults.headers.common.Authorization
        }
      }
    }
    loadUser()
  }, [])

  return <>{children}</>
}