'use client'

import { useUserSocket } from "@/hooks/useUserSocket"
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

          console.log("AUTHPROVIDER tokens:", tokens)
          api.defaults.headers.common.Authorization = `Bearer ${tokens?.access_token}`

          const user = await authService.me()
          setAuth(user, tokens?.access_token, tokens.refresh_token)
        } catch {
          delete api.defaults.headers.common.Authorization
          logout()
        }
      }
    }
    loadUser()
  }, [])

  return <>{children}</>
}