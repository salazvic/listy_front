import { listSocket } from "@/lib/socket"
import { useListStore } from "@/stores/lists.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useListSocket(idList: string) {
  const updateList = useListStore(s => s.updateList)

  useEffect(() => {
    const socketList = listSocket()

    if(!socketList) return

    socketList.emit(Events.LIST_JOIN, { listId: idList }) 

    socketList.on(Events.LIST_UPDATED, (payload) => {
      updateList(payload.id, payload.name)
    })

    return () => {
      socketList.emit(Events.LIST_LEFT, {listId: idList});
      socketList.off(Events.LIST_UPDATED)
    }     
  },[idList])
}
