'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { disconnectSockets, connectSockets } from '@/lib/socket'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      connectSockets()
    } else { 
      disconnectSockets()
    }
  }, [isAuthenticated])

  return <>{children}</>
}
