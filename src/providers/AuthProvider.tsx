'use client'

import { useUserSocket } from "@/hooks/useUserSocket"
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
        setAuth(user, null)
      } catch (error) {
        try {
          await authService.refresh()
          const user = await authService.me()
          setAuth(user, null)
        } catch {
          logout()
        }
      }
    }
    loadUser()
  }, [])

  return <>{children}</>
}