import { redirect, useRouter } from "next/navigation";
import { cookies } from "next/headers";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { authService } from "@/services/auth.service";

export default async function Home() {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  useEffect(() => {
    const check = async () => {
      try {
        const user = await authService.me()
        setAuth(user, null)
        router.replace('/lists')
      } catch (error) {
        router.replace('/login')
      }
    }

    check()
  }, [])
}
