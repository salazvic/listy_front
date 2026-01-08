import { getItemSocket } from "@/lib/socket"
import { useItemStore } from "@/stores/item.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useItemSocket() {
  const addItem = useItemStore(s => s.addItem)

  useEffect(() => {
    const itemSocket = getItemSocket()

    if(!itemSocket) return

    itemSocket.on(Events.ITEM_CREATED, (item) => {
      addItem(item)
    })

    return () => {
      itemSocket.off(Events.ITEM_CREATED) 
    }     
  },[])
}