'use client'

import { ListCard } from "@/app/components/lists/ListCard"
import { SharedService } from "@/services/shared.service"
import { useListStore } from "@/stores/lists.store"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"

export default function SharedListdPage() {
  const lists = useListStore(useShallow(s => Object.values(s.listsById)))
  const setSharedList = useListStore(s => s.setLists)

  useEffect(() => {
    const getShared = async() => {
      const data = await SharedService.getSharedList()
      const sharedList = data.map((s: any) => ({
        ...s,
        role: s.role,
        isFull: false
      }))
      setSharedList(sharedList)
    }
    getShared()
  }, [lists])

  const sharedNewlist = lists.filter((list: any) => list.role !== 'OWNER')

  return (
   <div className="flex flex-col gap-6 mb-6">   
    <div className="flex items-center justify-between">
      <div>
        <h1 className="
          text-2xl md:text-3xl
          font-extrabold
          tracking-tight
          text-[#ecebeb]
        ">
          Mis listas compartidas
          <span className="ml-2 text-xl text-[#A8DADC] font-medium">
            ({sharedNewlist.length})
          </span>
        </h1>

        <p className="text-sm text-[#b6e3ff]">
          Listas donde te agregaron
        </p>
      </div>     
    </div>

    <div 
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {sharedNewlist.map(list => (
        <ListCard 
          key={list?.id} 
          list={list} 
          onSubmit={() => (list?.id)}            
        />
      ))}
    </div>
  </div>
  )
}