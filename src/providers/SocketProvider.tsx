'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { disconnectSockets, reconnectSockests } from '@/lib/socket'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore(state => state.access_token)
  const isAuth = !!accessToken

  useEffect(() => {
    if (isAuth) {
      reconnectSockests()
    } else {
      disconnectSockets()
    }
  }, [isAuth])

  return <>{children}</>
}
