'use client'

import { Input } from "@/components/ui/input"
import { ListService } from "@/services/list.service"
import { useListStore } from "@/stores/lists.store"
import { List } from "@/types/types"
import { useEffect, useMemo, useRef, useState } from "react"

export function ListHeader({list} : {list: List }) {
  const [newName, setNewName] = useState(list?.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    const input = inputRef.current
    if (!input) return

    const length = input.value.length
    input.setSelectionRange(length, length)
  }

  if(!list) return null
  
  const items = useListStore(
    state => state?.listsById[list.id]?.items
  )

  const total = useMemo(() => {
    if(!items) return 0
    return (
      items.reduce(
        (acc, i) => acc + Number(i.price) * Number(i.quantity),
        0
      ) ?? 0
    )
  }, [items])

  
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    setNewName(e.target.value)
  }

  useEffect(() =>{
    if(!newName) return
    if(list.role !== 'OWNER') return

    const timeout = setTimeout(() => {
      ListService.updateList(list.id, newName)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [newName])

  if(!items) return null
  return (
    <div className="space-y-1">
      <Input
        disabled={list.role !== 'OWNER' && true}
        ref={inputRef}
        defaultValue={list?.name}
        onFocus={handleFocus}
        className="text-lg! text-black font-semibold! p-6"
        onChange={handleName}
      />
      <p className="text-sm font-bold text-[#4d4949]">
        {list?.items?.length} Productos · $ {total}
      </p>
    </div>
  )
}