import { itemSocket } from "@/lib/socket"
import { useItemStore } from "@/stores/item.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useItemSocket() {
  const addItem = useItemStore(s => s.addItem)

  useEffect(() => {
    const socketItem = itemSocket()

    if(!socketItem) return

    socketItem.on(Events.ITEM_CREATED, (item) => {
      addItem(item)
    })

    return () => {
      socketItem.off(Events.ITEM_CREATED) 
    }     
  },[])
}