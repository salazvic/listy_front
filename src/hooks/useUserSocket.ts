import { getUserSocket } from "@/lib/socket"
import { useListStore } from "@/stores/lists.store"
import { useUserStore } from "@/stores/useUserStore"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useUserSocket(userId: string | null) {
  const addUser = useUserStore(s => s.addUser)
  const upsertList = useListStore(s => s.upsertList)
  const deleteList = useListStore(s => s.deleteList)
  const updateList = useListStore(s => s.updateList)
  const addUserList = useListStore(s => s.addUserList)

  useEffect(() => {
    if (!userId) return 
    const userSocket = getUserSocket()

    if(!userSocket) return 

    userSocket.emit(Events.USER_CONNECTED, {userId})

    userSocket.on(Events.USER_PROFILE, (payload => {
      addUser(payload)
    })
    )
    userSocket.on(Events.LIST_CREATED, (newList) => {
      upsertList(newList)
    })

    userSocket.on(Events.LIST_DELETED, (idList) => {
      if(!idList) return
      deleteList(idList)
    })

    userSocket.on(Events.LIST_UPDATED, (payload) => {

      const activeListId = useListStore.getState().activeListId

      if(activeListId === payload.id) return
      
      updateList(payload.id, payload.name)
    })

    userSocket.on(Events.SHARED_ADDED, (payload) => {
      if (payload.userId !== userId) return
      addUserList(payload.listId, payload)
    })


    return () => {
      userSocket.emit(Events.USER_DISCONNECTED, {userId})
      userSocket.off(Events.USER_PROFILE)
      userSocket.off(Events.LIST_CREATED)
      userSocket.off(Events.LIST_DELETED) 
      userSocket.off(Events.LIST_UPDATED) 
      userSocket.off(Events.SHARED_ADDED)
    }     
  },[userId])
}