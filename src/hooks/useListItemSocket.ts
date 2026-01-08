import { getListItemSocket } from "@/lib/socket"
import { useListStore } from "@/stores/lists.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useListItemSocket(idList: string | null) {
  const addItemList = useListStore(s => s.addItemList)
  const updateItemList = useListStore(s => s.updateItemList)
  const deleteItemList = useListStore(s => s.deleteItemList)
  const updateAllItemList = useListStore(s => s.updateAllItemList)
  const setAllPurchased = useListStore(s => s.setAllPurchased)

  useEffect(() => {
    const listItemSocket = getListItemSocket()

    if(!listItemSocket) return

    listItemSocket.emit(Events.LIST_JOIN, { listId: idList }) 

    listItemSocket.on(Events.ITEM_LIST_ADDED, (payload: any) => {
      const newItem = {
        id: payload?.id,
        name: payload?.item?.name,
        quantity: payload?.quantity,
        price: payload?.price 
      } 

      addItemList(payload.listId, payload)
    })

    listItemSocket.on(Events.ITEM_LIST_UPDATED, (payload) => {
      updateItemList(payload?.listId, payload)
    })

    listItemSocket.on(Events.ALL_ITEM_LIST_UPDATED, (payload) => {
      setAllPurchased(payload.purchased)
      updateAllItemList(payload?.listId, payload)
    })

    listItemSocket.on(Events.ITEM_LIST_DELETED, (payload: any) => {
      deleteItemList(payload.listId, payload.id)
    })
    
    return () => {
      listItemSocket.off(Events.LIST_LEFT)
      listItemSocket.off(Events.ITEM_LIST_ADDED);
      listItemSocket.off(Events.ALL_ITEM_LIST_UPDATED)
      listItemSocket.off(Events.ITEM_LIST_UPDATED)
    }     
  },[])
}