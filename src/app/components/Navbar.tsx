'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { routes } from '@/lib/routes'
import { Menu, X, LogOut, User } from 'lucide-react'
import { authService } from '@/services/auth.service'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useAuthStore(s => s.user)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await authService.logout()    
    router.push('/login')
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="
        fixed top-0 left-0 z-50
        w-full 
        flex items-center justify-between 
        px-6 py-4 
        bg-[#A8DADC] 
        border-b border-[#457b9d]/30">
        {/* LEFT */}
        <p className="md:flex items-center font-medium text-[#1D3557] hidden md:block text-2xl text-transform: capitalize font-style: italic">
        <User size={26} />
          {user?.name}
        </p>

        {/* RIGHT - DESKTOP */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {routes.map(route => {
            const isActive = pathname === route.link

            return (
              <Link
                key={route.link}
                href={route.link}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition
                  ${
                    isActive
                      ? 'bg-white text-[#1D3557] shadow-md font-semibold'
                      : 'hover:bg-white/60 text-[#457B9D] font-extrabold'
                  }
                `}
              >
                {route.icon}
                {route.name}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-[#1D3557]"
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`
          fixed inset-0 z-50 bg-black/40 transition
          ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-64 bg-[#F1FAEE]
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <p className="font-semibold text-[#1D3557]">
            {user?.name}
          </p>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {routes.map(route => {
            const isActive = pathname === route.link

            return (
              <Link
                key={route.link}
                href={route.link}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${
                    isActive
                      ? 'bg-[#A8DADC] text-[#1D3557] font-semibold'
                      : 'hover:bg-[#A8DADC]/60 text-[#1D3557]'
                  }
                `}
              >
                {route.icon}
                {route.name}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
