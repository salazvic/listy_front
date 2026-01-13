'use client'

import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import { ItemService } from '@/services/item.service';
import { useItemStore } from '@/stores/item.store';
import { useUserSocket } from '@/hooks/useUserSocket';

export default function ProtectedLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter()
  const setItems = useItemStore(s => s.setItem)
  const user = useAuthStore(s => s.user)
  
  useUserSocket(user?.id! )
    
  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user])

  useEffect(() => {
    const getItems = async() => {

      const data = await ItemService.getItems()
      setItems(data)
    } 
    getItems()
  }, [])

  return (
    <ProtectedRoute>
      <Navbar />
      <main className='pt-18'>
        {children}
      </main>
    </ProtectedRoute>
  )
}
