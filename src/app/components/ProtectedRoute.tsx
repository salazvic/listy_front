'use client'

import { useUserSocket } from "@/hooks/useUserSocket";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({children}: {children: ReactNode}) {
  const isAuth = useAuthStore(s => s.isAuthenticated)
  const user = useAuthStore(s => s.user)
  const router = useRouter()

  useEffect(() => {
    if(!isAuth) router.replace('/login')
  }, [isAuth])

  if(!isAuth) return null
  return children
}