'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckSquare, Square, UserPlus } from "lucide-react"
import emailjs from '@emailjs/browser'
import { Button } from "@/components/ui/button"
import { ListService } from "@/services/list.service"
import { useListStore } from "@/stores/lists.store"
import { useUserStore } from "@/stores/useUserStore"
import { UserShared } from "@/types/types"
import { useItemStore } from "@/stores/item.store"
import { ItemService } from "@/services/item.service"
import { SharedService } from "@/services/shared.service"
import { UserService } from "@/services/user.service"
import Modal from "../Modal"
import { useAuthStore } from "@/stores/auth.store"

export function ListActions({list}: {list: any}) {
  const userId = useAuthStore(s => s.user?.id)
  const [openModal, setOpenModal] = useState(false)
  const [newItem, setNewITem] = useState("")
  const [type, setType] = useState('')
  const [role, setRole] = useState(list?.shared ? list?.shared : '')
  const paramsUrl = useParams()
  const router = useRouter()
  const setPurchase = useListStore(s => s.setAllPurchased)
  const allPurchased = useListStore(s => s.allPurchased)
  const allUsers = useUserStore(s => s.users)  
  const items = useItemStore(s => s.items)
  

  const dataUsers = allUsers.filter(user =>
    user?.id !== list?.ownerId &&
    !list?.shared?.some((shared: any) => shared?.userId === user?.id)
  )

  const handleUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setType("user")
    setOpenModal(!openModal)
  }

  const handleItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setType("item")
    setOpenModal(!openModal)
  }

  const addItem = async (value: any) => {
      
    if(value.isNew) {
      await ItemService.createItem(newItem)
      return
    }

    const addNewItem = {
      id: value.item.id,
      name: value.item.name,
      quantity: value.quantity,
      price: value.price 
    }

    await ListService.addItemList(list.id, addNewItem)
    //setOpenModal(false)
  }

  const searchItem = (term: any) => {
    setNewITem(term)
  }

  const addUser = async (user: UserShared) => {
    if (!list) return
    const exist = list?.shared?.some((shared: UserShared) => shared.id === user.id)
     if (exist) {
      alert('Usuario ya agregado')
      return
    }

    await SharedService.addUserList(list?.id, user)
  }

  const handlePurchased = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const shouldPurchase = list.items.some((item: any) => !item.purchased)
    
    setPurchase(shouldPurchase)
    const itemIds = list.items
      .filter((item: any) => item.purchased !== shouldPurchase)
      .map((item: any) => item.id)

    if(!itemIds.length) return 
    ListService.markAllPurchased(list.id, {
      purchased: shouldPurchase,
      itemIds
    })
  }

  const deleteList = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = paramsUrl.id as string
    const confirm = window.confirm("Eliminar lista?")

    if(confirm) {
      await ListService.deleteList(id)
      router.push('/lists')
    }
  }
  
  const enviarInvitacionPorEmail = async(email: string) => {
    if (!email.includes('@')) {
      throw new Error('Email inválido')
    }

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE!,
      {
        list_name: list.name,
        from_name: list.owner.name,
        link_invitacion: process.env.NEXT_PUBLIC_LINK_INVITACION,
        email,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )
    setOpenModal(false)
  }

  useEffect(() => {
    const getRol = () => {
      if(list.role === 'OWNER') {
        setRole('OWNER')
        return
      }
      const roleUpdate = list?.shared?.find((r: any) => r.user.id === userId)?.role
      setRole(roleUpdate)
    }

    getRol()
  }, [list?.shared])

  return (
    <>
      <Modal 
        isOpen={openModal}
        title="Agregar usuario a la lista"
        mode={type == 'user' ? 'user' : 'item'}
        placeholder="Busque por nombre o email"
        users={dataUsers}
        items={items?.map(i => ({id: i.id, name: i.name, imageUrl: i?.imageUrl}))}
        onSubmit={(payload) => {
          if (payload.type === 'user') {
            addUser({
              id: payload.user.id,
              role: payload.role,
            })
          }
          if (payload.type === 'simple') {
            enviarInvitacionPorEmail(payload.value)
          }
          if (payload.type === 'item') {
            addItem(payload)
          }
        }}
        onSearch={(term) => searchItem(term)}
        onClose={() => setOpenModal(false)}
      />

      <div className="space-y-2">
        <Button
          disabled={role === 'viewer' && true}
          className={`
            w-full 
            hover:bg-black/70 hover:cursor-pointer
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            transition-all duration-200
            shadow-sm
            hover:scale-[1.02]
            active:scale-95
            ${role === 'viewer' && 'hidden'}
          `}
          onClick={handleItem}
        >
          ➕ Agregar item
        </Button>

        <Button
          disabled={role !== 'OWNER' && true}
          variant="secondary" 
          className={`
            w-full 
            hover:cursor-pointer
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            transition-all duration-200
            shadow-sm
            hover:scale-[1.02]
            active:scale-95
            ${role === 'viewer' && 'hidden'}
          `}
          onClick={handleUser}
        >
          <UserPlus size={18}/>
          Agregar usuario
        </Button>

        <Button
          disabled={list?.items.length === 0 || list?.role === 'viewer' && true}
          onClick={handlePurchased}
          className={`
            w-full
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            transition-all duration-200
            border
            shadow-sm
            hover:scale-[1.02]
            active:scale-95
            hover:cursor-pointer
            ${role === 'viewer' && 'hidden'}
            ${
              allPurchased
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }
          `}
        >
          {allPurchased ? (
            <>
              <CheckSquare size={18} /> Desmarcar {" "}
            </>
          ) : (
            <>
              <Square size={18} /> Marcar {" "}
            </>
          )}
          todos
        </Button>


        <Button
          disabled={role !== 'OWNER' && true}
          onClick={deleteList}
          variant="destructive" 
          className={`
            w-full hover:bg-red-700/70
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            transition-all duration-200
            shadow-sm
            hover:scale-[1.02]
            active:scale-95
            ${role !== 'OWNER' && 'hidden'}
          `}
        >
          🗑️ Eliminar lista
        </Button>
      </div>
    </>
  )
}