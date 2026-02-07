import { listSocket } from "@/lib/socket"
import { useListStore } from "@/stores/lists.store"
import { Events } from "@/types/events.types"
import { useEffect } from "react"

export function useListSocket(listId: string) {
  const {
    upsertList,
    deleteList,
    addItemList,
    updateItemList,
    deleteItemList,
    addUserList,
    deleteUserList,
    changeRoleUser,
  } = useListStore()

  useEffect(() => {
    const socket = listSocket()
    if (!socket) return

    socket.emit(Events.LIST_JOIN, { listId })

    socket.on(Events.LIST_UPDATED, upsertList)
    socket.on(Events.LIST_DELETED, ({ listId }) => deleteList(listId))

    socket.on(Events.ITEM_LIST_ADDED, ({ listId, item }) =>
      addItemList(listId, item)
    )

    socket.on(Events.ITEM_UPDATED, ({ listId, item }) =>
      updateItemList(listId, item)
    )

    socket.on(Events.ITEM_DELETED, ({ listId, itemId }) =>
      deleteItemList(listId, itemId)
    )

    socket.on(Events.SHARED_ADDED, ({ listId, user }) =>
      addUserList(listId, user)
    )

    socket.on(Events.SHARED_USER_ROL, ({ listId, sharedId, role }) =>
      changeRoleUser(listId, sharedId, role)
    )

    return () => {
      socket.emit(Events.LIST_LEFT, { listId })
      socket.removeAllListeners()
    }
  }, [listId])
}

