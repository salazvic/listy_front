import { SharedService } from "@/services/shared.service"
import { useAuthStore } from "@/stores/auth.store"
import { useEffect, useRef, useState } from "react"

export function ListUsers({list}: {list: any}  ) {
  const users = list?.shared
  const userSesion = useAuthStore(s => s.user)
  const isOwner = list?.ownerId === userSesion?.id
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [roles, setRoles] = useState<Record<string, 'editor' | 'viewer'>>({})
  const ref = useRef<HTMLDivElement>(null)
  
  const onChangeRole = async(sharedId: string, role: 'editor' | 'viewer') => {
    setRoles(prev => ({
      ...prev,
      [sharedId]: prev[sharedId] === 'editor' ? 'viewer' : 'editor'
    }))
    try {
      await SharedService.changeRoleUser(list.id, sharedId, role)
      setTimeout(() => {
        setOpenMenu(null)
      }, 1000)
    } catch (error) {
      setRoles(prev => ({
        ...prev,
        [sharedId]: prev[sharedId] === 'editor' ? 'viewer' : 'editor'
      }))
    }
  }

  const onRemoveUser = async(sharedId: string) => {
    const confirm = window.confirm("Borrar usuario?")

    if(confirm) {
      await SharedService.deleteUSerList(list.id, sharedId)
      window.alert( "Usuario borrado")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if( ref.current && !ref.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    if (!users) return

    const map: Record<string, 'editor' | 'viewer'> = {}
    users.forEach((u: any) => {
      map[u.id] = u.role
    })

    setRoles(map)
  }, [users])

  return (
    <div>
      <h2 className="text-sm text-gray-600 mb-1">
        Propietario: <span className="font-medium text-gray-800">{list?.owner?.name}</span> 🔒
      </h2>

      <h3 className="text-lg font-medium mb-2">USUARIOS</h3>
      {users?.length === 0 
        ? <h4 className="text-lg text-black">No hay usuarios agregados a la lista</h4> 
        : (<ul className="space-y-2">
          {users?.map((u: any) => (
            <li key={u.id} className="flex items-center gap-2 text-sm relative">

              {/* AVATAR */}
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm uppercase">
                {u?.user?.name[0]}
              </div>

              {/* NOMBRE */}
              <div className="flex flex-col">
                <span className="text-sm font-medium uppercase">{u?.user?.name}</span>
                <span className="text-xs text-gray-600">{u?.user?.email}</span>
              </div>

              {/* ROL */}
              <span className="ml-auto text-md text-gray-700">
                {u?.role === 'viewer' ? 'observador' : 'editor'}
              </span>

              {/* MENU */}
              {isOwner && (
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    setOpenMenu(openMenu === u.id ? null : u.id)
                  }
                > ⋮ </button>
              )}

              {/* MENU CONTEXTUAL */}
              {openMenu === u.id && (
                <div
                  ref={ref}
                  className="absolute right-0 top-10 w-44 bg-white border rounded-md shadow-lg z-20 p-3 space-y-3"
                >
                  {/* TOGGLE ROL */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{roles[u.id] === 'editor' ? 'Editor' : 'Observador'}</span>

                    <button
                      onClick={() => onChangeRole(
                        u.id,
                        u.role === 'editor' ? 'viewer' : 'editor'
                      )}
                      className={`relative w-10 h-5 rounded-full transition 
                        ${u.role === 'editor' ? 'bg-green-600' : 'bg-gray-300'}
                      `}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform
                          ${u.role === 'editor' ? 'translate-x-5' : ''}
                        `}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    {u.role === 'editor'
                      ? 'Puede editar la lista'
                      : 'Solo puede ver la lista'}
                  </p>

                  <div className="border-t" />

                  {/* QUITAR ACCESO */}
                  <button
                    onClick={() => {
                      onRemoveUser(u.id)
                      setOpenMenu(null)
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Quitar acceso
                  </button>
                </div>
              )}

            </li>
          ))}
        </ul>)
      }
    </div>
  )
}