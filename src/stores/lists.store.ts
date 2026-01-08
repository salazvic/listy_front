import { List, ListItem, Shared } from '@/types/types'
import { create } from 'zustand'

type ListUIState = {
  activeListId: string | null
  setActiveList: (id: string | null) => void
}

interface ListState {
  listsById: Record<string, List>
  activeListId: string | null
  allPurchased: boolean | null

  setLists: (lists: List[]) => void
  setActiveList: (id: string | null) => void

  upsertList: (list: List) => void
  deleteList: (listId: string) => void
  
  addItemList: (listId: string, item: ListItem) => void
  updateList: (listId: string, name: string) => void
  updateItemList: (listId: string, dataUpdate: ListItem ) => void
  updateAllItemList: (listid: string, payload: any) => void
  deleteItemList: (listId: string, idItem: string) => void
  setAllPurchased: (purchased: boolean) => void
  
  addUserList: (idUser: string, newShared: any ) => void
  deleteUserList: (listId: string, sharedId: string) => void
  changeRoleUser: (listId: string, sharedId: string, role: 'editor' | 'viewer') => void

  reset: () => void
}

const normalizeItem = (item: any) => ({
  ...item,
  price: Number(item.price),
  quantity: Number(item.quantity),
})

const initialState = {
  listsById: {},
}

export const useListStore = create<ListState>((set) => ({
  ...initialState,
  activeListId: null,
  allPurchased: null,

  setActiveList: (id) => set({activeListId: id}),

  setAllPurchased: (purchased: boolean) => {
    set((state) => ({
      allPurchased: purchased
    }))},
  
  // Todas las listas
  setLists: (lists) =>
    set((state) => {
      const mapped = { ...state.listsById }

      lists.forEach((list) => {
        const prev = mapped[list.id]

        mapped[list.id] = {
          ...prev,
          ...list,
          items: prev?.items ?? list.items ?? [],
          isFull: prev?.isFull ?? false
        }
      })

      return { listsById: mapped }
    }),

  // Una lista
  upsertList: (list) =>
    set((state) => ({
      listsById: {
        ...state.listsById,
        [list.id]: {
          ...state.listsById[list.id],
          ...list,
          items: list.items?.map(normalizeItem),
          isFull: true
        },
      }
    })),

  deleteList: (id) => 
    set((state) => {
      const{[id]: _, ...rest} = state.listsById

      return {
        listsById: rest
      }
    }),
  
  addItemList: (listId, newItem) => {
    set((state) => {
      const list = state.listsById[listId]
      if(!list) return state

      const exists = list.items?.some(i => i.id === newItem.id)
      if(exists) return state

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            items: [
              newItem,
              ...(list.items ?? [])
            ]
          }
        }
      }
    })
  },

  updateList: (listId, newName) => {
    set((state) => {
      const current = state.listsById[listId]
      if (!current || current.name === newName) return state

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...current,
            name: newName
          }
        }
      }
    })
  },

  updateItemList: (listId, itemUpdate) =>
    set((state) => {
      const list = state.listsById[listId]
      if (!list) return state

      const newItems = list?.items?.map(item =>
        item.id === itemUpdate.id
          ? {
              ...item,
              ...itemUpdate,
              price: Number(itemUpdate.price),
              quantity: Number(itemUpdate.quantity),
            }
          : item
      )

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            items: newItems, 
          },
        },
      }
  }),

  updateAllItemList: (listid, payload) => {
    set((state) => {
      const list = state.listsById[listid]
      if(!list) return state

      const newItems = list?.items?.map(item =>
        item.purchased !== payload.purchased
        ? {
          ...item,
          purchased: payload.purchased,
          purchasedById: payload.purchasedById
        }
        : item
      )

      return {
        listsById: {
          ...state.listsById,
          [listid]: {
            ...list,
            items: newItems
          }
        }
      }
    })
  },

  deleteItemList: (listId, idItem) => 
    set((state) => {
      const list = state.listsById[listId]
      if(!list) return state

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            items: list.items?.filter(item => item.id !== idItem)
          }
        }
      }   
    }),
  
  addUserList: (listId, newShared) => {
    set((state) => {
      const list = state.listsById[listId]
      if(!list) return state

      const alreadyExists = list?.shared?.some(
        user => user?.id === newShared.id
      )

      if(alreadyExists) return state
      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            shared: [...(list.shared ?? []), newShared]
          }
        }
      }
    })
  },

  deleteUserList: (listId, sharedId) => {
    set((state) => {
      const list = state.listsById[listId]
      if(!list) return state

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            shared: list.shared?.filter(user => user.id !== sharedId)
          }
        }
      }
    }) 
  },

  changeRoleUser: (listId, sharedId, role) => {
    set((state) => {
      const list = state.listsById[listId]
      if(!list) return state

      const newShared = list?.shared?.map(user =>
        user.id === sharedId
        ? {
          ...user,
          role
        }
        : user
      )

      return {
        listsById: {
          ...state.listsById,
          [listId]: {
            ...list,
            shared: newShared
          }
        }
      }
    })
  },
  
  reset: () => set(initialState),
}))
