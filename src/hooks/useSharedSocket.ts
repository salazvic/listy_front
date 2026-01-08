import { getSharedListSocket } from "@/lib/socket";
import { useListStore } from "@/stores/lists.store";
import { Events } from "@/types/events.types";
import { useEffect } from "react";

export function useSharedSocket(idList: string) {
  const newUserAdded = useListStore(s => s.addUserList)
  const userDelete = useListStore(s => s.deleteUserList)
  const changeRole = useListStore(s => s.changeRoleUser)

  useEffect(() => {
    const sharedSocket = getSharedListSocket()

    if(!sharedSocket) return

    sharedSocket.emit(Events.LIST_JOIN, { listId: idList }) 
    
    sharedSocket.on(Events.SHARED_ADDED, (payload) => {
      newUserAdded(payload.listId, payload)
    })

    sharedSocket.on(Events.SHARED_REMOVED, (payload) => {
      userDelete(payload.listId, payload.id)
    })

    sharedSocket.on(Events.SHARED_USER_ROL, (payload) => {
      changeRole(payload.listId, payload.id, payload.role)
    })

    return () => {
      sharedSocket.off(Events.LIST_LEFT)
      sharedSocket.off(Events.SHARED_ADDED)
      sharedSocket.off(Events.SHARED_REMOVED)
    }
  }, [])
}

