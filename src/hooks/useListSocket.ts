import { getListSocket } from "@/lib/socket"
import { useListStore } from "@/stores/lists.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useListSocket(idList: string) {
  const updateList = useListStore(s => s.updateList)

  useEffect(() => {
    const listSocket = getListSocket()

    if(!listSocket) return

    listSocket.emit(Events.LIST_JOIN, { listId: idList }) 

    listSocket.on(Events.LIST_UPDATED, (payload) => {
      updateList(payload.id, payload.name)
    })

    return () => {
      listSocket.emit(Events.LIST_LEFT, {listId: idList});
      listSocket.off(Events.LIST_UPDATED)
    }     
  },[idList])
}
