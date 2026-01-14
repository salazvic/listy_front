import { userSocket } from "@/lib/socket"
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
    const socketUser = userSocket()

    if(!socketUser) return 

    socketUser.emit(Events.USER_CONNECTED, {userId})

    socketUser.on(Events.USER_PROFILE, (payload => {
      addUser(payload)
    })
    )
    socketUser.on(Events.LIST_CREATED, (newList) => {
      upsertList(newList)
    })

    socketUser.on(Events.LIST_DELETED, (idList) => {
      if(!idList) return
      deleteList(idList)
    })

    socketUser.on(Events.LIST_UPDATED, (payload) => {

      const activeListId = useListStore.getState().activeListId

      if(activeListId === payload.id) return
      
      updateList(payload.id, payload.name)
    })

    socketUser.on(Events.SHARED_ADDED, (payload) => {
      if (payload.userId !== userId) return
      addUserList(payload.listId, payload)
    })


    return () => {
      socketUser.emit(Events.USER_DISCONNECTED, {userId})
      socketUser.off(Events.USER_PROFILE)
      socketUser.off(Events.LIST_CREATED)
      socketUser.off(Events.LIST_DELETED) 
      socketUser.off(Events.LIST_UPDATED) 
      socketUser.off(Events.SHARED_ADDED)
    }     
  },[userId])
}