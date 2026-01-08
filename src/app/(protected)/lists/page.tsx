'use client'

import { ListCard } from "@/app/components/lists/ListCard"
import Modal from "@/app/components/Modal"
import { ListService } from "@/services/list.service"
import { useListStore } from "@/stores/lists.store"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useUserStore } from "@/stores/useUserStore"
import { UserService } from "@/services/user.service"

export default function ListsPage() {  
  const [open, setOpen] = useState(false)

  const listsAll = useListStore(
    useShallow(s => Object.values(s.listsById))
  ) 
  const setLists = useListStore(s => s.setLists)
  const setAllUsers = useUserStore(s => s.setAllUsers)

  const lists = listsAll.filter((list: any) => list.role === 'OWNER')

  useEffect(() => {
    const getLists = async() => {
      const data = await ListService.getLists()
      const dataUSers = await UserService.allUsers()

      setAllUsers(dataUSers)
      setLists(data)
    }
    getLists()
  }, [])

  const createList = async (nameList: string) => {
    await ListService.createList(nameList)
    setOpen(false)
  }

  const deleteList = async (id: string) => {
    await ListService.deleteList(id)
  }

  return (
    <div className="flex flex-col gap-6 mb-6">
      <Modal 
        isOpen={open}
        title="Nueva lista"
        mode="simple"
        placeholder="Nombre de la lista"
        onSubmit={(payload) => {
          if (payload.type === 'simple') {
            createList(payload.value)
          }
        }}
        onClose={() => setOpen(false)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="
            text-2xl md:text-3xl
            font-extrabold
            tracking-tight
            text-[#ecebeb]
          ">
            Mis listas
            <span className="ml-2 text-xl text-[#A8DADC] font-medium">
              ({lists.length})
            </span>
          </h1>

          <p className="text-sm text-[#b6e3ff]">
            Organiza y comparte tus compras
          </p>
        </div>

        <button 
          className="
            flex items-cemter justify-center gap-2
            bg-[#457B9D] text-white 
            hover:bg-white hover:text-[#457B9D]
            transition cursor-pointer
            
            w-12 h-12 md:w-auto md:h-auto
            rounded-full md:rounded-xl
            px-0 md:px-4 
            py-0 md:py-2  
          "
          onClick={() => setOpen(!open)}
        >
          <span className="text-3xl font-bold flex items-center">+</span>
          <span className="hidden md:flex md:items-center"> Nueva Lista </span>
        </button>      
      </div>

      <div 
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {lists.map(list => (
          <ListCard 
            key={list?.id} 
            list={list} 
            onSubmit={() => deleteList(list?.id)}            
          />
        ))}
      </div>
    </div>
  )
}