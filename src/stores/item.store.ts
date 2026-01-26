import { create } from "zustand";

interface Item {
  id: string,
  name: string,
  imageUrl?: string,
  imagePublicId?: string
}

interface ItemState {
  items: Item[]

  setItem: (item: Item[]) => void
  addItem: (item: Item) => void 
  reset: () => void
}

const initialState = {
  items: [],
}

export const useItemStore = create<ItemState>((set) =>
({
  ...initialState,

  setItem: (items) => {
    if(!Array.isArray(items)) {
      return
    }
    set(() => ({items }))
  },

  addItem: (item) =>
    set((state) => {
      const exists = state.items.some(i => i.name === item.name)
      if(exists) return state

      return {
        items: [item, ...state.items]
      }
    }),

  reset: () => set(initialState),
}))