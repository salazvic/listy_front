'use client'

import { disconnectSockets, connectSockets } from "@/lib/socket"
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
        setAuth(user)
        
        if(useAuthStore.getState().access_token) {
          connectSockets()
        }
      } catch {
        try {
          const tokens = await authService.refresh()
          console.log("AUTHPROVIDER refreshtoken:", tokens)

          const user = await authService.me()
          setAuth(user)

          if(useAuthStore.getState().access_token) {
          connectSockets()
        }
        } catch {
          logout()
          disconnectSockets()
        }
      }
    }
    loadUser()
  }, [])

  return <>{children}</>
}