'use client'

import { useItemSocket } from "@/hooks/useItemSocket"

export function SocketProvider({children} : {children: React.ReactNode}) {

  useItemSocket()

  return <>{children}</>
}